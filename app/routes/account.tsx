import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/account';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {Package, User, MapPin, LogOut} from 'lucide-react';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <div className="jfw-account-layout py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Heading */}
        <div className="jfw-account-header mb-8 md:mb-12">
          <div className="w-12 h-[2px] bg-jfw-blue mb-6" />
          <h1 className="jfw-account-heading font-heading text-2xl md:text-3xl lg:text-4xl uppercase tracking-[0.15em] text-jfw-white">
            {customer?.firstName ? (
              <>
                Welcome, <span className="text-jfw-blue">{customer.firstName}</span>
              </>
            ) : (
              heading
            )}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar Nav — Desktop */}
          <nav className="jfw-account-nav hidden lg:flex flex-col w-64 flex-shrink-0" role="navigation" aria-label="Account navigation">
            <div className="jfw-account-nav-inner sticky top-28 space-y-1">
              <AccountNavLink to="/account/orders" icon={Package} label="Orders" />
              <AccountNavLink to="/account/profile" icon={User} label="Profile" />
              <AccountNavLink to="/account/addresses" icon={MapPin} label="Addresses" />
              <div className="pt-4 mt-4 border-t border-jfw-gray">
                <Form method="POST" action="/account/logout">
                  <button
                    type="submit"
                    className="jfw-account-logout-btn w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </Form>
              </div>
            </div>
          </nav>

          {/* Mobile Tab Bar */}
          <nav className="jfw-account-mobile-nav lg:hidden flex items-center gap-1 overflow-x-auto pb-2 border-b border-jfw-gray -mx-4 px-4" role="navigation" aria-label="Account navigation">
            <AccountMobileTab to="/account/orders" icon={Package} label="Orders" />
            <AccountMobileTab to="/account/profile" icon={User} label="Profile" />
            <AccountMobileTab to="/account/addresses" icon={MapPin} label="Addresses" />
            <Form method="POST" action="/account/logout" className="flex-shrink-0">
              <button
                type="submit"
                className="jfw-account-mobile-logout flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-body text-xs text-gray-500 hover:text-red-400 whitespace-nowrap transition-colors duration-200"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </Form>
          </nav>

          {/* Content Area */}
          <div className="jfw-account-content flex-1 min-w-0">
            <Outlet context={{customer}} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountNavLink({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ComponentType<{size?: number; className?: string}>;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      prefetch="intent"
      className={({isActive}) =>
        `jfw-account-nav-link flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-all duration-200 ${
          isActive
            ? 'bg-jfw-blue/10 text-jfw-blue border border-jfw-blue/20'
            : 'text-gray-400 hover:text-jfw-white hover:bg-jfw-dark'
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}

function AccountMobileTab({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ComponentType<{size?: number; className?: string}>;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      prefetch="intent"
      className={({isActive}) =>
        `jfw-account-mobile-tab flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-body text-xs whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
          isActive
            ? 'bg-jfw-blue/10 text-jfw-blue'
            : 'text-gray-400 hover:text-jfw-white'
        }`
      }
    >
      <Icon size={14} />
      {label}
    </NavLink>
  );
}
