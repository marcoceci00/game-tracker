"use server"

import { IgdbGame, IgdbGameDetails } from "@/lib/types"
import prisma from "@/lib/prisma"
import { Status, Platform } from "@/lib/generated/prisma/enums"
import { revalidatePath } from "next/cache"

export async function createGame(game: IgdbGame) {
  await prisma.game.create({
    data: {
      id: game.id,
      name: game.name,
      cover: game.cover.image_id || null,
      genres: game.genres.map((genre) => genre.name),
      rating: Math.round(game.aggregated_rating) || null,
      release_date: new Date(game.first_release_date * 1000) || null,
    },
  })
}

export async function readGame(id: number) {
  return await prisma.game.findUnique({ where: { id: id } })
}

export async function getGameDetails(id: number): Promise<IgdbGameDetails[]> {
  if (!process.env.IGDB_CLIENT_ID || !process.env.IGDB_TOKEN) {
    throw new Error("Missing IGDB credentials")
  }

  const response = await fetch(`https://api.igdb.com/v4/games`, {
    method: "POST",
    headers: {
      "Client-ID": process.env.IGDB_CLIENT_ID,
      Authorization: `Bearer ${process.env.IGDB_TOKEN}`,
    },
    body: `
        fields name,cover.image_id,genres.name,aggregated_rating,first_release_date,total_rating,summary,screenshots.image_id,platforms.name,involved_companies.company.name;
        where id=${id};
      `,
  })

  return await response.json()
}

export async function updateGame() {}

export async function deleteGame(id: number) {
  await prisma.game.delete({ where: { id: id } })
  revalidatePath("/library")
}

export async function searchGame(data: { name: string }) {
  if (!process.env.IGDB_CLIENT_ID || !process.env.IGDB_TOKEN) {
    throw new Error("Missing IGDB credentials")
  }

  const response = await fetch(`https://api.igdb.com/v4/games`, {
    method: "POST",
    headers: {
      "Client-ID": process.env.IGDB_CLIENT_ID,
      Authorization: `Bearer ${process.env.IGDB_TOKEN}`,
    },
    body: `
        search "${data.name}";
        fields name,cover.image_id,genres.name,aggregated_rating,first_release_date,total_rating;
        where total_rating != null;
        limit 500;
      `,
  })

  const result = await response.json()
  const sortedResult = result.sort(
    (a: IgdbGame, b: IgdbGame) => b.first_release_date - a.first_release_date
  )
  return sortedResult
}

export async function addGameIfNotExists(game: IgdbGame) {
  const exists = await readGame(game.id)

  if (!exists) {
    await createGame(game)
    return true
  }

  return false
}

export async function updateStatus(id: number, status: string) {
  await prisma.game.update({
    where: {
      id: id,
    },
    data: {
      status: status as Status,
    },
  })
  revalidatePath("/library")
}

export async function updatePlatform(id: number, platform: string) {
  await prisma.game.update({
    where: {
      id: id,
    },
    data: {
      platform: platform as Platform,
    },
  })
  revalidatePath("/library")
}

export async function updateRating(id: number, userRating: number) {
  await prisma.game.update({
    where: {
      id: id,
    },
    data: {
      userRating: userRating,
    },
  })
  revalidatePath("/library")
}

export async function updateNotes(id: number, notes: string) {
  await prisma.game.update({
    where: { id: id },
    data: { notes: notes },
  })
  revalidatePath("/library")
}
