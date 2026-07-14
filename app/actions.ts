"use server"

import * as z from "zod"
import { cache } from "react"
import {
  clearAttempts,
  createSessionToken,
  EDIT_COOKIE_NAME,
  recordFailedAttempt,
  requireEditAccess,
  SESSION_MAX_AGE_MS,
  tooManyAttempts,
  verifyEditPassword,
} from "@/lib/auth"
import { cookies } from "next/headers"
import { IgdbGame } from "@/lib/types"
import prisma from "@/lib/prisma"
import { revalidatePath, unstable_cache } from "next/cache"
import { Platform, Status } from "@/lib/generated/prisma/enums"

const statusSchema = z.enum(Object.values(Status) as [Status, ...Status[]])
const platformSchema = z.enum(
  Object.values(Platform) as [Platform, ...Platform[]]
)
const ratingSchema = z.number().min(0).max(10)
const notesSchema = z.string().max(2000)

export async function unlockEditing(password: string) {
  if (await tooManyAttempts()) return false
  const ok = verifyEditPassword(password)

  if (ok) {
    await clearAttempts()
    ;(await cookies()).set(EDIT_COOKIE_NAME, createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_MS / 1000,
    })
  } else {
    await recordFailedAttempt()
  }

  return ok
}

export async function lockEditing() {
  ;(await cookies()).delete(EDIT_COOKIE_NAME)
}

export const readGame = cache(async (id: number) => {
  return await prisma.game.findUnique({ where: { id: id } })
})

export const getGameDetails = unstable_cache(
  async (id: number) => {
    if (!process.env.IGDB_CLIENT_ID || !process.env.IGDB_API_KEY) {
      throw new Error("Missing IGDB credentials")
    }

    const response = await fetch(`https://api.igdb.com/v4/games`, {
      method: "POST",
      headers: {
        "Client-ID": process.env.IGDB_CLIENT_ID,
        Authorization: `Bearer ${await getIgdbAccessToken()}`,
      },
      body: `
        fields name,cover.image_id,genres.name,aggregated_rating,first_release_date,total_rating,summary,screenshots.image_id,platforms.name,involved_companies.company.name;
        where id=${id};
      `,
    })

    if (!response.ok) throw new Error(`IGDB error: ${response.status}`)

    return await response.json()
  },
  ["game-details"],
  { revalidate: 3600 }
)

export async function createGame(game: IgdbGame) {
  await requireEditAccess()

  await prisma.game.create({
    data: {
      id: game.id,
      name: game.name,
      cover: game.cover?.image_id ?? null,
      genres: game.genres?.map((genre) => genre.name),
      rating: game.aggregated_rating
        ? Math.round(game.aggregated_rating)
        : null,
      release_date: game.first_release_date
        ? new Date(game.first_release_date * 1000)
        : null,
    },
  })

  revalidatePath("/", "layout")
}

export async function deleteGame(id: number) {
  await requireEditAccess()

  await prisma.game.delete({ where: { id: id } })
  revalidatePath("/", "layout")
}

export async function searchGame(data: { name: string }) {
  if (!process.env.IGDB_CLIENT_ID || !process.env.IGDB_API_KEY) {
    throw new Error("Missing IGDB credentials")
  }

  const safeName = data.name.replace(/\\/g, "\\\\").replace(/"/g, '\\"')

  const response = await fetch(`https://api.igdb.com/v4/games`, {
    method: "POST",
    headers: {
      "Client-ID": process.env.IGDB_CLIENT_ID,
      Authorization: `Bearer ${await getIgdbAccessToken()}`,
    },
    body: `
        search "${safeName}";
        fields name,cover.image_id,genres.name,aggregated_rating,first_release_date,total_rating;
        where total_rating != null;
        limit 500;
      `,
  })

  if (!response.ok) throw new Error(`IGDB error: ${response.status}`)

  const result = await response.json()
  const sortedResult = result.sort(
    (a: IgdbGame, b: IgdbGame) =>
      (b.first_release_date ?? 0) - (a.first_release_date ?? 0)
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

export async function updateStatus(id: number, status: Status) {
  await requireEditAccess()
  const validStatus = statusSchema.parse(status)

  await prisma.game.update({
    where: {
      id: id,
    },
    data: {
      status: validStatus,
    },
  })
  revalidatePath("/", "layout")
}

export async function updatePlatform(id: number, platform: Platform) {
  await requireEditAccess()
  const validPlatform = platformSchema.parse(platform)

  await prisma.game.update({
    where: {
      id: id,
    },
    data: {
      platform: validPlatform,
    },
  })
  revalidatePath("/", "layout")
}

export async function updateRating(id: number, userRating: number) {
  await requireEditAccess()
  const validRating = ratingSchema.parse(userRating)

  await prisma.game.update({
    where: {
      id: id,
    },
    data: {
      userRating: validRating,
    },
  })
  revalidatePath("/", "layout")
}

export async function updateNotes(id: number, notes: string) {
  await requireEditAccess()
  const validNotes = notesSchema.parse(notes)

  await prisma.game.update({
    where: { id: id },
    data: { notes: validNotes },
  })
  revalidatePath("/", "layout")
}

const getIgdbAccessToken = unstable_cache(
  async () => {
    const response = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_API_KEY}&grant_type=client_credentials`,
      { method: "POST" }
    )

    if (!response.ok) throw new Error(`Twitch token error: ${response.status}`)

    const data = await response.json()
    return data.access_token as string
  },
  ["igdb-access-token"],
  { revalidate: 60 * 60 * 24 * 30 } // 30 giorni
)
