import {useState} from 'react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {motion, AnimatePresence} from 'framer-motion';
import {ArrowRight} from 'lucide-react';
import type {HomepageProductFragment} from 'storefrontapi.generated';

interface FeaturedProductsProps {
  mensProducts: HomepageProductFragment[];
  womensProducts: HomepageProductFragment[];
}

export function FeaturedProducts({
  mensProducts,
  womensProducts,
}: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState<'mens' | 'womens'>('mens');
  const products = activeTab === 'mens' ? mensProducts : womensProducts;
  const collectionHandle = activeTab === 'mens' ? 'mens' : 'womens';

  return (
    <section className="jfw-featured-products bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="jfw-featured-products-accent w-12 h-[2px] bg-jfw-blue mx-auto mb-4" />
          <h2 className="jfw-featured-products-heading font-heading text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.12em] text-gray-900">
            Shop the Latest
          </h2>
        </div>

        {/* Tab Selector */}
        <div
          className="jfw-featured-products-tabs flex justify-center gap-8 mb-10"
          role="tablist"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'mens'}
            aria-controls="panel-mens"
            className={`jfw-featured-products-tab font-heading text-sm uppercase tracking-[0.15em] pb-2 border-b-2 transition-all duration-200 ${
              activeTab === 'mens'
                ? 'jfw-featured-products-tab-active text-jfw-blue border-jfw-blue'
                : 'text-gray-400 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('mens')}
          >
            Men&apos;s
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'womens'}
            aria-controls="panel-womens"
            className={`jfw-featured-products-tab font-heading text-sm uppercase tracking-[0.15em] pb-2 border-b-2 transition-all duration-200 ${
              activeTab === 'womens'
                ? 'jfw-featured-products-tab-active text-jfw-blue border-jfw-blue'
                : 'text-gray-400 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('womens')}
          >
            Women&apos;s
          </button>
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            transition={{duration: 0.3}}
          >
            {products.length > 0 ? (
              <div className="jfw-featured-products-grid grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.4, delay: index * 0.05}}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12 font-body">
                No products available yet.
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link
            to={`/collections/${collectionHandle}`}
            prefetch="intent"
            className="jfw-featured-products-cta inline-flex items-center gap-2 font-heading text-sm uppercase tracking-[0.15em] text-jfw-blue hover:text-jfw-blue-dark transition-colors duration-200"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({product}: {product: HomepageProductFragment}) {
  return (
    <Link
      to={`/products/${product.handle}`}
      prefetch="intent"
      className="jfw-home-product-card group block"
    >
      <div className="jfw-home-product-image aspect-square rounded-lg overflow-hidden bg-jfw-light-gray">
        {product.featuredImage ? (
          <Image
            data={product.featuredImage}
            aspectRatio="1/1"
            sizes="(min-width: 768px) 33vw, 50vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-body text-sm">
            No Image
          </div>
        )}
      </div>
      <div className="mt-3">
        <h4 className="jfw-home-product-title font-body text-sm font-medium text-gray-900 group-hover:text-jfw-blue transition-colors duration-200 line-clamp-2">
          {product.title}
        </h4>
        <p className="jfw-home-product-price font-body text-sm text-gray-600 font-medium mt-1">
          <Money data={product.priceRange.minVariantPrice} />
        </p>
      </div>
    </Link>
  );
}
