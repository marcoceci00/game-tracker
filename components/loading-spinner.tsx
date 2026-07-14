import { LoaderCircle } from "lucide-react"

export default function LoadingSpinner() {
  return (
    <div className="mx-auto flex w-full max-w-5xl items-center justify-center px-4 py-24">
      <LoaderCircle className="animate-spin text-muted-foreground" size={32} />
    </div>
  )
}
