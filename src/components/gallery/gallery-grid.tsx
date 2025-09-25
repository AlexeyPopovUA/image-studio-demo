import {ImageCard} from "@/components/gallery/image-card";
import {GalleryLoadingIndicator} from "./gallery-loading";
import type {PicsumImage} from "@/lib/picsum-api";

type GalleryGridProps = {
  images: PicsumImage[]
  currentPage: number
  isLoading: boolean
  hasExplicitPage: boolean
}

export function GalleryGrid({
  images,
  currentPage,
  isLoading,
  hasExplicitPage,
}: GalleryGridProps) {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            prevPage={hasExplicitPage ? `/?page=${currentPage}` : undefined}
          />
        ))}
      </div>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <GalleryLoadingIndicator />
        </div>
      ) : null}
    </div>
  )
}
