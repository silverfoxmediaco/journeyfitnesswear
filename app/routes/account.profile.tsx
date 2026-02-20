import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import type {Route} from './+types/account.profile';
import {Check} from 'lucide-react';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Journey Fitness Wear | Profile'}];
};

export async function loader({context}: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
    };
  } catch (error: any) {
    return data(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  return (
    <div className="jfw-account-profile">
      <h2 className="font-heading text-lg md:text-xl uppercase tracking-[0.15em] text-jfw-white mb-6">
        My Profile
      </h2>

      <div className="jfw-profile-card bg-jfw-dark border border-jfw-gray rounded-xl p-6 md:p-8">
        <Form method="PUT" className="space-y-6">
          <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="jfw-profile-label block font-heading text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="First name"
                aria-label="First name"
                defaultValue={customer.firstName ?? ''}
                minLength={2}
                className="jfw-profile-input w-full bg-jfw-black border border-jfw-gray rounded-lg px-4 py-3 font-body text-sm text-jfw-white placeholder-gray-600 focus:outline-none focus:border-jfw-blue/50 focus:ring-1 focus:ring-jfw-blue/20 transition-all duration-200"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="jfw-profile-label block font-heading text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Last name"
                aria-label="Last name"
                defaultValue={customer.lastName ?? ''}
                minLength={2}
                className="jfw-profile-input w-full bg-jfw-black border border-jfw-gray rounded-lg px-4 py-3 font-body text-sm text-jfw-white placeholder-gray-600 focus:outline-none focus:border-jfw-blue/50 focus:ring-1 focus:ring-jfw-blue/20 transition-all duration-200"
              />
            </div>
          </div>

          {/* Error / Success State */}
          {action?.error ? (
            <p className="jfw-profile-error text-red-400 text-sm font-body" role="alert">
              {action.error}
            </p>
          ) : action?.customer ? (
            <p className="jfw-profile-success inline-flex items-center gap-2 text-green-400 text-sm font-body" role="status" aria-live="polite">
              <Check size={16} />
              Profile updated successfully.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={state !== 'idle'}
            className="jfw-profile-save inline-flex items-center justify-center gap-2 bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading text-sm uppercase tracking-[0.2em] px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-jfw-glow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state !== 'idle' ? 'Updating...' : 'Save Changes'}
          </button>
        </Form>
      </div>
    </div>
  );
}
