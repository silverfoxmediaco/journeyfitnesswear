import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {HeroBanner} from '~/components/home/HeroBanner';
import {FeaturedCollections} from '~/components/home/FeaturedCollections';
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
  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY),
  ]);

  return {
    collections: collections.nodes,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="jfw-homepage">
      <HeroBanner />
      <FeaturedCollections collections={data.collections} />
      <MotivationBanner />
      <BrandStory />
      <Newsletter />
    </div>
  );
}

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
