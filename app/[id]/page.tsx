import Image from "next/image"
import { readGame } from "../actions"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default async function GameDetails({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const game = await readGame(Number(id))
  if (!game) {
    notFound()
  }

  return (
    <div className="mx-auto w-3/4 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr]">
        <div>
          <Image
            className="h-auto w-full"
            src={
              game.cover
                ? `https://images.igdb.com/igdb/image/upload/t_1080p/${game.cover}.jpg`
                : "https://t4.ftcdn.net/jpg/06/57/37/01/360_F_657370150_pdNeG5pjI976ZasVbKN9VqH1rfoykdYU.jpg"
            }
            width={1080}
            height={1920}
            alt={`${game.name} image`}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{game.name}</h1>
          <div>
            Release date:{" "}
            {`${game.release_date ? new Date(game.release_date).toLocaleDateString("en-EN", { year: "numeric" }) : "N.A."}`}
          </div>
          {game.genres && (
            <div className="flex flex-wrap gap-2">
              {game.genres.map((genre) => (
                <Badge variant="secondary" key={genre}>
                  {genre}
                </Badge>
              ))}
            </div>
          )}
          <Badge
            className={`${!game.rating ? "bg-accent" : Math.round(game.rating) < 60 ? "bg-red-500" : Math.round(game.rating) < 90 ? "bg-blue-500" : "bg-green-500"} p-4`}
          >
            {!game.rating ? "N.A." : Math.round(game.rating)}
          </Badge>
        </div>
      </div>
    </div>
  )
}

// Ok, andiamo con un set in stile pagina-gioco IGDB: trama (summary), screenshot (screenshots.image_id), piattaforme di uscita (platforms.name) e sviluppatore/publisher (involved_companies.company.name).

// Passo concettuale: in app/actions.ts crea una nuova server action (es. getGameDetails) separata da searchGame — stessa autenticazione IGDB (Client-ID + Bearer token), stesso endpoint /games, ma il body della richiesta cambia: invece di search "...", usi where id = ID; per puntare esattamente al gioco che ti interessa, e nei fields elenchi quelli nuovi insieme a quelli che già usavi.

// Questa action va chiamata da app/[id]/page.tsx in parallelo a readGame(id) (sono due fonti diverse: Postgres per i dati personali, IGDB per i dati extra di "negozio").

// Provaci a scrivere la action in actions.ts prima, poi vediamo insieme.
