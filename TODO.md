Idee future (non urgenti, valutare quando servono davvero)

13. Aggiungere giochi non presenti su IGDB (es. Lumentale)
    Richiede prima di separare l'id proprio della riga (autoincrement) dall'id IGDB (colonna igdbId dedicata) — oggi coincidono e i giochi non-IGDB non avrebbero un igdbId. Da progettare come feature a sé, non solo come migrazione di schema.

14. Normalizzare i generi in una tabella dedicata
    Solo se la libreria cresce molto o serve un filtro per genere più sofisticato di un array di stringhe.

15. Paginazione libreria e ricerca
    Solo quando gli elementi diventano centinaia — a oggi non è un problema reale.

17. Multi-tenancy (modello User)
    Oggi il progetto è single-tenant: nessun modello User, nessuna colonna userId su Game. Va bene per un tracker personale con una sola password condivisa. Da valutare solo se l'obiettivo diventa un prodotto multi-utente reale — è una decisione di prodotto prima ancora che una migrazione di schema.
