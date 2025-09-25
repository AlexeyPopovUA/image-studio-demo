import {Loader2} from "lucide-react"

export function GalleryLoadingIndicator() {
  return (
    <div className="flex items-center space-x-2" role="status">
      <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      <span className="text-muted-foreground">Loading images...</span>
    </div>
  )
}

export function GalleryInitialLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <GalleryLoadingIndicator />
    </div>
  )
}
