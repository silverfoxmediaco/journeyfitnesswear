import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import type {Route} from './+types/account.orders._index';
import {useRef} from 'react';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
  type OrderFilterParams,
} from '~/lib/orderFilters';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ShoppingBag, Search, X, ArrowRight} from 'lucide-react';

type OrdersLoaderData = {
  customer: CustomerOrdersFragment;
  filters: OrderFilterParams;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Journey Fitness Wear | Orders'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  const {data, errors} = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
      query,
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return {customer: data.customer, filters};
}

export default function Orders() {
  const {customer, filters} = useLoaderData<OrdersLoaderData>();
  const {orders} = customer;

  return (
    <div className="jfw-account-orders">
      <h2 className="font-heading text-lg md:text-xl uppercase tracking-[0.15em] text-jfw-white mb-6">
        Order History
      </h2>
      <OrderSearchForm currentFilters={filters} />
      <OrdersTable orders={orders} filters={filters} />
    </div>
  );
}

function OrdersTable({
  orders,
  filters,
}: {
  orders: CustomerOrdersFragment['orders'];
  filters: OrderFilterParams;
}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div className="jfw-orders-list" aria-live="polite">
      {orders?.nodes.length ? (
        <PaginatedResourceSection connection={orders}>
          {({node: order}) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

function EmptyOrders({hasFilters = false}: {hasFilters?: boolean}) {
  return (
    <div className="jfw-orders-empty text-center py-16">
      <div className="w-20 h-20 rounded-full bg-jfw-gray flex items-center justify-center mx-auto mb-6">
        <ShoppingBag size={32} className="text-gray-500" />
      </div>
      {hasFilters ? (
        <>
          <p className="font-body text-base text-gray-400 mb-2">
            No orders found matching your search.
          </p>
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-2 font-body text-sm text-jfw-blue hover:underline mt-4"
          >
            Clear filters
            <X size={14} />
          </Link>
        </>
      ) : (
        <>
          <h3 className="font-heading text-base uppercase tracking-[0.15em] text-jfw-white mb-2">
            No Orders Yet
          </h3>
          <p className="font-body text-sm text-gray-400 mb-8">
            Once you place an order, it will appear here.
          </p>
          <Link
            to="/collections"
            className="jfw-orders-empty-cta inline-flex items-center gap-3 bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading text-sm uppercase tracking-[0.2em] px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-jfw-glow-lg"
          >
            Start Shopping
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </>
      )}
    </div>
  );
}

function OrderSearchForm({
  currentFilters,
}: {
  currentFilters: OrderFilterParams;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData
      .get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)
      ?.toString()
      .trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber)
      params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="jfw-order-search bg-jfw-dark border border-jfw-gray rounded-xl p-4 md:p-6 mb-6"
      aria-label="Search orders"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-heading text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
              Order #
            </label>
            <input
              type="search"
              name={ORDER_FILTER_FIELDS.NAME}
              placeholder="Order number"
              aria-label="Order number"
              defaultValue={currentFilters.name || ''}
              className="jfw-order-search-input w-full bg-jfw-black border border-jfw-gray rounded-lg px-4 py-2.5 font-body text-sm text-jfw-white placeholder-gray-600 focus:outline-none focus:border-jfw-blue/50 focus:ring-1 focus:ring-jfw-blue/20 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block font-heading text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
              Confirmation #
            </label>
            <input
              type="search"
              name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
              placeholder="Confirmation number"
              aria-label="Confirmation number"
              defaultValue={currentFilters.confirmationNumber || ''}
              className="jfw-order-search-input w-full bg-jfw-black border border-jfw-gray rounded-lg px-4 py-2.5 font-body text-sm text-jfw-white placeholder-gray-600 focus:outline-none focus:border-jfw-blue/50 focus:ring-1 focus:ring-jfw-blue/20 transition-all duration-200"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:pb-0">
          <button
            type="submit"
            disabled={isSearching}
            className="jfw-order-search-btn inline-flex items-center gap-2 bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading text-xs uppercase tracking-[0.2em] px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-jfw-glow-lg disabled:opacity-50"
          >
            <Search size={14} />
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          {hasFilters && (
            <button
              type="button"
              disabled={isSearching}
              onClick={() => {
                setSearchParams(new URLSearchParams());
                formRef.current?.reset();
              }}
              className="jfw-order-clear-btn inline-flex items-center gap-1 border border-jfw-gray text-gray-400 hover:text-jfw-white font-heading text-xs uppercase tracking-[0.2em] px-5 py-2.5 rounded-lg transition-all duration-200 hover:border-jfw-blue/30"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function OrderItem({order}: {order: OrderItemFragment}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;

  const statusColor = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'FULFILLED' || s === 'SUCCESS') return 'text-green-400 bg-green-400/10';
    if (s === 'IN_PROGRESS' || s === 'PENDING') return 'text-yellow-400 bg-yellow-400/10';
    if (s === 'CANCELLED' || s === 'REFUNDED') return 'text-red-400 bg-red-400/10';
    return 'text-gray-400 bg-gray-400/10';
  };

  return (
    <div className="jfw-order-item bg-jfw-dark border border-jfw-gray rounded-xl p-5 md:p-6 mb-4 hover:border-jfw-blue/20 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Link
            to={`/account/orders/${btoa(order.id)}`}
            className="font-heading text-base uppercase tracking-[0.1em] text-jfw-white hover:text-jfw-blue transition-colors duration-200"
          >
            Order #{order.number}
          </Link>
          <p className="font-body text-xs text-gray-500">
            {new Date(order.processedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {order.confirmationNumber && (
            <p className="font-body text-xs text-gray-500">
              Confirmation: {order.confirmationNumber}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`jfw-order-status inline-block font-heading text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full ${statusColor(order.financialStatus)}`}>
            {order.financialStatus}
          </span>
          {fulfillmentStatus && (
            <span className={`jfw-order-fulfillment inline-block font-heading text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full ${statusColor(fulfillmentStatus)}`}>
              {fulfillmentStatus}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-jfw-gray/50">
        <span className="font-body text-sm text-jfw-white">
          <Money data={order.totalPrice} />
        </span>
        <Link
          to={`/account/orders/${btoa(order.id)}`}
          className="inline-flex items-center gap-1 font-body text-xs text-jfw-blue hover:underline"
        >
          View Order
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
