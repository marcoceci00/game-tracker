import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
        <header className="grid grid-cols-3 items-center p-2">
          <div className="flex flex-row gap-2">
            <Gamepad2 className="text-accent-foreground" /> Game Tracker
          </div>
          <div className="flex justify-center">
            <Button variant="link" asChild>
              <Link href="/">Homepage</Link>
            </Button>
            <Button variant="link" asChild>
              <Link href="/library">Library</Link>
            </Button>
          </div>
          <div />
        </header>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
