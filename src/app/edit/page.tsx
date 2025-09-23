import {Suspense} from "react";
import {ImageEditor} from "@/app/edit/image-editor";

export default async function EditPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <ImageEditor/>
      </Suspense>
    </main>
  )
}
