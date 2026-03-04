import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import type {FeaturedCollectionsFragment} from 'storefrontapi.generated';

interface FeaturedCollectionsProps {
  collections: FeaturedCollectionsFragment[];
}

export function FeaturedCollections({collections}: FeaturedCollectionsProps) {
  if (!collections || collections.length === 0) return null;

  return (
    <section className="jfw-featured-collections py-20 md:py-28 bg-jfw-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '-100px'}}
          transition={{duration: 0.6, ease: 'easeOut'}}
        >
          <div className="jfw-section-accent w-12 h-[2px] bg-jfw-blue mx-auto mb-6" />
          <h2 className="jfw-section-heading font-heading text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.15em] text-gray-900">
            Shop by <span className="text-jfw-blue">Category</span>
          </h2>
        </motion.div>

        {/* Collections Grid — centered for 2 items, scales to 3 if more are added */}
        <div className={`jfw-collections-grid grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mx-auto ${collections.length <= 2 ? 'max-w-4xl' : 'lg:grid-cols-3'}`}>
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-50px'}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
            >
              <Link
                to={`/collections/${collection.handle}`}
                prefetch="intent"
                className="jfw-collection-card group block relative overflow-hidden rounded-lg bg-white border border-jfw-border-light hover:border-jfw-blue/40 transition-all duration-300 hover:shadow-lg hover:shadow-jfw-blue/10"
              >
                {/* Collection Image */}
                <div className="jfw-collection-image aspect-[4/5] overflow-hidden">
                  {collection.image ? (
                    <Image
                      data={collection.image}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-jfw-light-gray flex items-center justify-center">
                      <span className="font-heading text-sm text-gray-400 uppercase tracking-wider">
                        {collection.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Collection Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="jfw-collection-title font-heading text-lg md:text-xl uppercase tracking-[0.15em] text-white group-hover:text-jfw-blue transition-colors duration-300">
                    {collection.title}
                  </h3>
                  {collection.description && (
                    <p className="font-body text-xs text-gray-300 mt-2 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                  <span className="jfw-collection-cta inline-block mt-3 font-heading text-[10px] uppercase tracking-[0.2em] text-jfw-blue opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Explore &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
