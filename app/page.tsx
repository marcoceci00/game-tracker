import { Status } from "@/lib/generated/prisma/enums"
import prisma from "@/lib/prisma"
import LibraryCard from "@/components/library-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"

export const metadata: Metadata = { title: "Home" }

const STAT_CARDS: { label: string; key: Status }[] = [
  { label: "Wishlist", key: "WISHLIST" },
  { label: "Backlog", key: "BACKLOG" },
  { label: "Playing", key: "PLAYING" },
  { label: "Shelved", key: "SHELVED" },
  { label: "Completed", key: "COMPLETED" },
  { label: "Dropped", key: "DROPPED" },
]

export default async function Page() {
  const [
    playingGamesRaw,
    statusGroups,
    ratingAgg,
    recentlyCompletedRaw,
    recentlyAddedRaw,
    topRatedRaw,
    genreData,
  ] = await Promise.all([
    prisma.game.findMany({
      where: { status: Status.PLAYING },
    }),
    prisma.game.groupBy({ by: ["status"], _count: true }),
    prisma.game.aggregate({
      where: { userRating: { gt: 0 } },
      _avg: { userRating: true },
    }),
    prisma.game.findMany({
      where: { status: Status.COMPLETED },
      orderBy: { updatedAt: "desc" },
      take: 4,
    }),
    prisma.game.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.game.findMany({
      where: { userRating: { gt: 0 } },
      orderBy: { userRating: "desc" },
      take: 4,
    }),
    prisma.game.findMany({ select: { genres: true } }),
  ])

  const playingGames = playingGamesRaw.map((game) => ({
    ...game,
    userRating: Number(game.userRating),
  }))

  const countByStatus = Object.fromEntries(
    statusGroups.map((item) => [item.status, item._count])
  )

  const totalGames = Object.values(countByStatus).reduce((a, b) => a + b, 0)

  const avgRating = ratingAgg._avg.userRating
    ? Number(ratingAgg._avg.userRating).toFixed(1)
    : null

  const recentlyCompleted = recentlyCompletedRaw.map((game) => ({
    ...game,
    userRating: Number(game.userRating),
  }))

  const recentlyAdded = recentlyAddedRaw.map((game) => ({
    ...game,
    userRating: Number(game.userRating),
  }))

  const topRated = topRatedRaw.map((game) => ({
    ...game,
    userRating: Number(game.userRating),
  }))

  const genreCounts = Object.entries(
    genreData
      .flatMap((game) => game.genres)
      .reduce<Record<string, number>>((acc, genre) => {
        acc[genre] = (acc[genre] ?? 0) + 1
        return acc
      }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Home</h1>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Games</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalGames}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Personal Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{avgRating ?? "-"}</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {STAT_CARDS.map((item) => (
          <Card key={item.key}>
            <CardHeader>
              <CardTitle>{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {countByStatus[item.key] ?? 0}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <h2 className="mt-8 text-2xl font-semibold">Top Genres</h2>
      {genreCounts.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {genreCounts.map(([genre, count]) => (
            <Card key={genre}>
              <CardHeader>
                <CardTitle>{genre}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{count}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No genres yet</p>
      )}
      <h2 className="mt-8 text-2xl font-semibold">Currently Playing</h2>
      {playingGames.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {playingGames.map((game) => (
            <LibraryCard {...game} key={game.id} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No games in progress</p>
      )}
      <h2 className="mt-8 text-2xl font-semibold">Recently Completed</h2>
      {recentlyCompleted.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {recentlyCompleted.map((game) => (
            <LibraryCard {...game} key={game.id} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No completed games yet</p>
      )}
      <h2 className="mt-8 text-2xl font-semibold">Recently Added</h2>
      {recentlyAdded.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {recentlyAdded.map((game) => (
            <LibraryCard {...game} key={game.id} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No games added yet</p>
      )}
      <h2 className="mt-8 text-2xl font-semibold">Top Rated</h2>
      {topRated.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {topRated.map((game) => (
            <LibraryCard {...game} key={game.id} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No games rated yet</p>
      )}
    </div>
  )
}
