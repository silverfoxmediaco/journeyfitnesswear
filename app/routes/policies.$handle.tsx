import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/policies.$handle';
import {type Shop} from '@shopify/hydrogen/storefront-api-types';
import {ArrowLeft} from 'lucide-react';

type SelectedPolicies = keyof Pick<
  Shop,
  'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy'
>;

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Journey Fitness Wear | ${data?.policy.title ?? ''}`}];
};

export async function loader({params, context}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  const policyName = params.handle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as SelectedPolicies;

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n?.language,
    },
  });

  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response('Could not find the policy', {status: 404});
  }

  return {policy};
}

export default function Policy() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <div className="jfw-policy-page py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/policies"
          prefetch="intent"
          className="jfw-policy-back inline-flex items-center gap-2 font-body text-sm text-gray-400 hover:text-jfw-blue transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={16} />
          Back to Policies
        </Link>

        {/* Page Header */}
        <div className="jfw-policy-header mb-10">
          <div className="w-12 h-[2px] bg-jfw-blue mb-6" />
          <h1 className="jfw-policy-heading font-heading text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.15em] text-jfw-white">
            {policy.title}
          </h1>
        </div>

        {/* Policy Body */}
        <div
          className="jfw-policy-body prose prose-invert prose-sm md:prose-base max-w-none font-body text-gray-300 leading-relaxed
            prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-wider prose-headings:text-jfw-white
            prose-a:text-jfw-blue prose-a:no-underline hover:prose-a:underline
            prose-strong:text-jfw-white
            prose-li:marker:text-jfw-blue"
          dangerouslySetInnerHTML={{__html: policy.body}}
        />
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
` as const;
