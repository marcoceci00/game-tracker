"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { igdbImageUrl } from "@/lib/utils"

type Screenshot = { id: number; image_id: string }

export default function ScreenshotGallery({
  screenshots,
  gameName,
}: {
  screenshots: Screenshot[]
  gameName: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const showPrev = useCallback(() => {
    setOpenIndex((i) =>
      i === null ? i : (i - 1 + screenshots.length) % screenshots.length
    )
  }, [screenshots.length])

  const showNext = useCallback(() => {
    setOpenIndex((i) => (i === null ? i : (i + 1) % screenshots.length))
  }, [screenshots.length])

  useEffect(() => {
    if (openIndex === null) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") showPrev()
      if (e.key === "ArrowRight") showNext()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [openIndex, showPrev, showNext])

  const current = openIndex !== null ? screenshots[openIndex] : null

  return (
    <>
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {screenshots.map((s, index) => (
            <CarouselItem
              key={s.id}
              className="basis-full sm:basis-1/2 md:basis-1/3"
            >
              <button
                onClick={() => setOpenIndex(index)}
                className="relative block aspect-video w-full cursor-zoom-in overflow-hidden rounded-lg"
              >
                <Image
                  src={igdbImageUrl(s.image_id, "t_1080p")}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  alt={`${gameName} screenshot`}
                  className="rounded-lg object-cover transition-transform hover:scale-105"
                  loading="lazy"
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <Dialog
        open={openIndex !== null}
        onOpenChange={(open) => !open && setOpenIndex(null)}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogTitle className="sr-only">{gameName} screenshot</DialogTitle>
          <DialogDescription className="sr-only">
            Enlarged screenshot
          </DialogDescription>
          {current && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={igdbImageUrl(current.image_id, "t_1080p")}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                alt={`${gameName} screenshot`}
                className="object-contain"
              />
              {screenshots.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-background/70 hover:bg-background/90"
                    title="Previous screenshot"
                    onClick={showPrev}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-background/70 hover:bg-background/90"
                    title="Next screenshot"
                    onClick={showNext}
                  >
                    <ChevronRight />
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
