import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function igdbImageUrl(imageId: string, size: "t_cover_big" | "t_1080p") {
  return `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`
}

export function ratingColor(rating: number | null | undefined) {
  if (rating == null) return "bg-accent"

  const ratingRounded = Math.round(rating)

  return ratingRounded < 60
    ? "bg-red-500"
    : ratingRounded < 90
      ? "bg-blue-500"
      : "bg-green-500"
}
