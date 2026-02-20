import {Link, useNavigate} from 'react-router';
import {useState} from 'react';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';
import {Minus, Plus} from 'lucide-react';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);
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

                // Detect if this is a color option (has swatch data or matches our color map)
                const isColorOption =
                  !!swatch?.color ||
                  !!swatch?.image?.previewImage?.url ||
                  !!COLOR_MAP[name.toLowerCase()];

                const pillClasses = `jfw-option-pill inline-flex items-center justify-center ${isColorOption ? 'px-3' : 'px-4'} py-2.5 rounded-lg text-sm font-body transition-all duration-200 ${
                  selected
                    ? 'bg-jfw-blue/10 text-jfw-blue border border-jfw-blue shadow-jfw-glow'
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

      {/* Quantity Selector */}
      <div className="jfw-quantity-selector">
        <h5 className="font-heading text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">
          Quantity
        </h5>
        <div className="inline-flex items-center border border-jfw-gray rounded-lg overflow-hidden">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="jfw-qty-decrease w-10 h-10 flex items-center justify-center text-gray-400 hover:text-jfw-blue hover:bg-jfw-gray/50 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus size={16} />
          </button>
          <span className="jfw-qty-display w-14 h-10 flex items-center justify-center font-body text-sm text-jfw-white bg-jfw-dark border-x border-jfw-gray">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="jfw-qty-increase w-10 h-10 flex items-center justify-center text-gray-400 hover:text-jfw-blue hover:bg-jfw-gray/50 transition-colors duration-200"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

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
                    quantity,
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

/**
 * Map of common color names to hex values.
 * Covers Printful's standard color palette so swatches render
 * as colored circles even without Shopify swatch metadata.
 */
const COLOR_MAP: Record<string, string> = {
  black: '#000000',
  white: '#FFFFFF',
  navy: '#1B2A4A',
  'navy blazer': '#1B2A4A',
  red: '#DC2626',
  blue: '#2563EB',
  'royal blue': '#2563EB',
  'royal': '#2563EB',
  'carolina blue': '#57A0D3',
  green: '#16A34A',
  'forest green': '#228B22',
  'military green': '#4B5320',
  'olive': '#6B7F3B',
  yellow: '#FACC15',
  'gold': '#D4A843',
  orange: '#EA580C',
  'burnt orange': '#CC5500',
  pink: '#EC4899',
  'light pink': '#FFB6C1',
  'hot pink': '#FF69B4',
  purple: '#9333EA',
  gray: '#6B7280',
  grey: '#6B7280',
  'dark grey': '#374151',
  'dark gray': '#374151',
  'light gray': '#D1D5DB',
  'light grey': '#D1D5DB',
  'sport grey': '#9CA3AF',
  'heather gray': '#9CA3AF',
  'heather grey': '#9CA3AF',
  'deep heather': '#5C5C5C',
  'dark heather': '#4A4A4A',
  'charcoal': '#36454F',
  'ash': '#B2BEB5',
  brown: '#7C5C3C',
  'dark chocolate': '#3B1E08',
  tan: '#D2B48C',
  'sand': '#C2B280',
  'khaki': '#C3B091',
  'natural': '#F5F0E1',
  'cream': '#FFFDD0',
  'ivory': '#FFFFF0',
  'off-white': '#FAF9F6',
  teal: '#0D9488',
  'dark teal': '#065F5B',
  cyan: '#00CFFF',
  'aqua': '#00FFFF',
  maroon: '#800000',
  'cardinal': '#C41E3A',
  'cranberry': '#9B1B30',
  burgundy: '#800020',
  'wine': '#722F37',
  coral: '#FF6F61',
  'salmon': '#FA8072',
  'peach': '#FFCBA4',
  'lavender': '#B57EDC',
  'lilac': '#C8A2C8',
  'heather': '#B7C3D0',
  'slate': '#708090',
  'steel blue': '#4682B4',
  'ice blue': '#99C5CC',
  'baby blue': '#89CFF0',
  'powder blue': '#B0E0E6',
  'sky blue': '#87CEEB',
  'indigo': '#3F51B5',
  'midnight': '#191970',
  'mint': '#98FF98',
  'sage': '#BCB88A',
  'lime': '#84CC16',
  'kelly green': '#4CBB17',
  'irish green': '#009A44',
  'leaf': '#71AA34',
  'maize': '#FBEC5D',
  'mustard': '#E1AD01',
  'sunset': '#FAD6A5',
  'berry': '#8E4585',
  'plum': '#8E4585',
  'eggplant': '#614051',
  'camo': '#53574B',
  'camouflage': '#53574B',
  'vintage': '#A0826D',
};

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  // Try the Shopify swatch data first, then fall back to our color map
  const resolvedColor = color || COLOR_MAP[name.toLowerCase()] || null;

  if (!image && !resolvedColor) return name;

  return (
    <div className="jfw-option-swatch-wrapper inline-flex items-center gap-2">
      <div
        aria-label={name}
        className={`jfw-option-swatch w-5 h-5 rounded-full border ${
          resolvedColor?.toLowerCase() === '#ffffff' || resolvedColor?.toLowerCase() === '#fffff0' || resolvedColor?.toLowerCase() === '#faf9f6' || resolvedColor?.toLowerCase() === '#fffdd0' || resolvedColor?.toLowerCase() === '#f5f0e1'
            ? 'border-gray-400'
            : 'border-gray-600'
        }`}
        style={{
          backgroundColor: resolvedColor || 'transparent',
        }}
      >
        {!!image && <img src={image} alt={name} className="w-full h-full rounded-full" />}
      </div>
      <span className="jfw-option-swatch-label text-xs">{name}</span>
    </div>
  );
}
