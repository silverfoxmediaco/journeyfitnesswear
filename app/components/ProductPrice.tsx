import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  return (
    <div className="jfw-product-price flex items-center gap-3">
      {compareAtPrice ? (
        <>
          <span className="font-body text-2xl font-semibold text-jfw-blue">
            {price ? <Money data={price} /> : null}
          </span>
          <s className="font-body text-lg text-gray-500">
            <Money data={compareAtPrice} />
          </s>
          <span className="inline-block bg-red-600 text-white text-[10px] font-heading uppercase tracking-wider px-2 py-0.5 rounded">
            Sale
          </span>
        </>
      ) : price ? (
        <span className="font-body text-2xl font-semibold text-jfw-blue">
          <Money data={price} />
        </span>
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
