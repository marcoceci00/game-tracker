"use client"

import { useState } from "react"
import { IgdbGame } from "@/lib/types"
import SearchBar from "./search-bar"
import ResultsGrid from "./results-grid"

export default function SearchContainer() {
  const [result, setResult] = useState<IgdbGame[]>([])

  return (
    <>
      <SearchBar onSearch={setResult} />
      <ResultsGrid games={result} />
    </>
  )
}
