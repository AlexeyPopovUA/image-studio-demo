import type {ReactNode} from "react"
import {GalleryPagination} from "./gallery-pagination";

type GalleryLayoutProps = {
  currentPage: number
  pageNumbers: number[]
  children: ReactNode
  showFooter: boolean
  footerText: string
}

export function GalleryLayout({
  currentPage,
  pageNumbers,
  children,
  showFooter,
  footerText,
}: GalleryLayoutProps) {
  return (
    <div className="space-y-6">
      <GalleryPagination currentPage={currentPage} pageNumbers={pageNumbers} />
      {children}
      <GalleryPagination currentPage={currentPage} pageNumbers={pageNumbers} />
      {showFooter ? (
        <div className="text-center text-sm text-muted-foreground">{footerText}</div>
      ) : null}
    </div>
  )
}
