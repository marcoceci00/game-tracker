# Game Tracker

App web per tenere traccia dei videogiochi: wishlist, backlog, in gioco, completati e altro.

## Stack tecnologico

- **[Next.js 16](https://nextjs.org/)** — framework React (App Router, Server Actions)
- **[React 19](https://react.dev/)** — libreria UI
- **[TypeScript](https://www.typescriptlang.org/)** — tipizzazione statica
- **[Tailwind CSS v4](https://tailwindcss.com/)** — utility CSS
- **[shadcn/ui](https://ui.shadcn.com/)** + **[Radix UI](https://www.radix-ui.com/)** — componenti UI accessibili
- **[Prisma](https://www.prisma.io/)** — ORM per PostgreSQL
- **[Sonner](https://sonner.emilkowal.ski/)** — toast notifications
- **[Embla Carousel](https://www.embla-carousel.com/)** — carousel screenshot
- **[React Hook Form](https://react-hook-form.com/)** — gestione form
- **[Lucide React](https://lucide.dev/)** — icone
- **[next-themes](https://github.com/pacocoursey/next-themes)** — dark/light mode
- **[IGDB API](https://api-docs.igdb.com/)** — dati sui videogiochi (ricerca, cover, metadati)

## Prerequisiti

- Node.js 20+
- Un database PostgreSQL (es. [Prisma Postgres](https://www.prisma.io/postgres))
- Credenziali IGDB ([registrazione gratuita su Twitch Developer](https://dev.twitch.tv/))

## Setup in locale

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Configura le variabili d'ambiente

Crea un file `.env` nella root del progetto:

```env
DATABASE_URL="postgresql://..."

IGDB_CLIENT_ID="..."
IGDB_API_KEY="..."
IGDB_TOKEN="..."
```

- `DATABASE_URL` — connection string PostgreSQL
- `IGDB_CLIENT_ID` / `IGDB_API_KEY` / `IGDB_TOKEN` — credenziali API IGDB per la ricerca giochi

### 3. Inizializza il database

```bash
npx prisma migrate deploy
```

### 4. Avvia il server

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Comandi disponibili

| Comando              | Descrizione                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Avvia il server di sviluppo              |
| `npm run build`      | Crea la build di produzione              |
| `npm run start`      | Avvia la build di produzione             |
| `npm run lint`       | Controlla il codice con ESLint           |
| `npm run format`     | Formatta il codice con Prettier          |
| `npm run typecheck`  | Controlla i tipi TypeScript              |

## Database

Schema definito in `prisma/schema.prisma`. Modello principale: `Game` con campi per stato, piattaforma, rating utente, note, cover e metadati IGDB.

Stati disponibili: `WISHLIST`, `BACKLOG`, `PLAYING`, `SHELVED`, `COMPLETED`, `DROPPED`.

Piattaforme: `PC`, `PLAYSTATION_5`, `NINTENDO_SWITCH_2`.

```bash
# Genera il client Prisma dopo modifiche allo schema
npx prisma generate

# Crea e applica una nuova migrazione
npx prisma migrate dev --name nome-migrazione
```

## Aggiungere componenti shadcn/ui

```bash
npx shadcn@latest add <nome-componente>
```

I componenti vengono aggiunti in `components/ui/`.
