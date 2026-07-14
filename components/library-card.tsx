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
import { igdbImageUrl, ratingColor } from "@/lib/utils"
import { PLATFORM_LABELS, STATUS_COLORS, STATUS_LABELS } from "@/lib/status"
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
import { useAction } from "@/hooks/use-action"

export default function LibraryCard({
  section,
  ...game
}: LibraryGame & { section?: string }) {
  const canEdit = useEditMode()
  const { run } = useAction()
  const [ratingValue, setRatingValue] = useState([Number(game.userRating)])
  const [notesValue, setNotesValue] = useState(game.notes ?? "")
  const [statusValue, setStatusValue] = useState(game.status)
  const [platformValue, setPlatformValue] = useState(game.platform)

  function handleStatusChange(id: number, status: Status) {
    run(async () => {
      await updateStatus(id, status)
      setStatusValue(status)
      toast.success("Status has been changed")
    })
  }

  function handlePlatformChange(id: number, platform: Platform) {
    run(async () => {
      await updatePlatform(id, platform)
      setPlatformValue(platform)
      toast.success("Platform has been changed")
    })
  }

  function handleRatingChange(id: number, rating: number) {
    run(async () => {
      await updateRating(id, rating)
      setRatingValue([rating])
      toast.success(
        rating === 0 ? "Rating has been reset" : "Rating has been changed"
      )
    })
  }

  function handleNotesBlur(id: number, notes: string) {
    run(async () => {
      try {
        await updateNotes(id, notes)
      } catch (error) {
        setNotesValue(game.notes ?? "")
        throw error
      }
    })
  }

  function handleDelete(id: number) {
    run(async () => {
      await deleteGame(id)
      toast.success("Game has been deleted")
    })
  }

  return (
    <Card className="h-full pt-0">
      <Link
        href={section ? `/${game.id}?from=${section}` : `/${game.id}`}
        className="block rounded-t-xl transition-opacity hover:opacity-90"
      >
        <ViewTransition
          name={`cover-${section ? section + "-" : ""}${game.id}`}
        >
          <Image
            src={
              game.cover ? igdbImageUrl(game.cover, "t_cover_big") : "/no-cover.png"
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
            <SelectTrigger className={STATUS_COLORS[statusValue]}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
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
              {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
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
