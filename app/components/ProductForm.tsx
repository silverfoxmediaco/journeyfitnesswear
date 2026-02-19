import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  return (
    <div className="jfw-product-form space-y-6">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="jfw-product-options" key={option.name}>
            <h5 className="font-heading text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">
              {option.name}
            </h5>
            <div className="jfw-product-options-grid flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const pillClasses = `jfw-option-pill inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-body transition-all duration-200 ${
                  selected
                    ? 'bg-jfw-blue text-jfw-black border border-jfw-blue shadow-jfw-glow'
                    : exists
                      ? 'bg-jfw-gray text-jfw-white border border-jfw-gray hover:border-jfw-blue/50 hover:text-jfw-blue cursor-pointer'
                      : 'bg-jfw-gray/50 text-gray-600 border border-jfw-gray/50 cursor-not-allowed'
                }`;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={pillClasses}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{opacity: available ? 1 : 0.4}}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      className={pillClasses}
                      key={option.name + name}
                      style={{opacity: available ? 1 : 0.4}}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}

      {/* Add to Cart */}
      <div className="pt-2">
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => {
            open('cart');
          }}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                    selectedVariant,
                  },
                ]
              : []
          }
        >
          {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
        </AddToCartButton>
      </div>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="jfw-option-swatch w-5 h-5 rounded-full border border-gray-600"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} className="w-full h-full rounded-full" />}
    </div>
  );
}
