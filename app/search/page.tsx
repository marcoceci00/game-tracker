import SearchContainer from "@/components/search-container"
import { Metadata } from "next"

export const metadata: Metadata = { title: "Search" }

export default function Search() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Search</h1>
      <SearchContainer />
    </div>
  )
}
