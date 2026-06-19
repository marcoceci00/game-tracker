import { IgdbGame } from "@/lib/types"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import InsertButton from "./insert-button"

export default function GameCard(game: IgdbGame) {
  return (
    <Card>
      <Image
        src={
          game.cover?.image_id
            ? `https://images.igdb.com/igdb/image/upload/t_1080p/${game.cover.image_id}.jpg`
            : "https://t4.ftcdn.net/jpg/06/57/37/01/360_F_657370150_pdNeG5pjI976ZasVbKN9VqH1rfoykdYU.jpg"
        }
        width={1080}
        height={1920}
        alt={`${game.name} image`}
      />
      <CardHeader>
        <Link href={`/${game.id}`}>
          <CardTitle>{`${game.name} (${new Date(game.first_release_date * 1000).toLocaleDateString("en-EN", { year: "numeric" })})`}</CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="flex grow flex-col gap-2">
        <div>
          {game.genres && (
            <div className="flex flex-wrap gap-2">
              {game.genres.map((genre) => (
                <Badge variant="secondary" key={genre.name}>
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <Badge
          className={`${!game.aggregated_rating ? "bg-accent" : Math.round(game.aggregated_rating) < 60 ? "bg-red-500" : Math.round(game.aggregated_rating) < 90 ? "bg-blue-500" : "bg-green-500"} mt-auto p-4`}
        >
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
