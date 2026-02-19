import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

export function ProductImage({
  image,
}: {
  image: ProductVariantFragment['image'];
}) {
  if (!image) {
    return (
      <div className="jfw-product-image aspect-square bg-jfw-gray rounded-lg flex items-center justify-center">
        <span className="font-heading text-sm text-gray-600 uppercase tracking-wider">
          No Image
        </span>
      </div>
    );
  }
  return (
    <div className="jfw-product-image group relative overflow-hidden rounded-lg bg-jfw-gray">
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}
