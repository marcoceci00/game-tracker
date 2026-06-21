Bug reali

1. Status e Platform nel LibraryCard sono visivamente "stale"
   library-card.tsx:131 e riga 165 — i Select usano game.status e game.platform (prop) come value, non uno state locale. Quando l'utente cambia, il Select torna al vecchio valore finché il server non fa revalidate. L'utente vede un "flash" di rollback. Fix: aggiungere useState per entrambi come hai già fatto per ratingValue.

2. updateNotes chiamato senza try/catch
   library-card.tsx:198 — onBlur={() => updateNotes(game.id, notesValue)} non gestisce errori, a differenza di tutti gli altri handler. Se la chiamata fallisce, l'utente non lo sa.

3. SORT_FN[sort] non è type-safe
   library-content.tsx:56 — se sort fosse un valore non in SORT_FN, .sort(undefined) non crasha ma è un buco silenzioso. Potresti tipizzare sort come keyof typeof SORT_FN.

Qualità del codice 4. Logica colore rating duplicata 3 volte
In game-card.tsx:46, library-card.tsx:179, e [id]/page.tsx:101 c'è lo stesso ternary annidato. Va estratto come funzione in lib/utils.ts.

5. getGameDetails restituisce any
   actions.ts:13 — il tipo IgdbGameDetails esiste già in lib/types.ts ma non è usato come return type. Il componente poi fa cast manuali con annotazioni inline ovunque.

6. section prop non viene mai passato
   library-card.tsx:58 accetta section?: string per il ViewTransition name, ma library-content.tsx:114 non lo passa mai. section è sempre undefined.

7. Commento TODO lasciato in produzione
   library-content.tsx:131-136 — un blocco di commento con istruzioni di sviluppo rimasto nel codice.

8. Immagine fallback come URL esterno hardcoded
   Stessa URL t4.ftcdn.net ripetuta in 3 file. Se quel CDN cambia, tutte le cover mancanti si rompono. Meglio un file in /public.

UX 9. Nessun feedback visivo sul save delle note
Tutti gli altri cambiamenti mostrano un toast. Le note salvano in silenzio (o falliscono in silenzio, vedi punto 2).

10. Nessun contatore di risultati nella search
    L'utente cerca, ottiene una griglia, non sa quanti risultati ci sono. Un semplice "X games found" sopra la griglia aiuta.

11. Titolo card come stringa concatenata
    library-card.tsx:123 e game-card.tsx:30 — ${name} (${year}) come unica stringa. Meglio separare tipograficamente, es. titolo bold + anno in text-muted-foreground.

12. loading="eager" sugli screenshot
    [id]/page.tsx:178](app/[id]/page.tsx#L178) — gli screenshot sono sotto la fold nel carousel, dovrebbero essere lazy.

I punti più impattanti da fare subito: 1 (bug visibile), 2 (errori silenziosi), 4 (refactor piccolo ma pulisce tre file). Quale vuoi esplorare?
