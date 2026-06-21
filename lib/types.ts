import type { GameModel } from "@/lib/generated/prisma/models/Game"

export type IgdbGame = {
  id: number
  name: string
  cover?: { image_id: string }
  aggregated_rating?: number
  first_release_date?: number
  genres?: { name: string }[]
}

export type LibraryGame = Omit<GameModel, "userRating"> & {
  userRating: number
}

export type IgdbGameDetails = {
  id: number
  name?: string
  cover?: { image_id: string }
  genres?: { name: string }[]
  aggregated_rating?: number
  first_release_date?: number
  summary?: string
  screenshots?: { id: number; image_id: string }[]
  platforms?: { id: number; name: string }[]
  involved_companies?: { id: number; company: { name: string } }[]
}
