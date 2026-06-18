import Image from "next/image"
import { readGame, getGameDetails } from "@/app/actions"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default async function GameDetails({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [game, gameDetails] = await Promise.all([
    readGame(Number(id)),
    getGameDetails(Number(id)),
  ])
  const details = gameDetails[0]

  if (!game && !details) {
    notFound()
  }

  const display = {
    name: game?.name ?? details?.name,
    cover: game?.cover ?? details?.cover?.image_id,
    release_date:
      game?.release_date ??
      (details?.first_release_date
        ? new Date(details.first_release_date * 1000)
        : null),
    rating:
      game?.rating ??
      (details?.aggregated_rating
        ? Math.round(details.aggregated_rating)
        : null),
    genres: game?.genres ?? details?.genres?.map((g) => g.name),
  }

  return (
    <div className="mx-auto w-3/4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
        <Image
          className="h-auto w-full rounded-lg"
          src={
            display.cover
              ? `https://images.igdb.com/igdb/image/upload/t_1080p/${display.cover}.jpg`
              : "https://t4.ftcdn.net/jpg/06/57/37/01/360_F_657370150_pdNeG5pjI976ZasVbKN9VqH1rfoykdYU.jpg"
          }
          width={1080}
          height={1920}
          alt={`${display.name} image`}
        />
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">{display.name}</h1>
            <p className="mt-1 text-muted-foreground">
              {display.release_date
                ? display.release_date.toLocaleDateString("en", {
                    year: "numeric",
                  })
                : "N.A."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-md px-3 py-1 text-sm font-semibold text-white ${
                !display.rating
                  ? "bg-accent"
                  : display.rating < 60
                    ? "bg-red-500"
                    : display.rating < 90
                      ? "bg-blue-500"
                      : "bg-green-500"
              }`}
            >
              {!display.rating ? "N.A." : display.rating}
            </span>
            {display.genres && (
              <div className="flex flex-wrap gap-2">
                {display.genres.map((genre) => (
                  <Badge variant="secondary" key={genre}>
                    {genre}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {details?.summary && (
            <div>
              <h2 className="mb-1 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Summary
              </h2>
              <p className="text-sm leading-relaxed">{details.summary}</p>
            </div>
          )}

          {details?.platforms && details.platforms.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Platforms
              </h2>
              <div className="flex flex-wrap gap-2">
                {details.platforms.map((p) => (
                  <Badge key={p.id}>{p.name}</Badge>
                ))}
              </div>
            </div>
          )}

          {details?.involved_companies &&
            details.involved_companies.length > 0 && (
              <div>
                <h2 className="mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  Developers
                </h2>
                <div className="flex flex-wrap gap-2">
                  {details.involved_companies.map((c) => (
                    <Badge key={c.id} variant="outline">
                      {c.company.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {details?.screenshots && details.screenshots.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Screenshots
          </h2>
          <div>
            <Carousel opts={{ loop: true }}>
              <CarouselContent>
                {details.screenshots.map((s) => (
                  <CarouselItem key={s.id} className="basis-1/3">
                    <div className="relative aspect-video">
                      <Image
                        src={`https://images.igdb.com/igdb/image/upload/t_1080p/${s.image_id}.jpg`}
                        fill
                        alt="screenshot"
                        className="rounded-lg object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      )}
    </div>
  )
}
