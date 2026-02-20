import {redirect, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/account.orders.$id';
import {Money, Image} from '@shopify/hydrogen';
import type {
  OrderLineItemFullFragment,
  OrderQuery,
} from 'customer-accountapi.generated';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';
import {ArrowLeft, ExternalLink, MapPin, Truck} from 'lucide-react';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Journey Fitness Wear | Order ${data?.order?.name}`}];
};

export async function loader({params, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);
  const {data, errors}: {data: OrderQuery; errors?: Array<{message: string}>} =
    await customerAccount.query(CUSTOMER_ORDER_QUERY, {
      variables: {
        orderId,
        language: customerAccount.i18n.language,
      },
    });

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  const {order} = data;

  // Extract line items directly from nodes array
  const lineItems = order.lineItems.nodes;

  // Extract discount applications directly from nodes array
  const discountApplications = order.discountApplications.nodes;

  // Get fulfillment status from first fulfillment node
  const fulfillmentStatus = order.fulfillments.nodes[0]?.status ?? 'N/A';

  // Get first discount value with proper type checking
  const firstDiscount = discountApplications[0]?.value;

  // Type guard for MoneyV2 discount
  const discountValue =
    firstDiscount?.__typename === 'MoneyV2'
      ? (firstDiscount as Extract<
          typeof firstDiscount,
          {__typename: 'MoneyV2'}
        >)
      : null;

  // Type guard for percentage discount
  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue'
      ? (
          firstDiscount as Extract<
            typeof firstDiscount,
            {__typename: 'PricingPercentageValue'}
          >
        ).percentage
      : null;

  return {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  };
}

export default function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData<typeof loader>();

  const statusColor = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'FULFILLED' || s === 'SUCCESS') return 'text-green-400 bg-green-400/10';
    if (s === 'IN_PROGRESS' || s === 'PENDING') return 'text-yellow-400 bg-yellow-400/10';
    if (s === 'CANCELLED' || s === 'REFUNDED') return 'text-red-400 bg-red-400/10';
    return 'text-gray-400 bg-gray-400/10';
  };

  return (
    <div className="jfw-order-detail">
      {/* Back Link */}
      <Link
        to="/account/orders"
        className="jfw-order-back inline-flex items-center gap-2 font-body text-sm text-gray-400 hover:text-jfw-blue transition-colors duration-200 mb-6"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="jfw-order-header mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <h2 className="font-heading text-lg md:text-xl uppercase tracking-[0.15em] text-jfw-white">
            Order {order.name}
          </h2>
          <span className={`jfw-order-detail-status inline-block font-heading text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full self-start ${statusColor(fulfillmentStatus)}`}>
            {fulfillmentStatus}
          </span>
        </div>
        <p className="font-body text-sm text-gray-500">
          Placed on{' '}
          {new Date(order.processedAt!).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        {order.confirmationNumber && (
          <p className="font-body text-xs text-gray-500 mt-1">
            Confirmation: {order.confirmationNumber}
          </p>
        )}
      </div>

      {/* Line Items */}
      <div className="jfw-order-items space-y-3 mb-8">
        <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">
          Items
        </h3>
        {lineItems.map((lineItem, index) => (
          <OrderLineCard key={lineItem.id || index} lineItem={lineItem} />
        ))}
      </div>

      {/* Order Summary + Shipping in a grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Summary */}
        <div className="jfw-order-summary bg-jfw-dark border border-jfw-gray rounded-xl p-5 md:p-6">
          <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">
            Order Summary
          </h3>

          <div className="space-y-3">
            {((discountValue && discountValue.amount) || discountPercentage) && (
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-gray-400">Discounts</span>
                <span className="font-body text-sm text-green-400">
                  {discountPercentage ? (
                    <span>-{discountPercentage}% OFF</span>
                  ) : (
                    discountValue && <Money data={discountValue!} />
                  )}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-gray-400">Subtotal</span>
              <span className="font-body text-sm text-jfw-white">
                <Money data={order.subtotal!} />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-gray-400">Tax</span>
              <span className="font-body text-sm text-jfw-white">
                <Money data={order.totalTax!} />
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-jfw-gray/50">
              <span className="font-heading text-xs uppercase tracking-[0.15em] text-jfw-white">Total</span>
              <span className="font-heading text-base text-jfw-blue">
                <Money data={order.totalPrice!} />
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="jfw-order-shipping bg-jfw-dark border border-jfw-gray rounded-xl p-5 md:p-6">
          <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
            <MapPin size={14} className="text-jfw-blue" />
            Shipping Address
          </h3>
          {order?.shippingAddress ? (
            <address className="not-italic space-y-1">
              <p className="font-body text-sm text-jfw-white">{order.shippingAddress.name}</p>
              {order.shippingAddress.formatted && (
                <p className="font-body text-sm text-gray-400">{order.shippingAddress.formatted}</p>
              )}
              {order.shippingAddress.formattedArea && (
                <p className="font-body text-sm text-gray-400">{order.shippingAddress.formattedArea}</p>
              )}
            </address>
          ) : (
            <p className="font-body text-sm text-gray-500">No shipping address defined</p>
          )}

          {/* Fulfillment Status */}
          <div className="mt-4 pt-4 border-t border-jfw-gray/50">
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-jfw-blue" />
              <span className="font-heading text-[10px] uppercase tracking-[0.2em] text-gray-400">Status</span>
            </div>
            <span className={`inline-block mt-2 font-heading text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full ${statusColor(fulfillmentStatus)}`}>
              {fulfillmentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* View Status Link */}
      <a
        target="_blank"
        href={order.statusPageUrl}
        rel="noreferrer"
        className="jfw-order-status-link inline-flex items-center gap-2 font-body text-sm text-jfw-blue hover:underline"
      >
        View Order Status on Shopify
        <ExternalLink size={14} />
      </a>
    </div>
  );
}

function OrderLineCard({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  return (
    <div className="jfw-order-line-card flex gap-4 bg-jfw-dark border border-jfw-gray rounded-xl p-4">
      {lineItem?.image && (
        <div className="jfw-order-line-image flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-jfw-gray">
          <Image data={lineItem.image} width={80} height={80} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-jfw-white font-medium truncate">
          {lineItem.title}
        </p>
        {lineItem.variantTitle && (
          <p className="font-body text-xs text-gray-500 mt-0.5">
            {lineItem.variantTitle}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="font-body text-xs text-gray-400">
            Qty: {lineItem.quantity}
          </span>
          <span className="font-body text-sm text-jfw-blue">
            <Money data={lineItem.price!} />
          </span>
        </div>
      </div>
    </div>
  );
}
