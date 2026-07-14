import { describe, it, expect } from "vitest"
import { ratingColor } from "./utils"

describe("color operations", () => {
  it("should be bg-accent", () => {
    expect(ratingColor(null)).toBe("bg-accent")
  })
  it("should be bg-accent", () => {
    expect(ratingColor(undefined)).toBe("bg-accent")
  })
  it("should be bg-red-500", () => {
    expect(ratingColor(50)).toBe("bg-red-500")
  })
  it("should be bg-blue-500", () => {
    expect(ratingColor(75)).toBe("bg-blue-500")
  })
  it("should be bg-green-500", () => {
    expect(ratingColor(95)).toBe("bg-green-500")
  })
  it("should be bg-blue-500", () => {
    expect(ratingColor(59.6)).toBe("bg-blue-500")
  })
})
