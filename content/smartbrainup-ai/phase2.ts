// content/smartbrainup-ai/phase2.ts
// ═══════════════════════════════════════════════════════════
// PHASE 2 — PRIVATE ASSESSMENT (CLIENT AREA)
// AI-UP SECOND BRAIN™
// ═══════════════════════════════════════════════════════════
//
// Runs inside /client when user clicks "Complete Phase 2"
// Light theme — inverted from Phase 1
// Exit at any time without saving
// Only saves on full completion → phase2_complete = true
//
// ═══════════════════════════════════════════════════════════


// ══════════════════════════
// INTERFACES
// ══════════════════════════

export interface Phase2Option {
  label: string
  value: string
  nextId: string | null
}

export interface Phase2Question {
  id: string
  strato: string
  topic: string
  question: string
  collectAs: string
  type: 'single' | 'multi'
  maxSelect?: number
  options: Phase2Option[]
}

export interface Phase2CollectedData {
  [key: string]: string | string[]
}


// ══════════════════════════════════════════════════════════
// QUESTIONS
// ══════════════════════════════════════════════════════════

export const phase2QuestionsMap: Record<string, Phase2Question> = {

  // ============================================
  // LAYER 3 — CONSTRAINTS & LIMITS
  // ============================================

  'q7_constraint': {
    id: 'q7_constraint',
    strato: 'LAYER 3 — CONSTRAINTS & LIMITS',
    topic: 'NON-NEGOTIABLE CONSTRAINT',
    question: 'This system must primarily avoid',
    collectAs: 'non_negotiable_constraint',
    type: 'single',
    options: [
      { label: 'Handling sensitive or\nconfidential data', value: 'sensitive_data', nextId: 'q8_time' },
      { label: 'Explaining theory or\nbackground concepts', value: 'no_theory', nextId: 'q8_time' },
      { label: 'Being verbose or\nlong-winded', value: 'no_verbose', nextId: 'q8_time' },
      { label: 'Offering too many\nalternatives', value: 'no_alternatives', nextId: 'q8_time' },
      { label: 'Using motivational or\ninspirational language', value: 'no_motivational', nextId: 'q8_time' },
      { label: 'Changing direction\nmid-flow', value: 'no_direction_change', nextId: 'q8_time' },
    ],
  },

  'q8_time': {
    id: 'q8_time',
    strato: 'LAYER 3 — CONSTRAINTS & LIMITS',
    topic: 'AVAILABLE TIME',
    question: 'On a normal working day, you realistically have',
    collectAs: 'available_time',
    type: 'single',
    options: [
      { label: 'Less than 10 minutes', value: 'under_10', nextId: null },
      { label: '10–30 minutes', value: '10_to_30', nextId: null },
      { label: 'More than 30 minutes', value: 'over_30', nextId: null },
    ],
  },

}


// ══════════════════════════════════════════════════════════
// LAYERS (progress reference)
// ══════════════════════════════════════════════════════════

export const phase2Strati = [
  'LAYER 3 — CONSTRAINTS & LIMITS',
]

export const phase2StartQuestionId = 'q7_constraint'


// ══════════════════════════════════════════════════════════
// CONTENT (copy)
// ══════════════════════════════════════════════════════════

export const phase2Content = {
  header: {
    badge: {
      primary: 'AI-UP',
      secondary: 'SECOND BRAIN™ PHASE 2',
    },
    exit: 'Exit',
  },
  complete: {
    section: 'PHASE 2 COMPLETE',
    title: ['Done', 'Your Second Brain is active'],
    body: 'All context layers have been captured.',
    detail: 'Your Second Brain is now ready to operate across platforms.',
    cta: 'Go to dashboard',
  },
}
