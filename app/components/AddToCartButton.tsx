import {useEffect} from 'react';
import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {ShoppingBag} from 'lucide-react';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <AddToCartInner
          fetcher={fetcher}
          analytics={analytics}
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </AddToCartInner>
      )}
    </CartForm>
  );
}

function AddToCartInner({
  fetcher,
  analytics,
  disabled,
  onClick,
  children,
}: {
  fetcher: FetcherWithComponents<any>;
  analytics?: unknown;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  // Open cart aside AFTER the fetcher completes successfully
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && onClick) {
      onClick();
    }
  }, [fetcher.state, fetcher.data, onClick]);

  return (
    <>
      <input
        name="analytics"
        type="hidden"
        value={JSON.stringify(analytics)}
      />
      <button
        type="submit"
        disabled={disabled || fetcher.state !== 'idle'}
        className="jfw-add-to-cart w-full inline-flex items-center justify-center gap-3 bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading text-sm uppercase tracking-[0.2em] px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-jfw-glow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
      >
        <ShoppingBag size={18} strokeWidth={2} />
        {children}
      </button>
    </>
  );
}
