"use client"

import { useState } from "react"
import { IgdbGame } from "@/lib/types"
import SearchBar from "./search-bar"
import ResultsGrid from "./results-grid"

export default function SearchContainer() {
  const [hasSearched, setHasSearched] = useState(false)
  const [result, setResult] = useState<IgdbGame[]>([])

  function handleSearch(games: IgdbGame[]) {
    setHasSearched(true)
    setResult(games)
  }

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <ResultsGrid hasSearched={hasSearched} games={result} />
    </>
  )
}
