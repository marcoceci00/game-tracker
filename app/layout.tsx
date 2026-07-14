import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Toaster } from "@/components/ui/sonner"
import { Metadata } from "next"
import { isEditModeEnabled } from "@/lib/auth"
import { EditModeProvider } from "@/components/edit-mode-context"
import EditModeToggle from "@/components/edit-mode-toggle"
import ThemeToggle from "@/components/theme-toggle"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    template: "%s | Game Tracker",
    default: "Game Tracker",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const canEdit = await isEditModeEnabled()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <EditModeProvider canEdit={canEdit}>
          <ThemeProvider>
            <header className="flex items-center justify-between p-2 sm:grid sm:grid-cols-3 sm:gap-2">
              <div className="flex flex-row gap-2">
                <Gamepad2 className="text-accent-foreground" /> Game Tracker
              </div>
              <div className="flex justify-center">
                <Button variant="link" asChild>
                  <Link href="/">Home</Link>
                </Button>
                <Button variant="link" asChild>
                  <Link href="/search">Search</Link>
                </Button>
                <Button variant="link" asChild>
                  <Link href="/library">Library</Link>
                </Button>
              </div>
              <div className="flex justify-end gap-1">
                <ThemeToggle />
                <EditModeToggle />
              </div>
            </header>
            {children}
            <Toaster />
          </ThemeProvider>
        </EditModeProvider>
      </body>
    </html>
  )
}
