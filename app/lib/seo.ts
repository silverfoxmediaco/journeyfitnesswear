import {SITE_NAME, SITE_DESCRIPTION} from './constants';

const DEFAULT_OG_IMAGE = '/logos/JOURNEYFITNESSWEAR300SOLID.png';
const SITE_URL = 'https://journeyfitnesswear.com';

type SeoMetaInput = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
};

export function getSeoMeta({
  title,
  description,
  url,
  image,
  type = 'website',
}: SeoMetaInput = {}) {
  const metaTitle = title || SITE_NAME;
  const metaDescription = description || SITE_DESCRIPTION;
  const metaImage = image || DEFAULT_OG_IMAGE;
  const metaUrl = url || SITE_URL;

  return [
    {title: metaTitle},
    {name: 'description', content: metaDescription},
    // Open Graph
    {property: 'og:title', content: metaTitle},
    {property: 'og:description', content: metaDescription},
    {property: 'og:image', content: metaImage},
    {property: 'og:url', content: metaUrl},
    {property: 'og:type', content: type === 'product' ? 'product' : type === 'article' ? 'article' : 'website'},
    {property: 'og:site_name', content: SITE_NAME},
    // Twitter Card
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: metaTitle},
    {name: 'twitter:description', content: metaDescription},
    {name: 'twitter:image', content: metaImage},
  ];
}

type ProductJsonLdInput = {
  name: string;
  description: string;
  url: string;
  image?: string;
  price: string;
  currency: string;
  availability: boolean;
  sku?: string;
};

export function getProductJsonLd({
  name,
  description,
  url,
  image,
  price,
  currency,
  availability,
  sku,
}: ProductJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    image,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    ...(sku ? {sku} : {}),
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: availability
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url,
    },
  };
}

export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logos/JOURNEYFITNESSWEAR300SOLID.png`,
    sameAs: [
      'https://instagram.com/journeyfitnesswear',
      'https://facebook.com/journeyfitnesswear',
      'https://twitter.com/journeyfitnesswear',
      'https://youtube.com/@journeyfitnesswear',
    ],
  };
}
