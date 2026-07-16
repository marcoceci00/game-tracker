"use client"

import { useState } from "react"
import { addGameIfNotExists } from "@/app/actions"
import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { IgdbGame } from "@/lib/types"
import { Platform } from "@/lib/generated/prisma/enums"
import { PLATFORM_LABELS } from "@/lib/status"
import { useEditMode } from "@/components/edit-mode-context"
import { useAction } from "@/hooks/use-action"

export default function InsertButton({ game }: { game: IgdbGame }) {
  const canEdit = useEditMode()
  const { run, pending } = useAction()
  const [open, setOpen] = useState(false)
  const [platform, setPlatform] = useState<Platform>(Platform.PC)

  function handleConfirm() {
    run(async () => {
      const result = await addGameIfNotExists(game, platform)

      if (result) {
        toast.success("Game has been added")
        setOpen(false)
      } else {
        toast.error("Game is already in library")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!canEdit}>
          {!canEdit ? "Editing is locked" : "Add to library"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose a platform</DialogTitle>
          <DialogDescription>
            Select which platform you plan to play this on.
          </DialogDescription>
        </DialogHeader>
        <Select
          value={platform}
          onValueChange={(value) => setPlatform(value as Platform)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.values(Platform).map((value) => (
                <SelectItem key={value} value={value}>
                  {PLATFORM_LABELS[value]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={pending}>
            {pending ? "Loading..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
