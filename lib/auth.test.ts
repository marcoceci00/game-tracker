import { beforeEach, describe, expect, it } from "vitest"
import { verifyEditPassword } from "./auth"

beforeEach(() => {
  process.env.EDIT_PASSWORD = "test-password"
})

describe("auth operations", () => {
  it("should be true", () => {
    expect(verifyEditPassword("test-password")).toBe(true)
  })
  it("should be false", () => {
    expect(verifyEditPassword("password-sbagliata")).toBe(false)
  })
  it("should be false", () => {
    expect(verifyEditPassword("")).toBe(false)
  })
})
