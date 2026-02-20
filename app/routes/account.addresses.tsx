import type {CustomerAddressInput} from '@shopify/hydrogen/customer-account-api-types';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type Fetcher,
} from 'react-router';
import type {Route} from './+types/account.addresses';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';
import {Plus, MapPin} from 'lucide-react';

export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
  deletedAddress?: string | null;
  error: Record<AddressFragment['id'], string> | null;
  updatedAddress?: AddressFragment;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Journey Fitness Wear | Addresses'}];
};

export async function loader({context}: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    // this will ensure redirecting to login never happen for mutatation
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return data(
        {error: {[addressId]: 'Unauthorized'}},
        {
          status: 401,
        },
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address: CustomerAddressInput = {};
    const keys: (keyof CustomerAddressInput)[] = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        // handle new address creation
        try {
          const {data, errors} = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressCreate?.userErrors?.length) {
            throw new Error(data?.customerAddressCreate?.userErrors[0].message);
          }

          if (!data?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return {
            error: null,
            createdAddress: data?.customerAddressCreate?.customerAddress,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'PUT': {
        // handle address updates
        try {
          const {data, errors} = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(data?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!data?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return {
            error: null,
            updatedAddress: address,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'DELETE': {
        // handles address deletion
        try {
          const {data, errors} = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: {
                addressId: decodeURIComponent(addressId),
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressDelete?.userErrors?.length) {
            throw new Error(data?.customerAddressDelete?.userErrors[0].message);
          }

          if (!data?.customerAddressDelete?.deletedAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return {error: null, deletedAddress: addressId};
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      default: {
        return data(
          {error: {[addressId]: 'Method not allowed'}},
          {
            status: 405,
          },
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return data(
        {error: error.message},
        {
          status: 400,
        },
      );
    }
    return data(
      {error},
      {
        status: 400,
      },
    );
  }
}

export default function Addresses() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {defaultAddress, addresses} = customer;

  return (
    <div className="jfw-account-addresses">
      <h2 className="font-heading text-lg md:text-xl uppercase tracking-[0.15em] text-jfw-white mb-6">
        Addresses
      </h2>

      {!addresses.nodes.length ? (
        <div className="jfw-addresses-empty text-center py-12">
          <div className="w-16 h-16 rounded-full bg-jfw-gray flex items-center justify-center mx-auto mb-4">
            <MapPin size={24} className="text-gray-500" />
          </div>
          <p className="font-body text-gray-400 mb-2">No addresses saved yet.</p>
          <p className="font-body text-sm text-gray-500">Add your first address below.</p>
        </div>
      ) : null}

      {/* New Address Form */}
      <div className="jfw-new-address mb-8">
        <h3 className="font-heading text-sm uppercase tracking-[0.15em] text-gray-400 mb-4 flex items-center gap-2">
          <Plus size={16} className="text-jfw-blue" />
          Add New Address
        </h3>
        <NewAddressForm />
      </div>

      {/* Existing Addresses */}
      {addresses.nodes.length > 0 && (
        <div className="jfw-existing-addresses">
          <h3 className="font-heading text-sm uppercase tracking-[0.15em] text-gray-400 mb-4">
            Saved Addresses
          </h3>
          <ExistingAddresses
            addresses={addresses}
            defaultAddress={defaultAddress}
          />
        </div>
      )}
    </div>
  );
}

function NewAddressForm() {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: '',
    firstName: '',
    id: 'new',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  } as CustomerAddressInput;

  return (
    <AddressForm
      addressId={'NEW_ADDRESS_ID'}
      address={newAddress}
      defaultAddress={null}
    >
      {({stateForMethod}) => (
        <div className="pt-2">
          <button
            disabled={stateForMethod('POST') !== 'idle'}
            formMethod="POST"
            type="submit"
            className="jfw-address-create inline-flex items-center justify-center gap-2 bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading text-sm uppercase tracking-[0.2em] px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-jfw-glow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {stateForMethod('POST') !== 'idle' ? 'Creating...' : 'Create Address'}
          </button>
        </div>
      )}
    </AddressForm>
  );
}

function ExistingAddresses({
  addresses,
  defaultAddress,
}: Pick<CustomerFragment, 'addresses' | 'defaultAddress'>) {
  return (
    <div className="jfw-address-grid grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {addresses.nodes.map((address) => (
        <AddressForm
          key={address.id}
          addressId={address.id}
          address={address}
          defaultAddress={defaultAddress}
        >
          {({stateForMethod}) => (
            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={stateForMethod('PUT') !== 'idle'}
                formMethod="PUT"
                type="submit"
                className="jfw-address-save inline-flex items-center justify-center bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading text-xs uppercase tracking-[0.2em] px-6 py-2.5 rounded-lg transition-all duration-300 hover:shadow-jfw-glow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {stateForMethod('PUT') !== 'idle' ? 'Saving...' : 'Save'}
              </button>
              <button
                disabled={stateForMethod('DELETE') !== 'idle'}
                formMethod="DELETE"
                type="submit"
                className="jfw-address-delete inline-flex items-center justify-center border border-red-400/30 text-red-400 font-heading text-xs uppercase tracking-[0.2em] px-6 py-2.5 rounded-lg transition-all duration-300 hover:bg-red-400/10 hover:border-red-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {stateForMethod('DELETE') !== 'idle' ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </AddressForm>
      ))}
    </div>
  );
}

export function AddressForm({
  addressId,
  address,
  defaultAddress,
  children,
}: {
  addressId: AddressFragment['id'];
  address: CustomerAddressInput;
  defaultAddress: CustomerFragment['defaultAddress'];
  children: (props: {
    stateForMethod: (method: 'PUT' | 'POST' | 'DELETE') => Fetcher['state'];
  }) => React.ReactNode;
}) {
  const {state, formMethod} = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;

  const inputClasses =
    'jfw-address-input w-full bg-jfw-black border border-jfw-gray rounded-lg px-4 py-3 font-body text-sm text-jfw-white placeholder-gray-600 focus:outline-none focus:border-jfw-blue/50 focus:ring-1 focus:ring-jfw-blue/20 transition-all duration-200';
  const labelClasses =
    'jfw-address-label block font-heading text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2';

  return (
    <Form id={addressId} className="jfw-address-form bg-jfw-dark border border-jfw-gray rounded-xl p-5 md:p-6 space-y-4">
      {isDefaultAddress && (
        <span className="jfw-address-default-badge inline-block bg-jfw-blue/10 text-jfw-blue font-heading text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full">
          Default
        </span>
      )}

      <input type="hidden" name="addressId" defaultValue={addressId} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`firstName-${addressId}`} className={labelClasses}>First Name *</label>
          <input
            aria-label="First name"
            autoComplete="given-name"
            defaultValue={address?.firstName ?? ''}
            id={`firstName-${addressId}`}
            name="firstName"
            placeholder="First name"
            required
            type="text"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor={`lastName-${addressId}`} className={labelClasses}>Last Name *</label>
          <input
            aria-label="Last name"
            autoComplete="family-name"
            defaultValue={address?.lastName ?? ''}
            id={`lastName-${addressId}`}
            name="lastName"
            placeholder="Last name"
            required
            type="text"
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`company-${addressId}`} className={labelClasses}>Company</label>
        <input
          aria-label="Company"
          autoComplete="organization"
          defaultValue={address?.company ?? ''}
          id={`company-${addressId}`}
          name="company"
          placeholder="Company"
          type="text"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor={`address1-${addressId}`} className={labelClasses}>Address *</label>
        <input
          aria-label="Address line 1"
          autoComplete="address-line1"
          defaultValue={address?.address1 ?? ''}
          id={`address1-${addressId}`}
          name="address1"
          placeholder="Address line 1"
          required
          type="text"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor={`address2-${addressId}`} className={labelClasses}>Address Line 2</label>
        <input
          aria-label="Address line 2"
          autoComplete="address-line2"
          defaultValue={address?.address2 ?? ''}
          id={`address2-${addressId}`}
          name="address2"
          placeholder="Apartment, suite, etc."
          type="text"
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor={`city-${addressId}`} className={labelClasses}>City *</label>
          <input
            aria-label="City"
            autoComplete="address-level2"
            defaultValue={address?.city ?? ''}
            id={`city-${addressId}`}
            name="city"
            placeholder="City"
            required
            type="text"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor={`zoneCode-${addressId}`} className={labelClasses}>State *</label>
          <input
            aria-label="State/Province"
            autoComplete="address-level1"
            defaultValue={address?.zoneCode ?? ''}
            id={`zoneCode-${addressId}`}
            name="zoneCode"
            placeholder="State"
            required
            type="text"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor={`zip-${addressId}`} className={labelClasses}>Zip *</label>
          <input
            aria-label="Zip"
            autoComplete="postal-code"
            defaultValue={address?.zip ?? ''}
            id={`zip-${addressId}`}
            name="zip"
            placeholder="Zip code"
            required
            type="text"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`territoryCode-${addressId}`} className={labelClasses}>Country Code *</label>
          <input
            aria-label="Country code"
            autoComplete="country"
            defaultValue={address?.territoryCode ?? ''}
            id={`territoryCode-${addressId}`}
            name="territoryCode"
            placeholder="US"
            required
            type="text"
            maxLength={2}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor={`phoneNumber-${addressId}`} className={labelClasses}>Phone</label>
          <input
            aria-label="Phone Number"
            autoComplete="tel"
            defaultValue={address?.phoneNumber ?? ''}
            id={`phoneNumber-${addressId}`}
            name="phoneNumber"
            placeholder="+16135551111"
            pattern="^\+?[1-9]\d{3,14}$"
            type="tel"
            className={inputClasses}
          />
        </div>
      </div>

      <label className="jfw-address-default-check flex items-center gap-3 cursor-pointer">
        <input
          defaultChecked={isDefaultAddress}
          id={`defaultAddress-${addressId}`}
          name="defaultAddress"
          type="checkbox"
          className="w-4 h-4 rounded border-jfw-gray text-jfw-blue focus:ring-jfw-blue/20 bg-jfw-black"
        />
        <span className="font-body text-sm text-gray-400">Set as default address</span>
      </label>

      {error ? (
        <p className="text-red-400 text-sm font-body" role="alert">
          {error}
        </p>
      ) : null}

      {children({
        stateForMethod: (method) => (formMethod === method ? state : 'idle'),
      })}
    </Form>
  );
}
