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
          <p className="col-span-full text-sm text-muted-foreground">
            {games.length} {games.length === 1 ? "game" : "games"} found
          </p>
          {games.map((game, i) => (
            <div
              key={game.id}
              className="animate-in fill-mode-both fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <GameCard {...game} />
            </div>
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
