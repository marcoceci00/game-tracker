import { cookies } from "next/headers"
import { createHash, timingSafeEqual } from "crypto"

export const EDIT_COOKIE_NAME = "edit-token"

export function editTokenFor(password: string) {
  return createHash("sha256").update(password).digest("hex")
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB)
}

export async function isEditModeEnabled() {
  const password = process.env.EDIT_PASSWORD
  if (!password) return false

  const token = (await cookies()).get(EDIT_COOKIE_NAME)?.value
  return !!token && safeEqual(token, editTokenFor(password))
}

export async function requireEditAccess() {
  if (!(await isEditModeEnabled())) {
    throw new Error("Editing is locked")
  }
}

export function verifyEditPassword(password: string) {
  const expected = process.env.EDIT_PASSWORD
  return !!expected && safeEqual(password, expected)
}
