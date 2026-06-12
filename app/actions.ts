"use server"

import { Game } from "@/lib/types"
import prisma from "@/lib/prisma"

export async function createGame(game: Game) {
  await prisma.game.create({
    data: {
      name: game.name,
      playtime: game.playtime,
      released: game.released ? new Date(game.released) : null,
      backgroundImage: game.background_image,
      metacriticScore: game.metacritic,
    },
  })
}

export async function readGame(id: number) {
  const result = await prisma.game.findUnique({ where: { id: id } })

  return result
}

export async function updateGame() {}

export async function deleteGame() {}

export async function searchGame(data: { name: string }) {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games` +
        `?key=${process.env.RAWG_API_KEY}` +
        `&page_size=16` +
        `&search_exact=true` +
        `&ordering=-added` +
        `&search=${encodeURIComponent(data.name)}`
    )
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const result = await response.json()

    return result
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
  }
}
