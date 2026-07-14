import { Platform, Status } from "@/lib/generated/prisma/enums"

export const STATUS_LABELS: Record<Status, string> = {
  WISHLIST: "Wishlist",
  BACKLOG: "Backlog",
  PLAYING: "Playing",
  SHELVED: "Shelved",
  COMPLETED: "Completed",
  DROPPED: "Dropped",
}

export const STATUS_COLORS: Record<Status, string> = {
  WISHLIST: "!bg-purple-500",
  BACKLOG: "!bg-slate-500",
  PLAYING: "!bg-yellow-500",
  SHELVED: "!bg-orange-500",
  COMPLETED: "!bg-green-500",
  DROPPED: "!bg-red-500",
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  PC: "PC",
  PLAYSTATION_5: "Playstation 5",
  NINTENDO_SWITCH_2: "Nintendo Switch 2",
}
