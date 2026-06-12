"use client"

import { Game } from "@/lib/types"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { readGame, createGame } from "@/app/actions"

type ResultsGridProps = {
  games: Game[]
}

export default function ResultsGrid({ games }: ResultsGridProps) {
  async function handleClick(game: Game) {
    const exists = await readGame(game.id)
    if (!exists) {
      await createGame(game)
    }
  }

  return (
    <div className="mt-4 grid grid-cols-4 gap-4">
      {games.map((game) => (
        <Card key={game.id}>
          <img
            src={game.background_image || undefined}
            alt={`${game.name} image`}
            className="aspect-video"
          />
          <CardHeader>
            <CardTitle>{game.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>{`Playtime: ${game.playtime} hours`}</div>
            <div>{`Released: ${game.released}`}</div>
            <div>{`Metacritic Score: ${game.metacritic || "/"}`}</div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleClick(game)}>Add to library</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
