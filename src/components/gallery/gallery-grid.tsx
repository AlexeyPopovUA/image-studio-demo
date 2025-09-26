import {ImageCard} from "@/components/gallery/image-card";
import type {PicsumImage} from "@/lib/picsum-api";

type GalleryGridProps = {
  images: PicsumImage[]
  currentPage: number
  hasExplicitPage: boolean
}

export function GalleryGrid({
  images,
  currentPage,
  hasExplicitPage,
}: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          prevPage={hasExplicitPage ? `/?page=${currentPage}` : undefined}
        />
      ))}
    </div>
  )
}
