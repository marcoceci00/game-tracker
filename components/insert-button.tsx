"use client"

import { addGameIfNotExists } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { IgdbGame } from "@/lib/types"
import { useEditMode } from "@/components/edit-mode-context"
import { useAction } from "@/hooks/use-action"

export default function InsertButton({ game }: { game: IgdbGame }) {
  const canEdit = useEditMode()
  const { run, pending } = useAction()

  function handleClick() {
    run(async () => {
      const result = await addGameIfNotExists(game)

      if (result) {
        toast.success("Game has been added")
      } else {
        toast.error("Game is already in library")
      }
    })
  }

  return (
    <Button onClick={handleClick} disabled={pending || !canEdit}>
      {!canEdit
        ? "Editing is locked"
        : pending
          ? "Loading..."
          : "Add to library"}
    </Button>
  )
}
