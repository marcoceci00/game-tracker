"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Lock, Unlock } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { unlockEditing, lockEditing } from "@/app/actions"
import { useEditMode } from "@/components/edit-mode-context"

export default function EditModeToggle() {
  const canEdit = useEditMode()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleUnlock() {
    startTransition(async () => {
      const ok = await unlockEditing(password)
      setPassword("")

      if (ok) {
        toast.success("Editing unlocked")
        setOpen(false)
        router.refresh()
      } else {
        toast.error("Wrong password")
      }
    })
  }

  function handleLock() {
    startTransition(async () => {
      await lockEditing()
      router.refresh()
    })
  }

  if (canEdit) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLock}
        disabled={isPending}
        title="Lock editing"
      >
        <Unlock className="text-green-500" />
      </Button>
    )
  }

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        title="Unlock editing"
      >
        <Lock />
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
        placeholder="Password"
        className="h-8 w-32"
        autoFocus
      />
      <Button size="sm" onClick={handleUnlock} disabled={isPending}>
        Go
      </Button>
    </div>
  )
}
