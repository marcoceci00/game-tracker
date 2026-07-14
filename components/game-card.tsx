import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { IgdbGame } from "@/lib/types"
import Image from "next/image"
import InsertButton from "./insert-button"
import Link from "next/link"
import { ratingColor } from "@/lib/utils"

export default function GameCard(game: IgdbGame) {
  return (
    <Card>
      <Image
        src={
          game.cover?.image_id
            ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
            : "/no-cover.png"
        }
        width={1080}
        height={1920}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        alt={`${game.name} image`}
        loading="lazy"
      />
      <CardHeader>
        <Link href={`/${game.id}`}>
          <CardTitle>{`${game.name} (${game.first_release_date ? new Date(game.first_release_date * 1000).toLocaleDateString("en-EN", { year: "numeric" }) : "N.A."})`}</CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="flex grow flex-col gap-2">
        <div>
          {(game.genres?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-2">
              {game.genres?.map((genre) => (
                <Badge variant="secondary" key={genre.name}>
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <Badge className={`${ratingColor(game.aggregated_rating)} mt-auto p-4`}>
          {!game.aggregated_rating
            ? "N.A."
            : Math.round(game.aggregated_rating)}
        </Badge>
      </CardContent>
      <CardFooter>
        <InsertButton game={game} />
      </CardFooter>
    </Card>
  )
}
