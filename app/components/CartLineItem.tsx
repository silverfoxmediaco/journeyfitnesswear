import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {
  CartApiQueryFragment,
  CartLineFragment,
} from 'storefrontapi.generated';
import {Minus, Plus, Trash2} from 'lucide-react';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  return (
    <li key={id} className="jfw-cart-line border-b border-jfw-gray py-5 first:pt-0 last:border-b-0">
      <div className="jfw-cart-line-inner flex gap-4">
        {/* Product Image */}
        {image && (
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') close();
            }}
            className="jfw-cart-line-image flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-jfw-gray"
          >
            <Image
              alt={title}
              aspectRatio="1/1"
              data={image}
              height={100}
              loading="lazy"
              width={100}
              className="w-full h-full object-cover"
            />
          </Link>
        )}

        {/* Product Details */}
        <div className="jfw-cart-line-details flex-1 min-w-0">
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') close();
            }}
            className="group"
          >
            <p className="jfw-cart-line-title font-heading text-xs md:text-sm uppercase tracking-[0.1em] text-jfw-white group-hover:text-jfw-blue transition-colors duration-200 truncate">
              {product.title}
            </p>
          </Link>

          {/* Selected Options (Size, Color, etc.) */}
          <ul className="jfw-cart-line-options mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
            {selectedOptions.map((option) => (
              <li key={option.name}>
                <span className="font-body text-[10px] text-gray-500 uppercase tracking-wider">
                  {option.name}:
                </span>{' '}
                <span className="font-body text-[10px] text-gray-400">
                  {option.value}
                </span>
              </li>
            ))}
          </ul>

          {/* Price */}
          <div className="mt-2">
            <ProductPrice price={line?.cost?.totalAmount} />
          </div>

          {/* Quantity Controls */}
          <CartLineQuantity line={line} />
        </div>
      </div>

      {/* Child Line Items (warranties, gift wrapping, etc.) */}
      {lineItemChildren ? (
        <div className="mt-3 ml-24 md:ml-28">
          <p id={childrenLabelId} className="sr-only">
            Line items with {product.title}
          </p>
          <ul aria-labelledby={childrenLabelId} className="jfw-cart-line-children space-y-3">
            {lineItemChildren.map((childLine) => (
              <CartLineItem
                childrenMap={childrenMap}
                key={childLine.id}
                line={childLine}
                layout={layout}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="jfw-cart-line-quantity flex items-center gap-3 mt-3">
      {/* Quantity Selector */}
      <div className="flex items-center border border-jfw-gray rounded-lg overflow-hidden">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
            className="jfw-qty-btn w-8 h-8 flex items-center justify-center text-gray-400 hover:text-jfw-blue hover:bg-jfw-gray/50 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus size={14} />
          </button>
        </CartLineUpdateButton>

        <span className="jfw-qty-value w-10 h-8 flex items-center justify-center font-body text-sm text-jfw-white bg-jfw-dark border-x border-jfw-gray">
          {quantity}
        </span>

        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
            className="jfw-qty-btn w-8 h-8 flex items-center justify-center text-gray-400 hover:text-jfw-blue hover:bg-jfw-gray/50 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
          </button>
        </CartLineUpdateButton>
      </div>

      {/* Remove Button */}
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

/**
 * A button that removes a line item from the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className="jfw-cart-remove flex items-center gap-1.5 font-body text-[11px] uppercase tracking-wider text-gray-500 hover:text-red-400 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Trash2 size={13} />
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
