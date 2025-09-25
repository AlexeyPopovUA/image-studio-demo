"use client"

import {AlertCircle, Loader2} from "lucide-react"
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {ImageCard} from "@/components/gallery/image-card";
import {GalleryPagination} from "@/components/gallery/gallery-pagination";
import {getPageNumbers} from "@/lib/pagination";
import {useGalleryImages} from "@/components/gallery/gallery-hooks";

export function ImageGallery() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const requestedPage = page !== null ? Number(page) : 1;
  const currentPage = Number.isInteger(requestedPage) && requestedPage >= 1 ? requestedPage : 1;
  const pageNumbers = getPageNumbers(currentPage);
  const [images, loading, error] = useGalleryImages(requestedPage);

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
        <div className="text-center space-y-3">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto"/>
          <h3 className="text-lg font-semibold text-foreground">Error Loading Images</h3>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-muted-foreground">
            Try navigating to a different page or{" "}
            <Link href="/" className="text-primary underline underline-offset-4">
              reset to the first page
            </Link>
          </p>
        </div>
      </div>
    )
  }

  if (!loading && images.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto"/>
          <h3 className="text-lg font-semibold text-foreground">No images found</h3>
          <p className="text-muted-foreground">
            Try navigating to a different page or{" "}
            <Link href="/" className="text-primary underline underline-offset-4">
              reset to the first page
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <GalleryPagination currentPage={currentPage} pageNumbers={pageNumbers}/>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            prevPage={page ? `/?page=${currentPage}` : undefined}
          />
        ))}
      </div>

      <GalleryPagination currentPage={currentPage} pageNumbers={pageNumbers}/>

      <div className="text-center text-sm text-muted-foreground">
        Page {currentPage} • Showing {images.length} images
      </div>
    </div>
  )
}
