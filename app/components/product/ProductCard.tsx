import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';

export function ProductCard({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  return (
    <Link
      className="jfw-product-card group block relative overflow-hidden rounded-lg bg-jfw-dark border border-transparent hover:border-jfw-blue/20 transition-all duration-300 hover:shadow-jfw-glow"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {/* Product Image */}
      <div className="jfw-product-card-image aspect-square overflow-hidden bg-jfw-gray">
        {image && (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="jfw-product-card-info p-4">
        <h4 className="jfw-product-card-title font-body text-sm font-semibold text-jfw-white group-hover:text-jfw-blue transition-colors duration-200 line-clamp-2 mb-2">
          {product.title}
        </h4>
        <div className="jfw-product-card-price font-body text-sm text-jfw-blue font-medium">
          <Money data={product.priceRange.minVariantPrice} />
        </div>
      </div>

      {/* Quick Action Overlay */}
      <div className="jfw-product-card-overlay absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-jfw-black/90 to-transparent pt-12 pointer-events-none">
        <span className="jfw-product-card-action block w-full text-center bg-jfw-blue text-jfw-black font-heading text-xs uppercase tracking-[0.15em] py-2.5 rounded-lg">
          View Product
        </span>
      </div>
    </Link>
  );
}
