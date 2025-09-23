import Link from "next/link";
import Image from "next/image";
import {PicsumAPI, PicsumImage} from "@/lib/picsum-api";
import {Card, CardContent} from "@/components/ui/card";

export function ImageCard(props: { image: PicsumImage }) {
  return <Link href={`/edit/?id=${props.image.id}`} className="block">
    <Card className="group cursor-pointer transition-all duration-200 bg-card border-border pt-0">
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <Image
            src={PicsumAPI.getThumbnailUrl(props.image.id, 400)}
            alt={`Photo by ${props.image.author}`}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"/>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            Photo #{props.image.id}
          </h3>
          <p className="text-sm text-muted-foreground">by {props.image.author}</p>
          <p className="text-xs text-muted-foreground">
            {props.image.width} × {props.image.height}
          </p>
        </div>
      </CardContent>
    </Card>
  </Link>;
}
