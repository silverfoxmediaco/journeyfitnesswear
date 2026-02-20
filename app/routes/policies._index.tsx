import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/policies._index';
import type {PoliciesQuery, PolicyItemFragment} from 'storefrontapi.generated';
import {ArrowRight} from 'lucide-react';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Journey Fitness Wear | Policies'},
    {
      name: 'description',
      content:
        'View our store policies including privacy, shipping, returns, and terms of service.',
    },
  ];
};

export async function loader({context}: Route.LoaderArgs) {
  const data: PoliciesQuery = await context.storefront.query(POLICIES_QUERY);

  const shopPolicies = data.shop;
  const policies: PolicyItemFragment[] = [
    shopPolicies?.privacyPolicy,
    shopPolicies?.shippingPolicy,
    shopPolicies?.termsOfService,
    shopPolicies?.refundPolicy,
    shopPolicies?.subscriptionPolicy,
  ].filter((policy): policy is PolicyItemFragment => policy != null);

  if (!policies.length) {
    throw new Response('No policies found', {status: 404});
  }

  return {policies};
}

export default function Policies() {
  const {policies} = useLoaderData<typeof loader>();

  return (
    <div className="jfw-policies-page py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="jfw-policies-header mb-12 text-center">
          <div className="w-12 h-[2px] bg-jfw-blue mx-auto mb-6" />
          <h1 className="jfw-policies-heading font-heading text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.15em] text-jfw-white">
            Our <span className="text-jfw-blue">Policies</span>
          </h1>
        </div>

        {/* Policy Cards Grid */}
        <div className="jfw-policies-grid grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {policies.map((policy) => (
            <Link
              key={policy.id}
              to={`/policies/${policy.handle}`}
              prefetch="intent"
              className="jfw-policy-card group block p-6 md:p-8 bg-jfw-dark border border-jfw-gray rounded-xl hover:border-jfw-blue/30 transition-all duration-300 hover:shadow-jfw-glow"
            >
              <h2 className="font-heading text-sm md:text-base uppercase tracking-[0.15em] text-jfw-white group-hover:text-jfw-blue transition-colors duration-300 mb-2">
                {policy.title}
              </h2>
              <span className="inline-flex items-center gap-1 font-body text-xs text-gray-500 group-hover:text-jfw-blue transition-colors duration-300">
                Read more <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
` as const;
