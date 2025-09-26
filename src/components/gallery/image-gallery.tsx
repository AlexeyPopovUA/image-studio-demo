"use client"

import {useSearchParams} from "next/navigation";
import {GalleryLayout} from "./gallery-layout";
import {GalleryStateMessage} from "./gallery-state-message";
import {GalleryGrid} from "./gallery-grid";
import {GalleryLoading} from "./gallery-loading";
import {getPageNumbers} from "@/lib/pagination";
import {useGalleryImages} from "@/components/gallery/gallery-hooks";
import {ResetHelper} from "@/components/gallery/reset-helper";

export function ImageGallery() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const requestedPage = page !== null ? Number(page) : 1;
  const currentPage = Number.isInteger(requestedPage) && requestedPage >= 1 ? requestedPage : 1;
  const pageNumbers = getPageNumbers(currentPage);
  const [images, loading, error] = useGalleryImages(requestedPage);

  const showEmptyState = !loading && images.length === 0 && !error
  const hasImages = images.length > 0
  const hasPageQuery = Boolean(page)

  return (
    <GalleryLayout
      currentPage={currentPage}
      pageNumbers={pageNumbers}
      showFooter={!error && hasImages}
      footerText={`Page ${currentPage} • Showing ${images.length} images`}
    >
      {error ? (
        <GalleryStateMessage
          title="Error Loading Images"
          description={error}
          helper={<ResetHelper/>}
          iconVariant="destructive"
        />
      ) : null}

      {loading && !error ? <GalleryLoading/> : null}

      {showEmptyState ? (
        <GalleryStateMessage
          title="No images found"
          helper={<ResetHelper/>}
        />
      ) : null}

      {!loading && !error && hasImages ? (
        <GalleryGrid
          currentPage={currentPage}
          images={images}
          hasExplicitPage={hasPageQuery}
        />
      ) : null}
    </GalleryLayout>
  )
}
