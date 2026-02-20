import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';

type RecommendedProduct = {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage?: {
    id?: string;
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  } | null;
};

export function RecommendedProducts({
  products,
}: {
  products: RecommendedProduct[];
}) {
  if (!products || products.length === 0) return null;

  return (
    <section className="jfw-recommended-products py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <div className="w-12 h-[2px] bg-jfw-blue mb-4" />
          <h2 className="jfw-recommended-heading font-heading text-xl md:text-2xl uppercase tracking-[0.15em] text-jfw-white">
            You May Also <span className="text-jfw-blue">Like</span>
          </h2>
        </div>

        {/* Product Grid */}
        <div className="jfw-recommended-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.handle}`}
              prefetch="intent"
              className="jfw-recommended-card group block"
            >
              {/* Image */}
              <div className="jfw-recommended-image aspect-square rounded-lg overflow-hidden bg-jfw-gray border border-transparent hover:border-jfw-blue/30 transition-all duration-300 group-hover:shadow-jfw-glow">
                {product.featuredImage ? (
                  <Image
                    data={product.featuredImage}
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-heading text-xs text-gray-600 uppercase">
                      No Image
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="mt-3">
                <h3 className="jfw-recommended-title font-body text-sm font-medium text-jfw-white group-hover:text-jfw-blue transition-colors duration-200 line-clamp-1">
                  {product.title}
                </h3>
                <p className="jfw-recommended-price font-body text-sm text-jfw-blue mt-1">
                  From{' '}
                  <Money data={product.priceRange.minVariantPrice} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
