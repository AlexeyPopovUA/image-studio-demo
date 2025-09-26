import {Loader2} from "lucide-react"

export function GalleryLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin mr-4" aria-hidden="true" />
        <span className="text-muted-foreground">Loading images...</span>
    </div>
  )
}
