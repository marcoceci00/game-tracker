"use client"

import { LibraryGame } from "@/lib/types"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import LibraryCard from "@/components/library-card"
import { Platform, Status } from "@/lib/generated/prisma/enums"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
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

const PLATFORMS: (Platform | "ALL")[] = ["ALL", ...Object.values(Platform)]

const PLATFORM_LABELS: Record<Platform | "ALL", string> = {
  ALL: "All",
  PC: "PC",
  PLAYSTATION_5: "Playstation 5",
  NINTENDO_SWITCH_2: "Nintendo Switch 2",
}

const SORT_FN: Record<string, (a: LibraryGame, b: LibraryGame) => number> = {
  name_asc: (a, b) => a.name.localeCompare(b.name),
  createdAt_desc: (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  userRating_desc: (a, b) => b.userRating - a.userRating,
  rating_desc: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
}

export default function LibraryContent({ games }: { games: LibraryGame[] }) {
  const [status, setStatus] = useState("ALL")
  const [platform, setPlatform] = useState("ALL")
  const [sort, setSort] = useState("createdAt_desc")
  const [query, setQuery] = useState("")
  const filtered = games
    .filter((g) => status === "ALL" || g.status === status)
    .filter((g) => platform === "ALL" || g.platform === platform)
    .filter((g) => g.name.toLowerCase().includes(query.toLowerCase()))
    .sort(SORT_FN[sort])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <span className="self-center text-sm text-muted-foreground">
          Filter:
        </span>
        {STATUSES.map((s) => (
          <Button
            key={s}
            variant={s === status ? "default" : "outline"}
            onClick={() => setStatus(s)}
          >
            {STATUS_LABELS[s]}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="self-center text-sm text-muted-foreground">
          Platform:
        </span>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PLATFORMS.map((p) => (
                <SelectItem key={p} value={p}>
                  {PLATFORM_LABELS[p]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="self-center text-sm text-muted-foreground">Sort:</span>
        <Select value={sort} onValueChange={setSort}>
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
      <Input
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your library..."
      />
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((game) => (
          <LibraryCard {...game} key={game.id} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">No games found</p>
      )}
    </div>
  )
}

// Implementare filtro per genere nella libreria (`components/library-content.tsx`).

// Stesso pattern del filtro platform, ma i generi sono un array:
// - lista generi: `[...new Set(games.flatMap(g => g.genres))]`
// - filtro: `g.genres.includes(genre)`
