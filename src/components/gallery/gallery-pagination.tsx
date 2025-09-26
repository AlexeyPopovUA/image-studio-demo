import Link from "next/link";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

type GalleryPaginationProps = {
  currentPage: number
  pageNumbers: number[]
}

export function GalleryPagination({currentPage, pageNumbers}: GalleryPaginationProps) {
  const prevPage = Math.max(currentPage - 1, 1);
  const nextPage = currentPage + 1;
  const isFirstPage = currentPage === 1;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Link
            href={prevPage <= 1 ? "/" : `?page=${prevPage}`}
            shallow
            passHref
          >
            <PaginationLink
              size="default"
              className="gap-1 px-2.5 sm:pl-2.5 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
              aria-label="Go to previous page"
              aria-disabled={isFirstPage}
              data-disabled={isFirstPage}
              tabIndex={isFirstPage ? -1 : undefined}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:block">Previous</span>
            </PaginationLink>
          </Link>
        </PaginationItem>
        {pageNumbers.at(0) !== 1 ? (
          <PaginationItem>
            <PaginationEllipsis/>
          </PaginationItem>
        ) : null}
        {pageNumbers.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <Link
              href={pageNumber <= 1 ? "/" : `?page=${pageNumber}`}
              shallow
              passHref
            >
              <PaginationLink
                isActive={currentPage === pageNumber}
                className="cursor-pointer"
                aria-label={
                  currentPage === pageNumber
                    ? `Current page, Page ${pageNumber}`
                    : `Go to page ${pageNumber}`
                }
              >
                {pageNumber}
              </PaginationLink>
            </Link>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis/>
        </PaginationItem>
        <PaginationItem>
          <Link
            href={`?page=${nextPage}`}
            shallow
            passHref
          >
            <PaginationLink
              size="default"
              className="gap-1 px-2.5 sm:pr-2.5"
              aria-label="Go to next page"
            >
              <span className="hidden sm:block">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </PaginationLink>
          </Link>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
