import type { GameModel } from "@/lib/generated/prisma/models/Game"

export type IgdbGame = {
  id: number
  name: string
  cover: { image_id: string }
  aggregated_rating: number
  first_release_date: number
  genres: [{ name: string }]
}

export type LibraryGame = Omit<GameModel, "userRating"> & {
  userRating: number | null
}
