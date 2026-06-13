import prisma from "@/lib/prisma"

export default async function Library() {
  const res = await prisma.game.findMany()
  console.log(res)
}
