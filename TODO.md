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

Idee future (non urgenti, valutare quando servono davvero)

13. Aggiungere giochi non presenti su IGDB (es. Lumentale)
    Richiede prima di separare l'id proprio della riga (autoincrement) dall'id IGDB (colonna igdbId dedicata) — oggi coincidono e i giochi non-IGDB non avrebbero un igdbId. Da progettare come feature a sé, non solo come migrazione di schema.

14. Normalizzare i generi in una tabella dedicata
    Solo se la libreria cresce molto o serve un filtro per genere più sofisticato di un array di stringhe.

15. Paginazione libreria e ricerca
    Solo quando gli elementi diventano centinaia — a oggi non è un problema reale.

16. react-hooks/set-state-in-effect in components/ui/carousel.tsx:98
    File generato da shadcn/ui, non toccato finora. Chiama setState sincrono dentro un useEffect — lint lo segnala ma il componente funziona. Da sistemare quando si tocca di nuovo quel file.
