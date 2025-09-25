import Link from "next/link";
import {ImageGallery} from "@/components/gallery/image-gallery"
import {Suspense} from "react";

export default function Home() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          <Link
            href="/"
            className="text-foreground hover:underline focus-visible:underline"
          >
            Image Editor
          </Link>
        </h1>
        <p className="text-muted-foreground">Browse and edit your images with professional tools</p>
      </header>
      <Suspense fallback={null}>
        <ImageGallery/>
      </Suspense>
    </>
  )
}
