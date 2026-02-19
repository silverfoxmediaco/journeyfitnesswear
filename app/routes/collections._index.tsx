import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections._index';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Journey Fitness Wear | Collections'},
    {
      name: 'description',
      content:
        'Shop all Journey Fitness Wear collections. Performance apparel built for every rep, every mile, every goal.',
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
  ]);

  return {collections};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="jfw-collections-page py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-12 h-[2px] bg-jfw-blue mx-auto mb-6" />
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.15em] text-jfw-white mb-4">
            Our <span className="text-jfw-blue">Collections</span>
          </h1>
          <p className="font-body text-base text-gray-400 max-w-xl mx-auto">
            Explore our curated collections of performance fitness wear.
          </p>
        </div>

        {/* Collections Grid */}
        <PaginatedResourceSection<CollectionFragment>
          connection={collections}
          resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {({node: collection, index}) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              index={index}
            />
          )}
        </PaginatedResourceSection>
      </div>
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      className="jfw-collection-item group block relative overflow-hidden rounded-lg bg-jfw-gray border border-transparent hover:border-jfw-blue/30 transition-all duration-300 hover:shadow-jfw-glow"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      {collection?.image && (
        <div className="aspect-[4/5] overflow-hidden">
          <Image
            alt={collection.image.altText || collection.title}
            aspectRatio="4/5"
            data={collection.image}
            loading={index < 3 ? 'eager' : undefined}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-jfw-black/80 via-jfw-black/20 to-transparent" />

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="jfw-collection-item-title font-heading text-lg uppercase tracking-[0.15em] text-jfw-white group-hover:text-jfw-blue transition-colors duration-300">
          {collection.title}
        </h3>
        <span className="inline-block mt-2 font-heading text-[10px] uppercase tracking-[0.2em] text-jfw-blue opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          Shop Now &rarr;
        </span>
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
