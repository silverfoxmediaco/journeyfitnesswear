import {useOptimisticCart, type OptimisticCartLine} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {ShoppingBag} from 'lucide-react';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};

/** Returns a map of all line items and their children. */
function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const children = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(children)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  return (
    <div className={`jfw-cart-main cart-main ${withDiscount ? 'jfw-cart-with-discount with-discount' : ''}`}>
      <CartEmpty hidden={linesCount} layout={layout} />

      <div className="jfw-cart-details">
        <p id="cart-lines" className="sr-only">
          Line items
        </p>
        <ul aria-labelledby="cart-lines" className="jfw-cart-lines-list">
          {(cart?.lines?.nodes ?? []).map((line) => {
            if (
              'parentRelationship' in line &&
              line.parentRelationship?.parent
            ) {
              return null;
            }
            return (
              <CartLineItem
                key={line.id}
                line={line}
                layout={layout}
                childrenMap={childrenMap}
              />
            );
          })}
        </ul>

        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

function CartEmpty({
  hidden = false,
  layout,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div
      hidden={hidden}
      className="jfw-cart-empty flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-jfw-gray flex items-center justify-center mb-6">
        <ShoppingBag size={32} className="text-gray-600" />
      </div>
      <h3 className="font-heading text-lg uppercase tracking-[0.15em] text-jfw-white mb-3">
        Your Cart is Empty
      </h3>
      <p className="font-body text-sm text-gray-500 mb-8 max-w-xs">
        Looks like you haven&rsquo;t added anything yet. Let&rsquo;s get you started!
      </p>
      <Link
        to="/collections"
        onClick={close}
        prefetch="viewport"
        className="jfw-cart-empty-cta inline-flex items-center gap-2 bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading text-xs uppercase tracking-[0.2em] px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-jfw-glow-lg"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
