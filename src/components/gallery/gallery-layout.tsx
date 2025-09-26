import type {ReactNode} from "react"
import {GalleryPagination} from "./gallery-pagination";

type GalleryLayoutProps = {
  currentPage: number
  pageNumbers: number[]
  children: ReactNode
}

export function GalleryLayout({
  currentPage,
  pageNumbers,
  children,
}: GalleryLayoutProps) {
  return (
    <div className="space-y-6">
      <GalleryPagination currentPage={currentPage} pageNumbers={pageNumbers}/>
      {children}
      <GalleryPagination currentPage={currentPage} pageNumbers={pageNumbers}/>
    </div>
  )
}
