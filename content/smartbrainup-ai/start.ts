// content/smartbrainup-ai/start.ts
// ═══════════════════════════════════════════════════════════
// CONTEXT INTAKE — AI-UP SECOND BRAIN™
// ═══════════════════════════════════════════════════════════
//
// Phase 1 only → account → Supabase
// Extensible: add questions, replace null with next id
//
// ROUTING (Q1):
// q1 → independent → q1_sub_independent → null
// q1 → company → q1_sub_company → q1_role → null
//
// LABEL LINE BREAKS:
// Use \n in label strings to control mobile line breaks.
// page.tsx renders \n as <br> on mobile only.
// ═══════════════════════════════════════════════════════════


// ══════════════════════════
// INTERFACES
// ══════════════════════════

export interface AdaptiveOption {
  label: string
  value: string
  nextId: string | null  // null = end → complete screen
}

export interface AdaptiveQuestion {
  id: string
  strato: string
  topic: string
  question: string
  collectAs: string
  type: 'single' | 'multi'
  maxSelect?: number       // only for type: 'multi'
  options: AdaptiveOption[]
}

export interface CollectedData {
  [key: string]: string | string[]
}


// ══════════════════════════════════════════════════════════
// QUESTIONS
// ══════════════════════════════════════════════════════════

export const questionsMap: Record<string, AdaptiveQuestion> = {

  // ============================================
  // LAYER 1 — IDENTITY & DIRECTION
  // ============================================

  // Q1 — Operating position (main split)
  'q1_position': {
    id: 'q1_position',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    topic: 'YOUR OPERATING POSITION',
    question: 'Right now, you operate mainly as',
    collectAs: 'operating_position',
    type: 'single',
    options: [
      { label: 'An independent professional', value: 'independent', nextId: 'q1_sub_independent' },
      { label: 'A company or\nstructured team', value: 'company', nextId: 'q1_sub_company' },
    ],
  },

  // Q1 sub — Independent branch
  'q1_sub_independent': {
    id: 'q1_sub_independent',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    topic: 'YOUR OPERATING POSITION',
    question: 'More specifically, you are',
    collectAs: 'independent_type',
    type: 'single',
    options: [
      { label: 'Freelance / solopreneur', value: 'freelance', nextId: null },
      { label: 'Consultant / advisor', value: 'consultant', nextId: null },
      { label: 'Creative professional', value: 'creative', nextId: null },
      { label: 'Technical specialist', value: 'technical', nextId: null },
      { label: 'Other independent role', value: 'other', nextId: null },
    ],
  },

  // Q1 sub — Company branch
  'q1_sub_company': {
    id: 'q1_sub_company',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    topic: 'YOUR OPERATING POSITION',
    question: 'Your organisation is',
    collectAs: 'company_size',
    type: 'single',
    options: [
      { label: 'Solo founder', value: 'solo_founder', nextId: 'q1_role' },
      { label: 'Small team\n(2–5 people)', value: 'small_team', nextId: 'q1_role' },
      { label: 'Medium team\n(6–20 people)', value: 'medium_team', nextId: 'q1_role' },
      { label: 'Larger organisation\n(20+ people)', value: 'larger_org', nextId: 'q1_role' },
    ],
  },

  // Q1 sub — Personal role (company branch only)
  'q1_role': {
    id: 'q1_role',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    topic: 'YOUR OPERATING POSITION',
    question: 'Your personal role is',
    collectAs: 'personal_role',
    type: 'single',
    options: [
      { label: 'Decision maker', value: 'decision_maker', nextId: null },
      { label: 'Operational lead', value: 'operational_lead', nextId: null },
      { label: 'Specialist contributor', value: 'specialist', nextId: null },
      { label: 'Support role', value: 'support', nextId: null },
    ],
  },

}


// ══════════════════════════════════════════════════════════
// LAYERS (progress reference)
// ══════════════════════════════════════════════════════════

export const strati = [
  'LAYER 1 — IDENTITY & DIRECTION',
]

export const startQuestionId = 'q1_position'


// ══════════════════════════════════════════════════════════
// CONTENT (copy)
// ══════════════════════════════════════════════════════════

export const assessmentContent = {
  hero: {
    badge: {
      primary: 'AI-UP',
      secondary: 'SECOND BRAIN™ STARTING POINT',
    },
    intro: {
      col1: [
        ['This is where your Second Brain begins.'],
        [
          'Phase 1 is public and immediate.',
          'You\'ll answer a short sequence of questions',
          'to clarify where you are,',
          'what kind of situation you\'re facing,',
          'and what really needs focus right now.',
        ],
      ],
      col2: [
        [
          'Phase 2 requires access to your private area.',
          'After logging in, the system shifts gear.',
          'It becomes tailored, precise, and context-aware,',
          'configuring your Second Brain',
          'around your constraints, decisions, and working style.',
        ],
        [
          'From that point on,',
          'the AI stops being generic',
          'and starts working specifically for you.',
        ],
      ],
    },
  },
  complete: {
    section: 'PHASE 1 COMPLETE',
    title: ['Done', 'Phase 1 complete'],
    body: 'Create your account to continue building your Second Brain.',
    cta: 'Create account',
  },
}
