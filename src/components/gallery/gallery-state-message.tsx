"use client"

import type {ReactNode} from "react"
import {AlertCircle} from "lucide-react"

type GalleryStateMessageProps = {
  title: string
  description?: ReactNode
  helper?: ReactNode
  iconVariant?: "muted" | "destructive"
}

export function GalleryStateMessage({
  title,
  description,
  helper,
  iconVariant = "muted",
}: GalleryStateMessageProps) {
  const iconClass = iconVariant === "destructive" ? "text-destructive" : "text-muted-foreground"

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-3">
        <AlertCircle className={`h-12 w-12 mx-auto ${iconClass}`} aria-hidden="true" />
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description ? <p className="text-muted-foreground">{description}</p> : null}
        {helper ? <p className="text-muted-foreground">{helper}</p> : null}
      </div>
    </div>
  )
}
