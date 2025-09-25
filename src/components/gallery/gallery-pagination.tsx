"use client"

import {ChevronLeft, ChevronRight} from "lucide-react"
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Button} from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination"

type GalleryPaginationProps = {
  currentPage: number
  pageNumbers: number[]
}

export function GalleryPagination({currentPage, pageNumbers}: GalleryPaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function buildHref(targetPage: number) {
    const params = new URLSearchParams(searchParams.toString())

    if (targetPage <= 1) {
      params.delete("page")
    } else {
      params.set("page", targetPage.toString())
    }

    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  const navigateToPage = (targetPage: number) => {
    if (targetPage === currentPage || targetPage < 1) {
      return
    }

    router.push(buildHref(targetPage))
  }

  const prevPage = Math.max(currentPage - 1, 1)
  const nextPage = currentPage + 1

  const handlePrev = () => {
    if (currentPage === 1) {
      return
    }
    navigateToPage(prevPage)
  }

  const handleNext = () => {
    navigateToPage(nextPage)
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer gap-1 px-2.5 sm:pl-2.5 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
            onClick={handlePrev}
            disabled={currentPage === 1}
            aria-disabled={currentPage === 1}
            data-disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true"/>
            <span className="hidden sm:block">Previous</span>
          </Button>
        </PaginationItem>
        {pageNumbers.at(0) !== 1 ? <PaginationItem>
          <PaginationEllipsis/>
        </PaginationItem> : null}
        {pageNumbers.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <Button
              className="cursor-pointer"
              variant={currentPage === pageNumber ? "outline" : "ghost"}
              size="icon"
              aria-current={currentPage === pageNumber ? "page" : undefined}
              aria-label={
                currentPage === pageNumber
                  ? `Current page, Page ${pageNumber}`
                  : `Go to page ${pageNumber}`
              }
              onClick={() => navigateToPage(pageNumber)}
            >
              {pageNumber}
            </Button>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis/>
        </PaginationItem>
        <PaginationItem>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer gap-1 px-2.5 sm:pr-2.5"
            onClick={handleNext}
            aria-label="Go to next page"
          >
            <span className="hidden sm:block">Next</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true"/>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
