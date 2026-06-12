"use client"

import { useState } from "react"
import { Game } from "@/lib/types"
import SearchBar from "./search-bar"
import ResultsGrid from "./results-grid"

export default function SearchContainer() {
  const [result, setResult] = useState<Game[]>([])

  return (
    <>
      <SearchBar onSearch={setResult} />
      <ResultsGrid games={result} />
    </>
  )
}
