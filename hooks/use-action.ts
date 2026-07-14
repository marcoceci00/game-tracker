"use client"

import { useState } from "react"
import { toast } from "sonner"

export function useAction() {
  const [pending, setPending] = useState(false)

  async function run(action: () => Promise<void>) {
    setPending(true)
    try {
      await action()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setPending(false)
    }
  }

  return { run, pending }
}
