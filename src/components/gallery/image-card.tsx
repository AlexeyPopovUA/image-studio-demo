import Link from "next/link";
import Image from "next/image";
import {getThumbnailUrl, PicsumImage} from "@/lib/picsum-api";
import {Card, CardContent} from "@/components/ui/card";

type ImageCardProps = {
  image: PicsumImage
  prevPage?: string
}

export function ImageCard({image, prevPage}: ImageCardProps) {
  const searchParams = new URLSearchParams({id: image.id})

  if (prevPage) {
    searchParams.set("prevPage", prevPage)
  }

  const href = `/edit/?${searchParams.toString()}`

  return <Link href={href} className="block" shallow={true}>
    <Card className="group cursor-pointer transition-all duration-200 bg-card border-border pt-0">
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <Image
            src={getThumbnailUrl(image.id, 600)}
            alt={`Photo by ${image.author}`}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"/>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            Photo #{image.id}
          </h3>
          <p className="text-sm text-muted-foreground">by {image.author}</p>
          <p className="text-xs text-muted-foreground">
            {image.width} × {image.height}
          </p>
        </div>
      </CardContent>
    </Card>
  </Link>;
}
