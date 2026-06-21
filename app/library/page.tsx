import LibraryCard from "@/components/library-card"
import LibraryFilters from "@/components/library-filters"
import { Prisma } from "@/lib/generated/prisma/client"
import { Status } from "@/lib/generated/prisma/enums"
import prisma from "@/lib/prisma"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Library",
}

const ORDER_MAP: Record<string, Prisma.GameOrderByWithRelationInput> = {
  createdAt_desc: { createdAt: "desc" },
  name_asc: { name: "asc" },
  userRating_desc: { userRating: "desc" },
  rating_desc: { rating: "desc" },
}

export default async function Library({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; sort?: string }>
}) {
  const { status, sort } = await searchParams
  const orderBy = ORDER_MAP[sort ?? "createdAt_desc"] ?? { createdAt: "desc" }
  const validStatus = Object.values(Status).includes(status as Status)
    ? (status as Status)
    : undefined
  const res = await prisma.game.findMany({
    where: validStatus ? { status: validStatus } : undefined,
    orderBy,
  })
  const games = res.map((game) => ({
    ...game,
    userRating: Number(game.userRating),
  }))

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Library</h1>
      <Suspense fallback={null}>
        <LibraryFilters />
      </Suspense>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {games.map((game) => (
          <LibraryCard {...game} key={game.id} />
        ))}
      </div>
      {games.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">No games found</p>
      )}
    </div>
  )
}
