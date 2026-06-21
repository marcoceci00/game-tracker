import LibraryContent from "@/components/library-content"
import prisma from "@/lib/prisma"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Library",
}

export default async function Library() {
  const res = await prisma.game.findMany()
  const games = res.map((game) => ({
    ...game,
    userRating: Number(game.userRating),
  }))

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Library</h1>
      <LibraryContent games={games} />
    </div>
  )
}
