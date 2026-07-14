Bug reali

3. SORT_FN[sort] non è type-safe
   library-content.tsx:56 — se sort fosse un valore non in SORT_FN, .sort(undefined) non crasha ma è un buco silenzioso. Potresti tipizzare sort come keyof typeof SORT_FN.

Qualità del codice

5. getGameDetails restituisce any
   actions.ts:13 — il tipo IgdbGameDetails esiste già in lib/types.ts ma non è usato come return type. Il componente poi fa cast manuali con annotazioni inline ovunque.

6. section prop non viene mai passato
   library-card.tsx:58 accetta section?: string per il ViewTransition name, ma library-content.tsx:114 non lo passa mai. section è sempre undefined.

UX

10. Nessun contatore di risultati nella search
    L'utente cerca, ottiene una griglia, non sa quanti risultati ci sono. Un semplice "X games found" sopra la griglia aiuta.

11. Titolo card come stringa concatenata
    library-card.tsx:123 e game-card.tsx:30 — ${name} (${year}) come unica stringa. Meglio separare tipograficamente, es. titolo bold + anno in text-muted-foreground.

12. loading="eager" sugli screenshot
    [id]/page.tsx:178](app/[id]/page.tsx#L178) — gli screenshot sono sotto la fold nel carousel, dovrebbero essere lazy.
