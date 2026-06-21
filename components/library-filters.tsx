"use client"

import { Button } from "@/components/ui/button"
import { Status } from "@/lib/generated/prisma/enums"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const STATUSES: (Status | "ALL")[] = ["ALL", ...Object.values(Status)]

const STATUS_LABELS: Record<Status | "ALL", string> = {
  ALL: "All",
  WISHLIST: "Wishlist",
  BACKLOG: "Backlog",
  PLAYING: "Playing",
  SHELVED: "Shelved",
  COMPLETED: "Completed",
  DROPPED: "Dropped",
}

export default function LibraryFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentStatus = searchParams.get("status") ?? "ALL"
  const currentSort = searchParams.get("sort") ?? "createdAt_desc"

  function handleFilter(status: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (status !== "ALL") {
      params.set("status", status)
    } else {
      params.delete("status")
    }
    router.replace(`/library?${params.toString()}`)
  }

  function handleSort(sort: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", sort)
    router.replace(`/library?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <span className="self-center text-sm text-muted-foreground">
          Filter:
        </span>
        {STATUSES.map((status) => (
          <Button
            key={status}
            variant={status === currentStatus ? "default" : "outline"}
            onClick={() => handleFilter(status)}
          >
            {STATUS_LABELS[status]}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort:</span>
        <Select value={currentSort} onValueChange={handleSort}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="createdAt_desc">Recently Added</SelectItem>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              <SelectItem value="userRating_desc">My Rating</SelectItem>
              <SelectItem value="rating_desc">IGDB Rating</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
