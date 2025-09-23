import {ImageEditor} from "@/app/edit/image-editor";

interface PageProps {
  params: { id: string }
}

export default async function EditPage({ params }: PageProps) {
  console.log(params.id)

  return (
    <main className="min-h-screen bg-background">
      <ImageEditor />
    </main>
  )
}
