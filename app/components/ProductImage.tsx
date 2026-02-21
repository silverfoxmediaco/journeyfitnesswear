import {useState} from 'react';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

type ProductImageType = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export function ProductImage({
  image,
  images,
}: {
  image: ProductVariantFragment['image'];
  images?: ProductImageType[];
}) {
  const [selectedImage, setSelectedImage] = useState<ProductImageType | null>(null);

  const displayImage = selectedImage || image;
  const hasGallery = images && images.length > 1;

  if (!displayImage) {
    return (
      <div className="jfw-product-image aspect-square bg-jfw-gray rounded-lg flex items-center justify-center">
        <span className="font-heading text-sm text-gray-600 uppercase tracking-wider">
          No Image
        </span>
      </div>
    );
  }

  return (
    <div className="jfw-product-gallery">
      {/* Main Image */}
      <div className="jfw-product-image-main group relative overflow-hidden rounded-lg bg-jfw-gray">
        <Image
          alt={displayImage.altText || 'Product Image'}
          aspectRatio="1/1"
          data={displayImage}
          key={displayImage.id}
          sizes="(min-width: 45em) 50vw, 100vw"
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Thumbnail Grid */}
      {hasGallery && (
        <div className="jfw-product-thumbnails grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-2 mt-3">
          {images.map((img) => {
            const isActive =
              (selectedImage && selectedImage.id === img.id) ||
              (!selectedImage && image?.id === img.id);

            return (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`jfw-product-thumbnail aspect-square rounded-md overflow-hidden bg-jfw-gray border-2 transition-all duration-200 ${
                  isActive
                    ? 'border-jfw-blue shadow-jfw-glow'
                    : 'border-transparent hover:border-jfw-blue/30'
                }`}
              >
                <Image
                  alt={img.altText || 'Product thumbnail'}
                  data={img}
                  sizes="100px"
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
