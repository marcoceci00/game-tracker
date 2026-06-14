import LibraryCard from "@/components/library-card"
import prisma from "@/lib/prisma"

export default async function Library() {
  const res = await prisma.game.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <div className="mx-auto w-3/4 pt-8">
      <div className="mt-4 grid grid-cols-4 gap-4">
        {res.map((game) => (
          <LibraryCard {...game} key={game.id} />
        ))}
      </div>
    </div>
  )
}
