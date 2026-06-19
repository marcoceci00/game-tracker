"use client"

import { useState } from "react"
import { addGameIfNotExists } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function InsertButton({ game }: any) {
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
    }

    setLoading(false)
  }

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? "Loading..." : "Add to library"}
    </Button>
  )
}
