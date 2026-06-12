# Game Tracker

Un'app web per tenere traccia dei videogiochi: quelli che vuoi giocare, quelli che stai giocando e quelli che hai già completato.

## Stack tecnologico

- **[Next.js 16](https://nextjs.org/)** — framework React per applicazioni web
- **[React 19](https://react.dev/)** — libreria per costruire interfacce utente
- **[TypeScript](https://www.typescriptlang.org/)** — JavaScript con tipizzazione statica
- **[Tailwind CSS v4](https://tailwindcss.com/)** — utility CSS per lo stile
- **[shadcn/ui](https://ui.shadcn.com/)** — componenti UI pronti all'uso
- **[Radix UI](https://www.radix-ui.com/)** — componenti accessibili di base
- **[Lucide React](https://lucide.dev/)** — icone
- **[next-themes](https://github.com/pacocoursey/next-themes)** — supporto dark/light mode

## Avvio in locale

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## Comandi disponibili

| Comando          | Descrizione                              |
| ---------------- | ---------------------------------------- |
| `npm run dev`    | Avvia il server di sviluppo              |
| `npm run build`  | Crea la build di produzione              |
| `npm run start`  | Avvia la build di produzione             |
| `npm run lint`   | Controlla il codice con ESLint           |
| `npm run format` | Formatta il codice con Prettier          |

## Aggiungere componenti shadcn/ui

```bash
npx shadcn@latest add <nome-componente>

# Esempio
npx shadcn@latest add card
```

I componenti vengono aggiunti nella cartella `components/ui/`.
