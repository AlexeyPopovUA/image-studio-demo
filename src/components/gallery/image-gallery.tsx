"use client"

import {AlertCircle, Loader2} from "lucide-react"
import {useSearchParams} from "next/navigation";
import {Button} from "@/components/ui/button";
import {ImageCard} from "@/components/gallery/image-card";
import {GalleryPagination} from "@/components/gallery/gallery-pagination";
import {getPageNumbers} from "@/lib/pagination";
import {useGalleryImages} from "@/components/gallery/gallery-hooks";

export function ImageGallery() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const currentPage = page ? parseInt(page) : 1;
  const pageNumbers = getPageNumbers(currentPage)
  const [images, loading, error] = useGalleryImages(currentPage)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin"/>
          <span className="text-muted-foreground">Loading images...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto"/>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Error Loading Images</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pagination */}
      <GalleryPagination currentPage={currentPage} pageNumbers={pageNumbers}/>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            prevPage={page ? `/?page=${currentPage}` : undefined}
          />
        ))}
      </div>

      {/* Pagination */}
      <GalleryPagination currentPage={currentPage} pageNumbers={pageNumbers}/>

      {/* Page Info */}
      <div className="text-center text-sm text-muted-foreground">
        Page {currentPage} • Showing {images.length} images
      </div>
    </div>
  )
}
