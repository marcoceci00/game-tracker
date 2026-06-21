"use client"

import { IgdbGame } from "@/lib/types"
import GameCard from "@/components/game-card"

type ResultsGridProps = {
  hasSearched: boolean
  games: IgdbGame[]
}

export default function ResultsGrid({ hasSearched, games }: ResultsGridProps) {
  return (
    <>
      {!hasSearched ? (
        <p className="mt-8 text-center text-2xl font-semibold">
          Search for a game
        </p>
      ) : games.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {games.map((game) => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-center text-2xl font-semibold">
          No games found
        </p>
      )}
    </>
  )
}
