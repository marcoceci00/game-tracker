"use client"

import { IgdbGame } from "@/lib/types"
import GameCard from "@/components/game-card"

type ResultsGridProps = {
  games: IgdbGame[]
}

export default function ResultsGrid({ games }: ResultsGridProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {games.map((game) => (
        <GameCard key={game.id} {...game} />
      ))}
    </div>
  )
}
