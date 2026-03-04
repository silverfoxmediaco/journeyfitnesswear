import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {HeroBanner} from '~/components/home/HeroBanner';
import {FeaturedProducts} from '~/components/home/FeaturedProducts';
import {FeaturedCollections} from '~/components/home/FeaturedCollections';
import {ActivitySection} from '~/components/home/ActivitySection';
import {MotivationBanner} from '~/components/home/MotivationBanner';
import {BrandStory} from '~/components/home/BrandStory';
import {Newsletter} from '~/components/home/Newsletter';
import {getSeoMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: 'Journey Fitness Wear | Performance Apparel',
    description:
      'Performance wear built for every rep, every mile, every goal. Shop bold, athletic fitness apparel from Journey Fitness Wear.',
    url: 'https://journeyfitnesswear.com',
  });
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return {...criticalData};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}, mensData, womensData] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY),
    context.storefront.query(MENS_PRODUCTS_QUERY),
    context.storefront.query(WOMENS_PRODUCTS_QUERY),
  ]);

  return {
    collections: collections.nodes,
    mensProducts: mensData?.collection?.products.nodes ?? [],
    womensProducts: womensData?.collection?.products.nodes ?? [],
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="jfw-homepage jfw-homepage-light">
      <HeroBanner />
      <FeaturedProducts
        mensProducts={data.mensProducts}
        womensProducts={data.womensProducts}
      />
      <FeaturedCollections collections={data.collections} />
      <ActivitySection />
      <MotivationBanner />
      <BrandStory />
      <Newsletter />
    </div>
  );
}

const HOMEPAGE_PRODUCT_FRAGMENT = `#graphql
  fragment HomepageProduct on Product {
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
        amount
        currencyCode
      }
    }
  }
` as const;

const COLLECTIONS_QUERY = `#graphql
  fragment FeaturedCollections on Collection {
    id
    title
    description
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query FeaturedCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 6, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollections
      }
    }
  }
` as const;

const MENS_PRODUCTS_QUERY = `#graphql
  ${HOMEPAGE_PRODUCT_FRAGMENT}
  query MensProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: "mens") {
      id
      title
      handle
      products(first: 9, sortKey: BEST_SELLING) {
        nodes {
          ...HomepageProduct
        }
      }
    }
  }
` as const;

const WOMENS_PRODUCTS_QUERY = `#graphql
  ${HOMEPAGE_PRODUCT_FRAGMENT}
  query WomensProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: "womens") {
      id
      title
      handle
      products(first: 9, sortKey: BEST_SELLING) {
        nodes {
          ...HomepageProduct
        }
      }
    }
  }
` as const;
