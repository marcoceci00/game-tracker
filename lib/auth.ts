import { cookies, headers } from "next/headers"
import { createHmac, randomBytes, timingSafeEqual } from "crypto"

export const EDIT_COOKIE_NAME = "edit-token"
export const MAX_ATTEMPTS = 5
export const ATTEMPTS_WINDOW_MS = 5 * 60 * 1000
export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

export function createSessionToken() {
  const expiresAt = Date.now() + SESSION_MAX_AGE_MS
  const nonce = randomBytes(16).toString("hex")
  const payload = `${expiresAt}.${nonce}`
  return `${payload}.${sign(payload)}`
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
  if (!token) return false

  const [expiresAt, nonce, signature] = token.split(".")
  if (!expiresAt || !nonce || !signature) return false

  const notExpired = Number(expiresAt) > Date.now()

  const expectedSignature = sign(`${expiresAt}.${nonce}`)
  const signatureValid = safeEqual(signature, expectedSignature)

  return notExpired && signatureValid
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

// ponytail: Map in memoria, per-processo. Va bene per una sola istanza;
// se l'app girasse su piu' istanze servirebbe uno store condiviso (es. Redis).
const attemptsByIp = new Map<string, { count: number; firstAt: number }>()

async function getClientIp() {
  const h = await headers()
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  )
}

export async function tooManyAttempts() {
  const entry = attemptsByIp.get(await getClientIp())
  if (!entry) return false

  const windowExpired = Date.now() - entry.firstAt > ATTEMPTS_WINDOW_MS
  if (windowExpired) return false

  return entry.count >= MAX_ATTEMPTS
}

export async function recordFailedAttempt() {
  const ip = await getClientIp()
  const previous = attemptsByIp.get(ip)

  const windowExpired =
    !previous || Date.now() - previous.firstAt > ATTEMPTS_WINDOW_MS

  attemptsByIp.set(
    ip,
    windowExpired
      ? { count: 1, firstAt: Date.now() }
      : { count: previous.count + 1, firstAt: previous.firstAt }
  )
}

export async function clearAttempts() {
  attemptsByIp.delete(await getClientIp())
}

function sign(value: string) {
  const secret = process.env.EDIT_PASSWORD ?? ""
  return createHmac("sha256", secret).update(value).digest("hex")
}
