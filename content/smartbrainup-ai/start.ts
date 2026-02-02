// content/smartbrainup-ai/start.ts

export interface AdaptiveOption {
  label: string
  value: string
  nextId: string | null  // null = fine assessment
}

export interface AdaptiveQuestion {
  id: string
  strato: string
  question: string
  collectAs: string
  options: AdaptiveOption[]
}

export interface CollectedData {
  [key: string]: string
}

// Mappa di tutte le domande
export const questionsMap: Record<string, AdaptiveQuestion> = {
  
  // ============================================
  // STRATO 1 — IDENTITÀ & DIREZIONE
  // ============================================
  
  'identity': {
    id: 'identity',
    strato: 'STRATO 1 — IDENTITÀ & DIREZIONE',
    question: 'In una frase: oggi, chi sei operativamente?',
    collectAs: 'identity',
    options: [
      { label: 'Professionista', value: 'professionista', nextId: 'clienti_tipo' },
      { label: 'Azienda', value: 'azienda', nextId: 'team_size' },
    ],
  },
  
  // Figlie di identity
  'clienti_tipo': {
    id: 'clienti_tipo',
    strato: 'STRATO 1 — IDENTITÀ & DIREZIONE',
    question: 'Che tipo di clienti segui?',
    collectAs: 'clienti_tipo',
    options: [
      { label: 'Diretti', value: 'diretti', nextId: 'goal' },
      { label: 'Intermediati', value: 'intermediati', nextId: 'goal' },
      { label: 'Entrambi', value: 'entrambi', nextId: 'goal' },
    ],
  },
  
  'team_size': {
    id: 'team_size',
    strato: 'STRATO 1 — IDENTITÀ & DIREZIONE',
    question: 'Quanti siete e in che area lavori tu?',
    collectAs: 'team_size',
    options: [
      { label: '1-5 persone', value: '1-5', nextId: 'goal' },
      { label: '6-20 persone', value: '6-20', nextId: 'goal' },
      { label: '20+ persone', value: '20+', nextId: 'goal' },
    ],
  },
  
  'goal': {
    id: 'goal',
    strato: 'STRATO 1 — IDENTITÀ & DIREZIONE',
    question: 'Cosa vuoi che l\'AI ti aiuti a ottenere prima di tutto?',
    collectAs: 'goal',
    options: [
      { label: 'Tempo', value: 'tempo', nextId: 'tempo_perso' },
      { label: 'Risultati', value: 'risultati', nextId: 'risultati_30g' },
    ],
  },
  
  // Figlie di goal
  'tempo_perso': {
    id: 'tempo_perso',
    strato: 'STRATO 1 — IDENTITÀ & DIREZIONE',
    question: 'In cosa lo perdi di più?',
    collectAs: 'tempo_perso',
    options: [
      { label: 'Email e comunicazioni', value: 'email', nextId: 'feeling' },
      { label: 'Ricerca informazioni', value: 'ricerca', nextId: 'feeling' },
      { label: 'Task ripetitivi', value: 'task_ripetitivi', nextId: 'feeling' },
      { label: 'Decisioni operative', value: 'decisioni', nextId: 'feeling' },
    ],
  },
  
  'risultati_30g': {
    id: 'risultati_30g',
    strato: 'STRATO 1 — IDENTITÀ & DIREZIONE',
    question: 'Quali risultati misureresti tra 30 giorni?',
    collectAs: 'risultati_30g',
    options: [
      { label: 'Più clienti', value: 'clienti', nextId: 'feeling' },
      { label: 'Più fatturato', value: 'fatturato', nextId: 'feeling' },
      { label: 'Più efficienza', value: 'efficienza', nextId: 'feeling' },
      { label: 'Più chiarezza', value: 'chiarezza', nextId: 'feeling' },
    ],
  },
  
  'feeling': {
    id: 'feeling',
    strato: 'STRATO 1 — IDENTITÀ & DIREZIONE',
    question: 'In questo momento ti senti più:',
    collectAs: 'feeling',
    options: [
      { label: 'Sovraccarico', value: 'sovraccarico', nextId: 'sovraccarico_da' },
      { label: 'Bloccato', value: 'bloccato', nextId: 'bloccato_su' },
    ],
  },
  
  // Figlie di feeling
  'sovraccarico_da': {
    id: 'sovraccarico_da',
    strato: 'STRATO 1 — IDENTITÀ & DIREZIONE',
    question: 'Da cosa?',
    collectAs: 'sovraccarico_da',
    options: [
      { label: 'Troppe cose da fare', value: 'troppe_cose', nextId: 'lavoro_quotidiano' },
      { label: 'Troppe decisioni', value: 'troppe_decisioni', nextId: 'lavoro_quotidiano' },
      { label: 'Troppe interruzioni', value: 'troppe_interruzioni', nextId: 'lavoro_quotidiano' },
    ],
  },
  
  'bloccato_su': {
    id: 'bloccato_su',
    strato: 'STRATO 1 — IDENTITÀ & DIREZIONE',
    question: 'Su quale decisione?',
    collectAs: 'bloccato_su',
    options: [
      { label: 'Strategica', value: 'strategica', nextId: 'lavoro_quotidiano' },
      { label: 'Operativa', value: 'operativa', nextId: 'lavoro_quotidiano' },
      { label: 'Personale', value: 'personale', nextId: 'lavoro_quotidiano' },
    ],
  },
  
  // ============================================
  // STRATO 2 — CONTESTO REALE
  // ============================================
  
  'lavoro_quotidiano': {
    id: 'lavoro_quotidiano',
    strato: 'STRATO 2 — CONTESTO REALE',
    question: 'Su cosa lavori ogni giorno?',
    collectAs: 'lavoro_quotidiano',
    options: [
      { label: 'Documenti', value: 'documenti', nextId: 'formati_doc' },
      { label: 'Clienti', value: 'clienti', nextId: 'clienti_diretti' },
      { label: 'Idee e progetti', value: 'idee', nextId: 'uso_ai' },
      { label: 'Numeri e dati', value: 'numeri', nextId: 'uso_ai' },
    ],
  },
  
  'formati_doc': {
    id: 'formati_doc',
    strato: 'STRATO 2 — CONTESTO REALE',
    question: 'Quali formati?',
    collectAs: 'formati_doc',
    options: [
      { label: 'Testi e report', value: 'testi', nextId: 'uso_ai' },
      { label: 'Fogli di calcolo', value: 'fogli', nextId: 'uso_ai' },
      { label: 'Presentazioni', value: 'presentazioni', nextId: 'uso_ai' },
      { label: 'Mix di tutto', value: 'mix', nextId: 'uso_ai' },
    ],
  },
  
  'clienti_diretti': {
    id: 'clienti_diretti',
    strato: 'STRATO 2 — CONTESTO REALE',
    question: 'Diretti o intermediati?',
    collectAs: 'clienti_diretti',
    options: [
      { label: 'Diretti', value: 'diretti', nextId: 'uso_ai' },
      { label: 'Intermediati', value: 'intermediati', nextId: 'uso_ai' },
      { label: 'Entrambi', value: 'entrambi', nextId: 'uso_ai' },
    ],
  },
  
  'uso_ai': {
    id: 'uso_ai',
    strato: 'STRATO 2 — CONTESTO REALE',
    question: 'Dove userai l\'AI più spesso?',
    collectAs: 'uso_ai',
    options: [
      { label: 'PC', value: 'pc', nextId: 'pc_contesto' },
      { label: 'Mobile', value: 'mobile', nextId: 'mobile_contesto' },
      { label: 'Entrambi', value: 'entrambi', nextId: 'scadenza' },
    ],
  },
  
  'pc_contesto': {
    id: 'pc_contesto',
    strato: 'STRATO 2 — CONTESTO REALE',
    question: 'Solo o con altri strumenti aperti?',
    collectAs: 'pc_contesto',
    options: [
      { label: 'Solo, focus totale', value: 'solo', nextId: 'scadenza' },
      { label: 'Con altri strumenti', value: 'multi', nextId: 'scadenza' },
    ],
  },
  
  'mobile_contesto': {
    id: 'mobile_contesto',
    strato: 'STRATO 2 — CONTESTO REALE',
    question: 'In movimento o in momenti fissi?',
    collectAs: 'mobile_contesto',
    options: [
      { label: 'In movimento', value: 'movimento', nextId: 'scadenza' },
      { label: 'Momenti fissi', value: 'fissi', nextId: 'scadenza' },
    ],
  },
  
  'scadenza': {
    id: 'scadenza',
    strato: 'STRATO 2 — CONTESTO REALE',
    question: 'Qual è la tua scadenza mentale più vicina?',
    collectAs: 'scadenza',
    options: [
      { label: 'Entro 7 giorni', value: '7giorni', nextId: 'scadenza_7g' },
      { label: 'Senza scadenza urgente', value: 'nessuna', nextId: 'rimandato' },
    ],
  },
  
  'scadenza_7g': {
    id: 'scadenza_7g',
    strato: 'STRATO 2 — CONTESTO REALE',
    question: 'Cosa deve essere pronto?',
    collectAs: 'scadenza_7g',
    options: [
      { label: 'Un documento', value: 'documento', nextId: 'vincoli_no' },
      { label: 'Una decisione', value: 'decisione', nextId: 'vincoli_no' },
      { label: 'Una consegna', value: 'consegna', nextId: 'vincoli_no' },
    ],
  },
  
  'rimandato': {
    id: 'rimandato',
    strato: 'STRATO 2 — CONTESTO REALE',
    question: 'Cosa stai rimandando?',
    collectAs: 'rimandato',
    options: [
      { label: 'Un progetto importante', value: 'progetto', nextId: 'vincoli_no' },
      { label: 'Una riorganizzazione', value: 'riorganizzazione', nextId: 'vincoli_no' },
      { label: 'Niente di specifico', value: 'niente', nextId: 'vincoli_no' },
    ],
  },
  
  // ============================================
  // STRATO 3 — VINCOLI
  // ============================================
  
  'vincoli_no': {
    id: 'vincoli_no',
    strato: 'STRATO 3 — VINCOLI',
    question: 'Cosa NON deve fare l\'AI per te?',
    collectAs: 'vincoli_no',
    options: [
      { label: 'Toccare dati sensibili', value: 'privacy', nextId: 'privacy_limiti' },
      { label: 'Scrivere in modo artificiale', value: 'stile', nextId: 'stile_fastidio' },
      { label: 'Nessun vincolo particolare', value: 'nessuno', nextId: 'tempo_ai' },
    ],
  },
  
  'privacy_limiti': {
    id: 'privacy_limiti',
    strato: 'STRATO 3 — VINCOLI',
    question: 'Quali dati sono off-limits?',
    collectAs: 'privacy_limiti',
    options: [
      { label: 'Dati clienti', value: 'clienti', nextId: 'tempo_ai' },
      { label: 'Dati finanziari', value: 'finanziari', nextId: 'tempo_ai' },
      { label: 'Dati personali', value: 'personali', nextId: 'tempo_ai' },
    ],
  },
  
  'stile_fastidio': {
    id: 'stile_fastidio',
    strato: 'STRATO 3 — VINCOLI',
    question: 'Cosa ti infastidisce nelle risposte AI?',
    collectAs: 'stile_fastidio',
    options: [
      { label: 'Troppo lunghe', value: 'lunghe', nextId: 'tempo_ai' },
      { label: 'Troppo generiche', value: 'generiche', nextId: 'tempo_ai' },
      { label: 'Tono artificiale', value: 'artificiale', nextId: 'tempo_ai' },
    ],
  },
  
  'tempo_ai': {
    id: 'tempo_ai',
    strato: 'STRATO 3 — VINCOLI',
    question: 'Quanto tempo puoi dedicarle ogni giorno?',
    collectAs: 'tempo_ai',
    options: [
      { label: 'Meno di 10 minuti', value: 'sotto10', nextId: 'micro_azioni' },
      { label: '10-30 minuti', value: '10-30', nextId: 'ai_modo' },
      { label: 'Più di 30 minuti', value: 'sopra30', nextId: 'analisi_produzione' },
    ],
  },
  
  'micro_azioni': {
    id: 'micro_azioni',
    strato: 'STRATO 3 — VINCOLI',
    question: 'Solo micro-azioni o decisioni?',
    collectAs: 'micro_azioni',
    options: [
      { label: 'Micro-azioni', value: 'micro', nextId: 'ai_modo' },
      { label: 'Decisioni rapide', value: 'decisioni', nextId: 'ai_modo' },
      { label: 'Entrambe', value: 'entrambe', nextId: 'ai_modo' },
    ],
  },
  
  'analisi_produzione': {
    id: 'analisi_produzione',
    strato: 'STRATO 3 — VINCOLI',
    question: 'Analisi o produzione?',
    collectAs: 'analisi_produzione',
    options: [
      { label: 'Più analisi', value: 'analisi', nextId: 'ai_modo' },
      { label: 'Più produzione', value: 'produzione', nextId: 'ai_modo' },
      { label: 'Entrambe', value: 'entrambe', nextId: 'ai_modo' },
    ],
  },
  
  'ai_modo': {
    id: 'ai_modo',
    strato: 'STRATO 3 — VINCOLI',
    question: 'Preferisci che l\'AI:',
    collectAs: 'ai_modo',
    options: [
      { label: 'Proponga soluzioni', value: 'proponga', nextId: 'proponga_alt' },
      { label: 'Esegua istruzioni', value: 'esegua', nextId: 'strumenti_attuali' },
    ],
  },
  
  'proponga_alt': {
    id: 'proponga_alt',
    strato: 'STRATO 3 — VINCOLI',
    question: 'Anche alternative?',
    collectAs: 'proponga_alt',
    options: [
      { label: 'Sì, sempre', value: 'sempre', nextId: 'strumenti_attuali' },
      { label: 'Solo se rilevanti', value: 'rilevanti', nextId: 'strumenti_attuali' },
      { label: 'No, una sola proposta', value: 'una', nextId: 'strumenti_attuali' },
    ],
  },
  
  // ============================================
  // STRATO 4 — RISORSE DISPONIBILI
  // ============================================
  
  'strumenti_attuali': {
    id: 'strumenti_attuali',
    strato: 'STRATO 4 — RISORSE DISPONIBILI',
    question: 'Che strumenti usi già?',
    collectAs: 'strumenti_attuali',
    options: [
      { label: 'AI (ChatGPT, Claude...)', value: 'ai', nextId: 'ai_uso' },
      { label: 'Solo strumenti tradizionali', value: 'tradizionali', nextId: 'strumenti_funziona' },
      { label: 'Mix di entrambi', value: 'mix', nextId: 'ai_uso' },
    ],
  },
  
  'ai_uso': {
    id: 'ai_uso',
    strato: 'STRATO 4 — RISORSE DISPONIBILI',
    question: 'Quali AI e come le usi?',
    collectAs: 'ai_uso',
    options: [
      { label: 'ChatGPT, spesso', value: 'chatgpt_spesso', nextId: 'materiali' },
      { label: 'ChatGPT, raramente', value: 'chatgpt_raro', nextId: 'materiali' },
      { label: 'Claude', value: 'claude', nextId: 'materiali' },
      { label: 'Altre', value: 'altre', nextId: 'materiali' },
    ],
  },
  
  'strumenti_funziona': {
    id: 'strumenti_funziona',
    strato: 'STRATO 4 — RISORSE DISPONIBILI',
    question: 'Cosa funziona meglio oggi?',
    collectAs: 'strumenti_funziona',
    options: [
      { label: 'Excel/Fogli', value: 'excel', nextId: 'materiali' },
      { label: 'Email', value: 'email', nextId: 'materiali' },
      { label: 'Note/Documenti', value: 'note', nextId: 'materiali' },
      { label: 'Altro', value: 'altro', nextId: 'materiali' },
    ],
  },
  
  'materiali': {
    id: 'materiali',
    strato: 'STRATO 4 — RISORSE DISPONIBILI',
    question: 'Hai materiali da cui partire?',
    collectAs: 'materiali',
    options: [
      { label: 'Sì', value: 'si', nextId: 'materiali_tipo' },
      { label: 'No, parto da zero', value: 'no', nextId: 'chi_decide' },
    ],
  },
  
  'materiali_tipo': {
    id: 'materiali_tipo',
    strato: 'STRATO 4 — RISORSE DISPONIBILI',
    question: 'Quali?',
    collectAs: 'materiali_tipo',
    options: [
      { label: 'Testi e documenti', value: 'testi', nextId: 'chi_decide' },
      { label: 'Note sparse', value: 'note', nextId: 'chi_decide' },
      { label: 'Audio/registrazioni', value: 'audio', nextId: 'chi_decide' },
      { label: 'Mix', value: 'mix', nextId: 'chi_decide' },
    ],
  },
  
  'chi_decide': {
    id: 'chi_decide',
    strato: 'STRATO 4 — RISORSE DISPONIBILI',
    question: 'Chi decide davvero quando usi l\'AI?',
    collectAs: 'chi_decide',
    options: [
      { label: 'Io', value: 'io', nextId: 'risposta_ideale' },
      { label: 'Altri influenzano', value: 'altri', nextId: 'chi_influenza' },
    ],
  },
  
  'chi_influenza': {
    id: 'chi_influenza',
    strato: 'STRATO 4 — RISORSE DISPONIBILI',
    question: 'Chi influenza le scelte?',
    collectAs: 'chi_influenza',
    options: [
      { label: 'Team/colleghi', value: 'team', nextId: 'risposta_ideale' },
      { label: 'Manager/titolare', value: 'manager', nextId: 'risposta_ideale' },
      { label: 'Clienti', value: 'clienti', nextId: 'risposta_ideale' },
    ],
  },
  
  // ============================================
  // STRATO 5 — STILE COGNITIVO
  // ============================================
  
  'risposta_ideale': {
    id: 'risposta_ideale',
    strato: 'STRATO 5 — STILE COGNITIVO',
    question: 'Quando leggi una risposta ideale, deve essere:',
    collectAs: 'risposta_ideale',
    options: [
      { label: 'Breve', value: 'breve', nextId: 'breve_tipo' },
      { label: 'Strutturata', value: 'strutturata', nextId: 'strutturata_tipo' },
    ],
  },
  
  'breve_tipo': {
    id: 'breve_tipo',
    strato: 'STRATO 5 — STILE COGNITIVO',
    question: 'Con checklist?',
    collectAs: 'breve_tipo',
    options: [
      { label: 'Sì, con checklist', value: 'checklist', nextId: 'sfida_supporta' },
      { label: 'No, solo testo breve', value: 'testo', nextId: 'sfida_supporta' },
    ],
  },
  
  'strutturata_tipo': {
    id: 'strutturata_tipo',
    strato: 'STRATO 5 — STILE COGNITIVO',
    question: 'Con esempi?',
    collectAs: 'strutturata_tipo',
    options: [
      { label: 'Sì, con esempi', value: 'esempi', nextId: 'sfida_supporta' },
      { label: 'No, solo struttura', value: 'struttura', nextId: 'sfida_supporta' },
    ],
  },
  
  'sfida_supporta': {
    id: 'sfida_supporta',
    strato: 'STRATO 5 — STILE COGNITIVO',
    question: 'Vuoi che l\'AI ti sfidi o ti supporti?',
    collectAs: 'sfida_supporta',
    options: [
      { label: 'Sfidi', value: 'sfidi', nextId: 'sfida_modo' },
      { label: 'Supporti', value: 'supporti', nextId: 'supporta_tono' },
    ],
  },
  
  'sfida_modo': {
    id: 'sfida_modo',
    strato: 'STRATO 5 — STILE COGNITIVO',
    question: 'In che modo?',
    collectAs: 'sfida_modo',
    options: [
      { label: 'Facendo domande scomode', value: 'domande', nextId: 'ai_persona' },
      { label: 'Proponendo alternative', value: 'alternative', nextId: 'ai_persona' },
      { label: 'Evidenziando rischi', value: 'rischi', nextId: 'ai_persona' },
    ],
  },
  
  'supporta_tono': {
    id: 'supporta_tono',
    strato: 'STRATO 5 — STILE COGNITIVO',
    question: 'Con che tono?',
    collectAs: 'supporta_tono',
    options: [
      { label: 'Neutro e professionale', value: 'neutro', nextId: 'ai_persona' },
      { label: 'Caldo e incoraggiante', value: 'caldo', nextId: 'ai_persona' },
      { label: 'Diretto e pratico', value: 'diretto', nextId: 'ai_persona' },
    ],
  },
  
  'ai_persona': {
    id: 'ai_persona',
    strato: 'STRATO 5 — STILE COGNITIVO',
    question: 'Se l\'AI fosse una persona, sarebbe più:',
    collectAs: 'ai_persona',
    options: [
      { label: 'Analitica', value: 'analitica', nextId: 'analitica_quanto' },
      { label: 'Creativa', value: 'creativa', nextId: 'creativa_quanto' },
    ],
  },
  
  'analitica_quanto': {
    id: 'analitica_quanto',
    strato: 'STRATO 5 — STILE COGNITIVO',
    question: 'Molto o quanto basta?',
    collectAs: 'analitica_quanto',
    options: [
      { label: 'Molto analitica', value: 'molto', nextId: 'output_tipo' },
      { label: 'Quanto basta', value: 'basta', nextId: 'output_tipo' },
    ],
  },
  
  'creativa_quanto': {
    id: 'creativa_quanto',
    strato: 'STRATO 5 — STILE COGNITIVO',
    question: 'Libera o guidata?',
    collectAs: 'creativa_quanto',
    options: [
      { label: 'Libera', value: 'libera', nextId: 'output_tipo' },
      { label: 'Guidata', value: 'guidata', nextId: 'output_tipo' },
    ],
  },
  
  // ============================================
  // STRATO 6 — OUTPUT DESIDERATO
  // ============================================
  
  'output_tipo': {
    id: 'output_tipo',
    strato: 'STRATO 6 — OUTPUT DESIDERATO',
    question: 'Che tipo di output vuoi più spesso?',
    collectAs: 'output_tipo',
    options: [
      { label: 'Testi', value: 'testi', nextId: 'testi_uso' },
      { label: 'Decisioni', value: 'decisioni', nextId: 'decisioni_tipo' },
    ],
  },
  
  'testi_uso': {
    id: 'testi_uso',
    strato: 'STRATO 6 — OUTPUT DESIDERATO',
    question: 'Per uso interno o esterno?',
    collectAs: 'testi_uso',
    options: [
      { label: 'Interno', value: 'interno', nextId: 'risposta_giusta' },
      { label: 'Esterno', value: 'esterno', nextId: 'risposta_giusta' },
      { label: 'Entrambi', value: 'entrambi', nextId: 'risposta_giusta' },
    ],
  },
  
  'decisioni_tipo': {
    id: 'decisioni_tipo',
    strato: 'STRATO 6 — OUTPUT DESIDERATO',
    question: 'Strategiche o operative?',
    collectAs: 'decisioni_tipo',
    options: [
      { label: 'Strategiche', value: 'strategiche', nextId: 'risposta_giusta' },
      { label: 'Operative', value: 'operative', nextId: 'risposta_giusta' },
      { label: 'Entrambe', value: 'entrambe', nextId: 'risposta_giusta' },
    ],
  },
  
  'risposta_giusta': {
    id: 'risposta_giusta',
    strato: 'STRATO 6 — OUTPUT DESIDERATO',
    question: 'Come capisci che una risposta è "giusta"?',
    collectAs: 'risposta_giusta',
    options: [
      { label: 'Ti sblocca', value: 'sblocca', nextId: 'sblocca_da' },
      { label: 'Ti fa agire', value: 'agire', nextId: 'agire_su' },
    ],
  },
  
  'sblocca_da': {
    id: 'sblocca_da',
    strato: 'STRATO 6 — OUTPUT DESIDERATO',
    question: 'Da cosa?',
    collectAs: 'sblocca_da',
    options: [
      { label: 'Dubbi', value: 'dubbi', nextId: 'dopo_risposta' },
      { label: 'Confusione', value: 'confusione', nextId: 'dopo_risposta' },
      { label: 'Procrastinazione', value: 'procrastinazione', nextId: 'dopo_risposta' },
    ],
  },
  
  'agire_su': {
    id: 'agire_su',
    strato: 'STRATO 6 — OUTPUT DESIDERATO',
    question: 'Su quale azione?',
    collectAs: 'agire_su',
    options: [
      { label: 'Immediata', value: 'immediata', nextId: 'dopo_risposta' },
      { label: 'Pianificata', value: 'pianificata', nextId: 'dopo_risposta' },
    ],
  },
  
  'dopo_risposta': {
    id: 'dopo_risposta',
    strato: 'STRATO 6 — OUTPUT DESIDERATO',
    question: 'Cosa dovrebbe succedere dopo ogni risposta?',
    collectAs: 'dopo_risposta',
    options: [
      { label: 'Prossimo passo chiaro', value: 'passo', nextId: 'passo_auto' },
      { label: 'Una domanda di follow-up', value: 'domanda', nextId: 'domanda_sempre' },
    ],
  },
  
  'passo_auto': {
    id: 'passo_auto',
    strato: 'STRATO 6 — OUTPUT DESIDERATO',
    question: 'Automatico?',
    collectAs: 'passo_auto',
    options: [
      { label: 'Sì, automatico', value: 'auto', nextId: 'visione_30g' },
      { label: 'No, su richiesta', value: 'richiesta', nextId: 'visione_30g' },
    ],
  },
  
  'domanda_sempre': {
    id: 'domanda_sempre',
    strato: 'STRATO 6 — OUTPUT DESIDERATO',
    question: 'Sempre o solo a volte?',
    collectAs: 'domanda_sempre',
    options: [
      { label: 'Sempre', value: 'sempre', nextId: 'visione_30g' },
      { label: 'Solo a volte', value: 'volte', nextId: 'visione_30g' },
    ],
  },
  
  // ============================================
  // STRATO 7 — ANCORAGGIO FINALE
  // ============================================
  
  'visione_30g': {
    id: 'visione_30g',
    strato: 'STRATO 7 — ANCORAGGIO FINALE',
    question: 'Se tra 30 giorni l\'AI avesse funzionato perfettamente, cosa sarebbe cambiato?',
    collectAs: 'visione_30g',
    options: [
      { label: 'Nel lavoro', value: 'lavoro', nextId: 'lavoro_cambiato' },
      { label: 'Nella testa', value: 'testa', nextId: 'testa_cambiata' },
    ],
  },
  
  'lavoro_cambiato': {
    id: 'lavoro_cambiato',
    strato: 'STRATO 7 — ANCORAGGIO FINALE',
    question: 'In che modo concreto?',
    collectAs: 'lavoro_cambiato',
    options: [
      { label: 'Più veloce', value: 'veloce', nextId: 'altro' },
      { label: 'Più organizzato', value: 'organizzato', nextId: 'altro' },
      { label: 'Più efficace', value: 'efficace', nextId: 'altro' },
    ],
  },
  
  'testa_cambiata': {
    id: 'testa_cambiata',
    strato: 'STRATO 7 — ANCORAGGIO FINALE',
    question: 'Meno stress o più chiarezza?',
    collectAs: 'testa_cambiata',
    options: [
      { label: 'Meno stress', value: 'stress', nextId: 'altro' },
      { label: 'Più chiarezza', value: 'chiarezza', nextId: 'altro' },
      { label: 'Entrambi', value: 'entrambi', nextId: 'altro' },
    ],
  },
  
  'altro': {
    id: 'altro',
    strato: 'STRATO 7 — ANCORAGGIO FINALE',
    question: 'C\'è qualcosa che non ti ho chiesto ma che conta molto?',
    collectAs: 'altro',
    options: [
      { label: 'No, tutto chiaro', value: 'no', nextId: null },
      { label: 'Sì, voglio aggiungere qualcosa', value: 'si', nextId: null },
    ],
  },
}

// Strati per i progress dots
export const strati = [
  'STRATO 1 — IDENTITÀ & DIREZIONE',
  'STRATO 2 — CONTESTO REALE',
  'STRATO 3 — VINCOLI',
  'STRATO 4 — RISORSE DISPONIBILI',
  'STRATO 5 — STILE COGNITIVO',
  'STRATO 6 — OUTPUT DESIDERATO',
  'STRATO 7 — ANCORAGGIO FINALE',
]

export const startQuestionId = 'identity'

export const assessmentContent = {
  hero: {
    badge: {
      primary: 'AI-UP',
      secondary: 'SECOND BRAIN™ YOUR STARTING POINT',
    },
    intro: {
      blocks: [
        ['This is Phase 1', 'building the general framework', 'of your Second Brain'],
        ['After sign-up,', "we'll shape it around", 'your specific context and goals'],
      ],
    },
  },
  complete: {
    section: 'PHASE 1 COMPLETE',
    title: ['Done.', 'Phase 1 is complete.'],
    body: 'Create your account to personalize your Second Brain.',
    cta: 'Create account',
  },
}
