"use client"

import * as z from "zod"
import { IgdbGame } from "@/lib/types"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { searchGame } from "@/app/actions"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoaderCircle } from "lucide-react"

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Search cannot be empty.")
    .max(64, "Search must be at most 64 characters"),
})

type SearchBarProps = {
  onSearch: (games: IgdbGame[]) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true)
    setError("")
    const result = await searchGame(data)
    if (result) {
      onSearch(result)
    } else {
      setError("Error during search")
    }
    setLoading(false)
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Search..."
                autoComplete="off"
                disabled={loading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" disabled={loading}>
          {!loading ? (
            "Search"
          ) : (
            <>
              <LoaderCircle className="animate-spin" />
              Loading
            </>
          )}
        </Button>
      </form>
      <div className="text-red-500">{error}</div>
    </>
  )
}
