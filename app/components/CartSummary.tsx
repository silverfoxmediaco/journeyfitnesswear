import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';
import {Tag, Gift, ArrowRight} from 'lucide-react';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  return (
    <div
      aria-labelledby="cart-summary"
      className={`jfw-cart-summary ${layout === 'page' ? 'jfw-cart-summary-page cart-summary-page mt-10 p-6 md:p-8 bg-jfw-dark border border-jfw-gray rounded-xl' : 'jfw-cart-summary-aside cart-summary-aside'}`}
    >
      {/* Subtotal */}
      <div className="jfw-cart-subtotal flex items-center justify-between mb-4">
        <span className="font-heading text-xs uppercase tracking-[0.2em] text-gray-400">
          Subtotal
        </span>
        <span className="font-body text-xl font-semibold text-jfw-blue">
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart.cost.subtotalAmount} />
          ) : (
            '—'
          )}
        </span>
      </div>

      <p className="font-body text-[11px] text-gray-500 mb-6">
        Taxes and shipping calculated at checkout.
      </p>

      {/* Discount Codes */}
      <CartDiscounts discountCodes={cart?.discountCodes} />

      {/* Gift Cards */}
      <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />

      {/* Checkout Button */}
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="jfw-cart-checkout mt-6">
      <a
        href={checkoutUrl}
        target="_self"
        className="jfw-checkout-btn w-full inline-flex items-center justify-center gap-3 bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading text-sm uppercase tracking-[0.2em] px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-jfw-glow-lg"
      >
        Checkout
        <ArrowRight size={18} strokeWidth={2.5} />
      </a>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="jfw-cart-discounts mb-4">
      {/* Existing applied discounts */}
      <dl hidden={!codes.length} className="mb-3">
        <div className="flex items-center justify-between">
          <dt className="font-body text-xs text-gray-400 flex items-center gap-1.5">
            <Tag size={12} />
            Discount(s)
          </dt>
          <UpdateDiscountForm>
            <div className="jfw-cart-discount-applied flex items-center gap-2">
              <code className="font-body text-xs text-jfw-blue bg-jfw-blue/10 px-2 py-0.5 rounded">
                {codes?.join(', ')}
              </code>
              <button
                type="submit"
                aria-label="Remove discount"
                className="font-body text-[10px] uppercase tracking-wider text-gray-500 hover:text-red-400 transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Apply discount input */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="jfw-cart-discount-form flex gap-2">
          <label htmlFor="discount-code-input" className="sr-only">
            Discount code
          </label>
          <input
            id="discount-code-input"
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className="jfw-discount-input flex-1 bg-jfw-black border border-jfw-gray rounded-lg px-3 py-2 font-body text-xs text-jfw-white placeholder-gray-600 focus:outline-none focus:border-jfw-blue/50 focus:ring-1 focus:ring-jfw-blue/20 transition-all duration-200"
          />
          <button
            type="submit"
            aria-label="Apply discount code"
            className="jfw-discount-apply font-heading text-[10px] uppercase tracking-wider text-jfw-blue border border-jfw-blue/30 hover:bg-jfw-blue/10 px-4 py-2 rounded-lg transition-all duration-200"
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current!.value = '';
    }
  }, [giftCardAddFetcher.data]);

  return (
    <div className="jfw-cart-gift-cards mb-4">
      {/* Applied gift cards */}
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl className="mb-3">
          <dt className="font-body text-xs text-gray-400 flex items-center gap-1.5 mb-2">
            <Gift size={12} />
            Applied Gift Card(s)
          </dt>
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="jfw-cart-gift-applied flex items-center gap-2 mb-1.5">
                <code className="font-body text-xs text-jfw-blue bg-jfw-blue/10 px-2 py-0.5 rounded">
                  ***{giftCard.lastCharacters}
                </code>
                <span className="font-body text-xs text-gray-400">
                  <Money data={giftCard.amountUsed} />
                </span>
                <button
                  type="submit"
                  className="font-body text-[10px] uppercase tracking-wider text-gray-500 hover:text-red-400 transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </dl>
      )}

      {/* Add gift card input */}
      <AddGiftCardForm fetcherKey="gift-card-add">
        <div className="jfw-cart-gift-form flex gap-2">
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            className="jfw-gift-input flex-1 bg-jfw-black border border-jfw-gray rounded-lg px-3 py-2 font-body text-xs text-jfw-white placeholder-gray-600 focus:outline-none focus:border-jfw-blue/50 focus:ring-1 focus:ring-jfw-blue/20 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={giftCardAddFetcher.state !== 'idle'}
            className="jfw-gift-apply font-heading text-[10px] uppercase tracking-wider text-jfw-blue border border-jfw-blue/30 hover:bg-jfw-blue/10 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </AddGiftCardForm>
    </div>
  );
}

function AddGiftCardForm({
  fetcherKey,
  children,
}: {
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  children,
}: {
  giftCardId: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}
