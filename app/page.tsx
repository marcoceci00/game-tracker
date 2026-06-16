import { Status } from "@/lib/generated/prisma/enums"
import prisma from "@/lib/prisma"
import LibraryCard from "@/components/library-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const STAT_CARDS: { label: string; key: Status }[] = [
  { label: "Wishlist", key: "WISHLIST" },
  { label: "Backlog", key: "BACKLOG" },
  { label: "Playing", key: "PLAYING" },
  { label: "Shelved", key: "SHELVED" },
  { label: "Completed", key: "COMPLETED" },
  { label: "Dropped", key: "DROPPED" },
]

export default async function Page() {
  const [playingGamesRaw, statusGroups] = await Promise.all([
    prisma.game.findMany({
      where: { status: Status.PLAYING },
    }),
    prisma.game.groupBy({ by: ["status"], _count: true }),
  ])
  const playingGames = playingGamesRaw.map((game) => ({
    ...game,
    userRating: game.userRating ? Number(game.userRating) : null,
  }))
  const countByStatus = Object.fromEntries(
    statusGroups.map((item) => [item.status, item._count])
  )

  return (
    <div className="mx-auto w-3/4 pt-8">
      <div className="mt-4 grid grid-cols-6 gap-4">
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
    </div>
  )
}
