"use client"

import * as z from "zod"
import { Game } from "@/lib/types"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { searchGame } from "@/app/actions"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Search cannot be empty.")
    .max(64, "Search must be at most 64 characters"),
})

type SearchBarProps = {
  onSearch: (games: Game[]) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const result = await searchGame(data)
    onSearch(result.results)
  }

  return (
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
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit">Search</Button>
    </form>
  )
}
