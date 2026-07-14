"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  deleteGame,
  updateNotes,
  updatePlatform,
  updateRating,
  updateStatus,
} from "@/app/actions"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import type { LibraryGame } from "@/lib/types"
import Link from "next/link"
import { Platform, Status } from "@/lib/generated/prisma/enums"
import { ratingColor } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useEditMode } from "@/components/edit-mode-context"
import { useState } from "react"
import { ViewTransition } from "react"
import { X } from "lucide-react"

const statusColor: Record<Status, string> = {
  WISHLIST: "!bg-purple-500",
  BACKLOG: "!bg-slate-500",
  PLAYING: "!bg-yellow-500",
  SHELVED: "!bg-orange-500",
  COMPLETED: "!bg-green-500",
  DROPPED: "!bg-red-500",
}

export default function LibraryCard({
  section,
  ...game
}: LibraryGame & { section?: string }) {
  const canEdit = useEditMode()
  const [ratingValue, setRatingValue] = useState([Number(game.userRating)])
  const [notesValue, setNotesValue] = useState(game.notes ?? "")
  const [statusValue, setStatusValue] = useState(game.status)
  const [platformValue, setPlatformValue] = useState(game.platform)

  async function handleStatusChange(id: number, status: Status) {
    try {
      await updateStatus(id, status)
      setStatusValue(status)
      toast.success("Status has been changed")
    } catch {
      toast.error("Something went wrong")
    }
  }

  async function handlePlatformChange(id: number, platform: Platform) {
    try {
      await updatePlatform(id, platform)
      setPlatformValue(platform)
      toast.success("Platform has been changed")
    } catch {
      toast.error("Something went wrong")
    }
  }

  async function handleRatingChange(id: number, rating: number) {
    try {
      await updateRating(id, rating)
      setRatingValue([rating])
      toast.success(
        rating === 0 ? "Rating has been reset" : "Rating has been changed"
      )
    } catch {
      toast.error("Something went wrong")
    }
  }

  async function handleNotesBlur(id: number, notes: string) {
    try {
      await updateNotes(id, notes)
    } catch {
      toast.error("Something went wrong")
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteGame(id)
      toast.success("Game has been deleted")
    } catch {
      toast.error("Something went wrong")
    }
  }

  return (
    <Card className="h-full pt-0">
      <Link
        href={`/${game.id}`}
        className="block rounded-t-xl transition-opacity hover:opacity-90"
      >
        <ViewTransition
          name={`cover-${section ? section + "-" : ""}${game.id}`}
        >
          <Image
            src={
              game.cover
                ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover}.jpg`
                : "/no-cover.png"
            }
            width={1080}
            height={1920}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            alt={`${game.name} image`}
            loading="lazy"
          />
        </ViewTransition>
      </Link>
      <CardHeader>
        <CardTitle>{game.name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {game.release_date
            ? new Date(game.release_date).toLocaleDateString("en", {
                year: "numeric",
              })
            : "N.A."}
        </p>
        <CardAction>
          <Select
            value={statusValue}
            disabled={!canEdit}
            onValueChange={(status) =>
              handleStatusChange(game.id, status as Status)
            }
          >
            <SelectTrigger className={statusColor[statusValue]}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="WISHLIST">Wishlist</SelectItem>
                <SelectItem value="BACKLOG">Backlog</SelectItem>
                <SelectItem value="PLAYING">Playing</SelectItem>
                <SelectItem value="SHELVED">Shelved</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="DROPPED">Dropped</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex grow flex-col gap-2">
        <div>
          {game.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {game.genres.map((genre) => (
                <Badge variant="secondary" key={genre}>
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <Select
          value={platformValue}
          disabled={!canEdit}
          onValueChange={(platform) =>
            handlePlatformChange(game.id, platform as Platform)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="PC">PC</SelectItem>
              <SelectItem value="PLAYSTATION_5">Playstation 5</SelectItem>
              <SelectItem value="NINTENDO_SWITCH_2">
                Nintendo Switch 2
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Badge className={`${ratingColor(game.rating)} mt-auto p-4`}>
          {!game.rating ? "N.A." : Math.round(game.rating)}
        </Badge>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            My Rating: {ratingValue[0] === 0 ? "-" : ratingValue[0]}
          </span>
          {canEdit && ratingValue[0] > 0 && (
            <Button
              variant="ghost"
              size="icon-sm"
              title="Reset rating"
              onClick={() => handleRatingChange(game.id, 0)}
            >
              <X />
            </Button>
          )}
        </div>
        <Slider
          value={ratingValue}
          onValueChange={setRatingValue}
          onValueCommit={(rating) => handleRatingChange(game.id, rating[0])}
          min={1}
          max={10}
          step={0.5}
          disabled={!canEdit}
        />
        <Textarea
          rows={3}
          placeholder="Personal notes..."
          value={notesValue}
          onChange={(e) => setNotesValue(e.target.value)}
          onBlur={() => handleNotesBlur(game.id, notesValue)}
          disabled={!canEdit}
        />
      </CardContent>
      <CardFooter>
        {canEdit && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your game from your library.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(game.id)}
                >
                  Continue
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  )
}
