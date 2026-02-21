import {redirect, useLoaderData, useNavigate, useSearchParams} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductCard} from '~/components/product/ProductCard';
import type {ProductItemFragment} from 'storefrontapi.generated';

import {getSeoMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) => {
  return getSeoMeta({
    title: `Journey Fitness Wear | ${data?.collection.title ?? ''}`,
    description: data?.collection.description || `Shop ${data?.collection.title} at Journey Fitness Wear.`,
    url: `https://journeyfitnesswear.com/collections/${data?.collection.handle}`,
  });
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

const SORT_OPTIONS: Record<string, {sortKey: string; reverse: boolean}> = {
  'best-selling': {sortKey: 'BEST_SELLING', reverse: false},
  'price-asc': {sortKey: 'PRICE', reverse: false},
  'price-desc': {sortKey: 'PRICE', reverse: true},
  newest: {sortKey: 'CREATED', reverse: true},
  'a-z': {sortKey: 'TITLE', reverse: false},
  'z-a': {sortKey: 'TITLE', reverse: true},
};

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const url = new URL(request.url);
  const sortParam = url.searchParams.get('sort') || '';
  const sortOption = SORT_OPTIONS[sortParam] || null;

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        ...paginationVariables,
        ...(sortOption
          ? {sortKey: sortOption.sortKey, reverse: sortOption.reverse}
          : {}),
      },
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentSort = searchParams.get('sort') || '';
  const productCount = collection.products.nodes.length;

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }
    navigate(`?${params.toString()}`, {preventScrollReset: true});
  }

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

        {/* Sort Toolbar */}
        <div className="jfw-sort-toolbar flex items-center justify-between mb-6 pb-4 border-b border-jfw-gray">
          <p className="jfw-sort-count font-body text-sm text-gray-400">
            {productCount} {productCount === 1 ? 'product' : 'products'}
          </p>
          <div className="jfw-sort-select-wrapper relative">
            <select
              value={currentSort}
              onChange={handleSortChange}
              className="jfw-sort-select bg-jfw-dark border border-jfw-gray rounded-lg px-4 py-2.5 pr-10 font-body text-sm text-jfw-white focus:outline-none focus:border-jfw-blue/50 focus:ring-1 focus:ring-jfw-blue/20 transition-all duration-200 appearance-none cursor-pointer"
              aria-label="Sort products"
            >
              <option value="">Featured</option>
              <option value="best-selling">Best Selling</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="a-z">A – Z</option>
              <option value="z-a">Z – A</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
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
              collectionHandle={collection.handle}
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
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
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
        after: $endCursor,
        sortKey: $sortKey,
        reverse: $reverse
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
