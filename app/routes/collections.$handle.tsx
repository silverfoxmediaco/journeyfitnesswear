import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductCard} from '~/components/product/ProductCard';
import type {ProductItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `Journey Fitness Wear | ${data?.collection.title ?? ''}`},
    {
      name: 'description',
      content: data?.collection.description || `Shop ${data?.collection.title} at Journey Fitness Wear.`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {collection};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();

  return (
    <div className="jfw-collection-page py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Collection Header */}
        <div className="mb-10">
          <div className="w-12 h-[2px] bg-jfw-blue mb-6" />
          <h1 className="jfw-collection-heading font-heading text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.15em] text-jfw-white mb-3">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="jfw-collection-desc font-body text-base text-gray-400 max-w-2xl">
              {collection.description}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <PaginatedResourceSection<ProductItemFragment>
          connection={collection.products}
          resourcesClassName="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12"
        >
          {({node: product, index}) => (
            <ProductCard
              key={product.id}
              product={product}
              loading={index < 8 ? 'eager' : undefined}
            />
          )}
        </PaginatedResourceSection>

        <Analytics.CollectionView
          data={{
            collection: {
              id: collection.id,
              handle: collection.handle,
            },
          }}
        />
      </div>
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
