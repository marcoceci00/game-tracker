"use client"

import { useState } from "react"
import { addGameIfNotExists } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { IgdbGame } from "@/lib/types"
import { useEditMode } from "@/components/edit-mode-context"

export default function InsertButton({ game }: { game: IgdbGame }) {
  const canEdit = useEditMode()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)

    try {
      const result = await addGameIfNotExists(game)

      if (result) {
        toast.success("Game has been added")
      } else {
        toast.error("Game is already in library")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading || !canEdit}>
      {!canEdit
        ? "Editing is locked"
        : loading
          ? "Loading..."
          : "Add to library"}
    </Button>
  )
}
