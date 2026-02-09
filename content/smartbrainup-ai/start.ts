// content/smartbrainup-ai/start.ts
// ═══════════════════════════════════════════════════════════
// CONTEXT INTAKE — AI-UP SECOND BRAIN™
// ═══════════════════════════════════════════════════════════
//
// Phase 1 only → completion card → login → client area
// Extensible: add questions, replace null with next id
//
// ROUTING (Q1):
// q1 → independent → q1_sub_independent → q2_objective
// q1 → company → q1_sub_company → solo_founder → q2_objective (role implicit)
// q1 → company → q1_sub_company → other sizes → q1_role → q2_objective
//
// ROUTING (Q2):
// q2_objective → q2_time_horizon → q3_state
//
// ROUTING (Q3):
// q3_state → overload → q3_overload_source → q4_work
// q3_state → blockage → q3_blockage_type → q4_work
//
// ROUTING (Q4):
// q4_work → documents → q4_document_type → q5_environment
// q4_work → clients/ideas/numbers → q5_environment
//
// ROUTING (Q5):
// q5_environment → desktop → q5_desktop_usage → q6_pressure
// q5_environment → mobile → q5_mobile_usage → q6_pressure
//
// ROUTING (Q6):
// q6_pressure → very_close → q6_very_close → null
// q6_pressure → approaching → null
// q6_pressure → undefined → q6_undefined → null
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
      { label: 'Freelance / solopreneur', value: 'freelance', nextId: 'q2_objective' },
      { label: 'Consultant / advisor', value: 'consultant', nextId: 'q2_objective' },
      { label: 'Creative professional', value: 'creative', nextId: 'q2_objective' },
      { label: 'Technical specialist', value: 'technical', nextId: 'q2_objective' },
      { label: 'Other independent role', value: 'other', nextId: 'q2_objective' },
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
      { label: 'Solo founder', value: 'solo_founder', nextId: 'q2_objective' },
      { label: 'Small team\n(2–5 people)', value: 'small_team', nextId: 'q1_role' },
      { label: 'Medium team\n(6–20 people)', value: 'medium_team', nextId: 'q1_role' },
      { label: 'Larger organisation\n(20+ people)', value: 'larger_org', nextId: 'q1_role' },
    ],
  },

  // Q1 sub — Personal role (company branch, not solo founder)
  'q1_role': {
    id: 'q1_role',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    topic: 'YOUR OPERATING POSITION',
    question: 'Your personal role is',
    collectAs: 'personal_role',
    type: 'single',
    options: [
      { label: 'Decision maker', value: 'decision_maker', nextId: 'q2_objective' },
      { label: 'Operational lead', value: 'operational_lead', nextId: 'q2_objective' },
      { label: 'Specialist contributor', value: 'specialist', nextId: 'q2_objective' },
      { label: 'Support role', value: 'support', nextId: 'q2_objective' },
    ],
  },

  // ============================================
  // Q2 — PRIMARY OBJECTIVE
  // ============================================

  'q2_objective': {
    id: 'q2_objective',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    topic: 'PRIMARY OBJECTIVE',
    question: 'The main reason you are using this system is',
    collectAs: 'primary_objective',
    type: 'single',
    options: [
      { label: 'Improve focus\nand prioritisation', value: 'focus', nextId: 'q2_time_horizon' },
      { label: 'Achieve concrete results', value: 'results', nextId: 'q2_time_horizon' },
      { label: 'Make decisions with clarity', value: 'decisions', nextId: 'q2_time_horizon' },
    ],
  },

  'q2_time_horizon': {
    id: 'q2_time_horizon',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    topic: 'PRIMARY OBJECTIVE',
    question: 'Given your objective, you need clarity',
    collectAs: 'time_horizon',
    type: 'single',
    options: [
      { label: 'In the next few days', value: 'days', nextId: 'q3_state' },
      { label: 'In the next few weeks', value: 'weeks', nextId: 'q3_state' },
      { label: 'As soon as possible,\ntiming unclear', value: 'asap_unclear', nextId: 'q3_state' },
    ],
  },

  // ============================================
  // Q3 — CURRENT STATE
  // ============================================

  'q3_state': {
    id: 'q3_state',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    topic: 'CURRENT STATE',
    question: 'At this moment, the dominant condition is',
    collectAs: 'current_state',
    type: 'single',
    options: [
      { label: 'Overload', value: 'overload', nextId: 'q3_overload_source' },
      { label: 'Blockage', value: 'blockage', nextId: 'q3_blockage_type' },
    ],
  },

  'q3_overload_source': {
    id: 'q3_overload_source',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    topic: 'CURRENT STATE',
    question: 'The overload mainly comes from',
    collectAs: 'overload_source',
    type: 'single',
    options: [
      { label: 'Too many active fronts', value: 'too_many_fronts', nextId: 'q4_work' },
      { label: 'Information overload', value: 'info_overload', nextId: 'q4_work' },
      { label: 'External pressure', value: 'external_pressure', nextId: 'q4_work' },
      { label: 'Lack of structure', value: 'lack_structure', nextId: 'q4_work' },
    ],
  },

  'q3_blockage_type': {
    id: 'q3_blockage_type',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    topic: 'CURRENT STATE',
    question: 'The blockage mainly concerns',
    collectAs: 'blockage_type',
    type: 'single',
    options: [
      { label: 'A strategic decision', value: 'strategic_decision', nextId: 'q4_work' },
      { label: 'An operational choice', value: 'operational_choice', nextId: 'q4_work' },
      { label: 'Unclear direction', value: 'unclear_direction', nextId: 'q4_work' },
      { label: 'Conflicting priorities', value: 'conflicting_priorities', nextId: 'q4_work' },
    ],
  },

  // ============================================
  // LAYER 2 — OPERATIONAL CONTEXT
  // ============================================

  // Q4 — Daily work reality
  'q4_work': {
    id: 'q4_work',
    strato: 'LAYER 2 — OPERATIONAL CONTEXT',
    topic: 'DAILY WORK REALITY',
    question: 'Most of your daily work revolves around',
    collectAs: 'daily_work',
    type: 'single',
    options: [
      { label: 'Documents & writing', value: 'documents', nextId: 'q4_document_type' },
      { label: 'Clients & communication', value: 'clients', nextId: 'q5_environment' },
      { label: 'Ideas & thinking', value: 'ideas', nextId: 'q5_environment' },
      { label: 'Numbers & operations', value: 'numbers', nextId: 'q5_environment' },
    ],
  },

  'q4_document_type': {
    id: 'q4_document_type',
    strato: 'LAYER 2 — OPERATIONAL CONTEXT',
    topic: 'DAILY WORK REALITY',
    question: 'You mostly deal with',
    collectAs: 'document_type',
    type: 'single',
    options: [
      { label: 'Long-form documents', value: 'long_form', nextId: 'q5_environment' },
      { label: 'Short texts & notes', value: 'short_texts', nextId: 'q5_environment' },
      { label: 'Structured reports', value: 'structured_reports', nextId: 'q5_environment' },
      { label: 'Mixed formats', value: 'mixed_formats', nextId: 'q5_environment' },
    ],
  },

  // Q5 — Usage environment
  'q5_environment': {
    id: 'q5_environment',
    strato: 'LAYER 2 — OPERATIONAL CONTEXT',
    topic: 'USAGE ENVIRONMENT',
    question: 'You will mostly use this system',
    collectAs: 'usage_environment',
    type: 'single',
    options: [
      { label: 'On desktop', value: 'desktop', nextId: 'q5_desktop_usage' },
      { label: 'On mobile', value: 'mobile', nextId: 'q5_mobile_usage' },
    ],
  },

  'q5_desktop_usage': {
    id: 'q5_desktop_usage',
    strato: 'LAYER 2 — OPERATIONAL CONTEXT',
    topic: 'USAGE ENVIRONMENT',
    question: 'More specifically',
    collectAs: 'desktop_usage',
    type: 'single',
    options: [
      { label: 'As a primary tool', value: 'primary_tool', nextId: 'q6_pressure' },
      { label: 'Alongside other tools', value: 'alongside_tools', nextId: 'q6_pressure' },
    ],
  },

  'q5_mobile_usage': {
    id: 'q5_mobile_usage',
    strato: 'LAYER 2 — OPERATIONAL CONTEXT',
    topic: 'USAGE ENVIRONMENT',
    question: 'More specifically',
    collectAs: 'mobile_usage',
    type: 'single',
    options: [
      { label: 'On the move', value: 'on_the_move', nextId: 'q6_pressure' },
      { label: 'In fixed moments', value: 'fixed_moments', nextId: 'q6_pressure' },
    ],
  },

  // Q6 — Current time pressure
  'q6_pressure': {
    id: 'q6_pressure',
    strato: 'LAYER 2 — OPERATIONAL CONTEXT',
    topic: 'CURRENT TIME PRESSURE',
    question: 'Right now, the closest mental deadline feels',
    collectAs: 'time_pressure',
    type: 'single',
    options: [
      { label: 'Very close', value: 'very_close', nextId: 'q6_very_close' },
      { label: 'Approaching', value: 'approaching', nextId: null },
      { label: 'Present but undefined', value: 'present_undefined', nextId: 'q6_undefined' },
    ],
  },

  'q6_very_close': {
    id: 'q6_very_close',
    strato: 'LAYER 2 — OPERATIONAL CONTEXT',
    topic: 'CURRENT TIME PRESSURE',
    question: 'The closest deadline involves',
    collectAs: 'very_close_type',
    type: 'single',
    options: [
      { label: 'Deliverable to complete', value: 'deliverable', nextId: null },
      { label: 'Decision to make', value: 'decision', nextId: null },
      { label: 'Problem to resolve', value: 'problem', nextId: null },
    ],
  },

  'q6_undefined': {
    id: 'q6_undefined',
    strato: 'LAYER 2 — OPERATIONAL CONTEXT',
    topic: 'CURRENT TIME PRESSURE',
    question: 'The undefined pressure mainly',
    collectAs: 'undefined_type',
    type: 'single',
    options: [
      { label: 'Keeps being postponed', value: 'postponed', nextId: null },
      { label: 'Lacks clear ownership', value: 'no_ownership', nextId: null },
      { label: 'Feels too complex', value: 'too_complex', nextId: null },
    ],
  },

}


// ══════════════════════════════════════════════════════════
// LAYERS (progress reference)
// ══════════════════════════════════════════════════════════

export const strati = [
  'LAYER 1 — IDENTITY & DIRECTION',
  'LAYER 2 — OPERATIONAL CONTEXT',
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
    phaseLabel: '01 — PUBLIC PHASE',
    intro: [
      'This is where your Second Brain begins',
      'phase 1 is public and immediate',
      'you answer a short sequence of questions',
      'to see where you are right now',
      'and what deserves attention first',
    ],
  },
  complete: {
    section: 'PHASE 1 COMPLETE',
    title: ['Done', 'Phase 1 complete'],
    body: 'Your initial context has been captured.',
    detail: 'Sign in to access your client area. Your Second Brain will be ready for Phase 2.',
    cta: 'Continue',
  },
}
