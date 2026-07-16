"use client"

import { LibraryGame } from "@/lib/types"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import LibraryCard from "@/components/library-card"
import { Platform, Status } from "@/lib/generated/prisma/enums"
import { PLATFORM_LABELS, STATUS_LABELS } from "@/lib/status"
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
const STATUS_LABELS_ALL: Record<Status | "ALL", string> = {
  ALL: "All",
  ...STATUS_LABELS,
}

const PLATFORMS: (Platform | "ALL")[] = ["ALL", ...Object.values(Platform)]
const PLATFORM_LABELS_ALL: Record<Platform | "ALL", string> = {
  ALL: "All",
  ...PLATFORM_LABELS,
}

const SORT_FN = {
  name_asc: (a: LibraryGame, b: LibraryGame) => a.name.localeCompare(b.name),
  createdAt_desc: (a: LibraryGame, b: LibraryGame) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  userRating_desc: (a: LibraryGame, b: LibraryGame) =>
    b.userRating - a.userRating,
  rating_desc: (a: LibraryGame, b: LibraryGame) => (b.rating ?? 0) - (a.rating ?? 0),
}
type SortKey = keyof typeof SORT_FN

export default function LibraryContent({ games }: { games: LibraryGame[] }) {
  const [status, setStatus] = useState<Status | "ALL">("ALL")
  const [platform, setPlatform] = useState<Platform | "ALL">("ALL")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("createdAt_desc")

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
            {STATUS_LABELS_ALL[s]}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="self-center text-sm text-muted-foreground">
          Platform:
        </span>
        <Select
          value={platform}
          onValueChange={(p) => setPlatform(p as Platform | "ALL")}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PLATFORMS.map((p) => (
                <SelectItem key={p} value={p}>
                  {PLATFORM_LABELS_ALL[p]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="self-center text-sm text-muted-foreground">Sort:</span>
        <Select value={sort} onValueChange={(s) => setSort(s as SortKey)}>
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
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your library..."
      />
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((game, i) => (
          <div
            key={game.id}
            className="animate-in fill-mode-both fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <LibraryCard {...game} />
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">No games found</p>
      )}
    </div>
  )
}
