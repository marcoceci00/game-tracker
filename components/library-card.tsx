"use client"

import type { GameModel } from "@/lib/generated/prisma/models/Game"
import { toast } from "sonner"
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import Image from "next/image"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select"
import { updateStatus, deleteGame } from "@/app/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const statusColor: Record<string, string> = {
  WISHLIST: "!bg-purple-500",
  BACKLOG: "!bg-slate-500",
  PLAYING: "!bg-yellow-500",
  SHELVED: "!bg-orange-500",
  COMPLETED: "!bg-green-500",
  DROPPED: "!bg-red-500",
}

export default function LibraryCard(game: GameModel) {
  async function handleValueChange(id: number, status: string) {
    try {
      await updateStatus(id, status)
      toast.success("Status has been changed")
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
    <Card>
      <Image
        src={
          game.cover
            ? `https://images.igdb.com/igdb/image/upload/t_1080p/${game.cover}.jpg`
            : "https://t4.ftcdn.net/jpg/06/57/37/01/360_F_657370150_pdNeG5pjI976ZasVbKN9VqH1rfoykdYU.jpg"
        }
        width={1920}
        height={1080}
        alt={`${game.name} image`}
      />
      <CardHeader>
        <CardTitle>{`${game.name} (${game.release_date ? new Date(game.release_date).toLocaleDateString("en-EN", { year: "numeric" }) : "N.A."})`}</CardTitle>
        <CardAction>
          <Select
            defaultValue={game.status}
            onValueChange={(status) => handleValueChange(game.id, status)}
          >
            <SelectTrigger className={`${statusColor[game.status]}`}>
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
          {game.genres && (
            <div className="flex flex-wrap gap-2">
              {game.genres.map((genre) => (
                <Badge variant="secondary" key={genre}>
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <Badge variant="outline">{game.platform}</Badge>
        <Badge
          className={`${!game.rating ? "bg-accent" : Math.round(game.rating) < 60 ? "bg-red-500" : Math.round(game.rating) < 90 ? "bg-blue-500" : "bg-green-500"} mt-auto p-4`}
        >
          {!game.rating ? "N.A." : Math.round(game.rating)}
        </Badge>
        <Badge>{game.userRating ? game.userRating.toString() : "N.A."}</Badge>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={() => handleDelete(game.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
