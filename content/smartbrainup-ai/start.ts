// content/smartbrainup-ai/start.ts
// ═══════════════════════════════════════════════════════════
// CONTEXT INTAKE — AI-UP SECOND BRAIN™
// ═══════════════════════════════════════════════════════════
//
// Phase 1: Select-only (pre-account) — fast clic-clic-clic
// Phase 2: Text input (post-account) — contextualised follow-ups
//
// 8 Layers · English · Adaptive routing
// Source: CONTEXT_INTAKE_AI-UP_SECOND_BRAIN.pdf
//
// page.tsx changes required:
//   1. strato field kept as 'strato' (no rename needed)
//   2. handle type === 'multi' for Q7 (multi-select + confirm)
//   3. CollectedData values can be string | string[]
//   4. totalQuestions is dynamic (count from routing path)
// ═══════════════════════════════════════════════════════════


// ══════════════════════════
// INTERFACES
// ══════════════════════════

export interface AdaptiveOption {
  label: string
  value: string
  nextId: string | null  // null = end of Phase 1
}

export interface AdaptiveQuestion {
  id: string
  strato: string
  question: string
  collectAs: string
  type: 'single' | 'multi'
  maxSelect?: number       // only for type: 'multi'
  options: AdaptiveOption[]
}

export interface Phase2Question {
  id: string
  strato: string
  dependsOn: string            // collectAs key from Phase 1
  dependsOnValue: string | null // specific value trigger, null = always show
  question: string             // self-contained, contextualised
  collectAs: string
}

export interface CollectedData {
  [key: string]: string | string[]
}


// ══════════════════════════════════════════════════════════
// PHASE 1 — SELECT QUESTIONS (pre-account)
// ══════════════════════════════════════════════════════════
//
// ~18–21 questions depending on path
// All single-select except Q7 (multi, max 2)
//
// ROUTING:
// q1 → q2 → q3
// → q4 → q5 → q6
// → q7(multi) → q8 → [q8b if <10] → q9 → q11
// → q12 → q13 → [q13b_checklists | q13b_examples] → q14 → q15
// → q16 → q18
// → q20
// → d1 → d2 → d3 → d4 → END
// ══════════════════════════════════════════════════════════

export const questionsMap: Record<string, AdaptiveQuestion> = {

  // ============================================
  // LAYER 1 — IDENTITY & DIRECTION
  // ============================================

  'q1_position': {
    id: 'q1_position',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    question: 'Right now, you operate mainly as',
    collectAs: 'operating_position',
    type: 'single',
    options: [
      { label: 'An independent professional', value: 'independent', nextId: 'q2_objective' },
      { label: 'A company or structured team', value: 'company', nextId: 'q2_objective' },
    ],
  },

  'q2_objective': {
    id: 'q2_objective',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    question: 'The main reason you are using this system is',
    collectAs: 'primary_objective',
    type: 'single',
    options: [
      { label: 'To regain time', value: 'time', nextId: 'q3_current_state' },
      { label: 'To achieve concrete results', value: 'results', nextId: 'q3_current_state' },
      { label: 'To make decisions with clarity', value: 'clarity', nextId: 'q3_current_state' },
    ],
  },

  'q3_current_state': {
    id: 'q3_current_state',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    question: 'At this moment, the dominant condition is',
    collectAs: 'current_state',
    type: 'single',
    options: [
      { label: 'Overload', value: 'overload', nextId: 'q4_daily_work' },
      { label: 'Blockage', value: 'blockage', nextId: 'q4_daily_work' },
    ],
  },

  // ============================================
  // LAYER 2 — OPERATIONAL CONTEXT
  // ============================================

  'q4_daily_work': {
    id: 'q4_daily_work',
    strato: 'LAYER 2 — OPERATIONAL CONTEXT',
    question: 'Most of your daily work revolves around',
    collectAs: 'daily_work',
    type: 'single',
    options: [
      { label: 'Documents', value: 'documents', nextId: 'q5_usage' },
      { label: 'Clients', value: 'clients', nextId: 'q5_usage' },
      { label: 'Ideas', value: 'ideas', nextId: 'q5_usage' },
      { label: 'Numbers', value: 'numbers', nextId: 'q5_usage' },
    ],
  },

  'q5_usage': {
    id: 'q5_usage',
    strato: 'LAYER 2 — OPERATIONAL CONTEXT',
    question: 'You will mostly use this system',
    collectAs: 'usage_environment',
    type: 'single',
    options: [
      { label: 'On desktop', value: 'desktop', nextId: 'q6_time_pressure' },
      { label: 'On mobile', value: 'mobile', nextId: 'q6_time_pressure' },
    ],
  },

  'q6_time_pressure': {
    id: 'q6_time_pressure',
    strato: 'LAYER 2 — OPERATIONAL CONTEXT',
    question: 'The closest mental deadline is',
    collectAs: 'time_pressure',
    type: 'single',
    options: [
      { label: 'Within the next 7 days', value: 'within_7_days', nextId: 'q7_limits' },
      { label: 'Not defined, but unresolved', value: 'unresolved', nextId: 'q7_limits' },
    ],
  },

  // ============================================
  // LAYER 3 — CONSTRAINTS & LIMITS
  // ============================================

  'q7_limits': {
    id: 'q7_limits',
    strato: 'LAYER 3 — CONSTRAINTS & LIMITS',
    question: 'This system must NOT — select up to two',
    collectAs: 'non_negotiable_limits',
    type: 'multi',
    maxSelect: 2,
    options: [
      { label: 'Handle sensitive data', value: 'sensitive_data', nextId: 'q8_available_time' },
      { label: 'Explain theory', value: 'theory', nextId: 'q8_available_time' },
      { label: 'Be verbose', value: 'verbose', nextId: 'q8_available_time' },
      { label: 'Offer too many alternatives', value: 'too_many_options', nextId: 'q8_available_time' },
      { label: 'Use motivational language', value: 'motivational', nextId: 'q8_available_time' },
    ],
  },

  'q8_available_time': {
    id: 'q8_available_time',
    strato: 'LAYER 3 — CONSTRAINTS & LIMITS',
    question: 'On a normal day, you realistically have',
    collectAs: 'available_time',
    type: 'single',
    options: [
      { label: 'Less than 10 minutes', value: 'less_10', nextId: 'q8b_micro' },
      { label: '10–30 minutes', value: '10_30', nextId: 'q9_execution_mode' },
      { label: 'More than 30 minutes', value: 'more_30', nextId: 'q9_execution_mode' },
    ],
  },

  'q8b_micro': {
    id: 'q8b_micro',
    strato: 'LAYER 3 — CONSTRAINTS & LIMITS',
    question: 'With less than 10 minutes, you prefer',
    collectAs: 'micro_preference',
    type: 'single',
    options: [
      { label: 'Micro-actions', value: 'micro_actions', nextId: 'q9_execution_mode' },
      { label: 'Micro-decisions', value: 'micro_decisions', nextId: 'q9_execution_mode' },
    ],
  },

  // ============================================
  // LAYER 4 — EXECUTION PREFERENCES
  // ============================================
  // Q10 (Existing Tools) → entirely Phase 2

  'q9_execution_mode': {
    id: 'q9_execution_mode',
    strato: 'LAYER 4 — EXECUTION PREFERENCES',
    question: 'You want the system to mainly',
    collectAs: 'execution_mode',
    type: 'single',
    options: [
      { label: 'Propose options', value: 'propose', nextId: 'q11_starting_material' },
      { label: 'Execute clear instructions', value: 'execute', nextId: 'q11_starting_material' },
    ],
  },

  'q11_starting_material': {
    id: 'q11_starting_material',
    strato: 'LAYER 4 — EXECUTION PREFERENCES',
    question: 'You currently have material to work from',
    collectAs: 'starting_material',
    type: 'single',
    options: [
      { label: 'Yes', value: 'yes', nextId: 'q12_decision_authority' },
      { label: 'No', value: 'no', nextId: 'q12_decision_authority' },
    ],
  },

  // ============================================
  // LAYER 5 — DECISION & INTERACTION STYLE
  // ============================================

  'q12_decision_authority': {
    id: 'q12_decision_authority',
    strato: 'LAYER 5 — DECISION & INTERACTION STYLE',
    question: 'Who ultimately decides when this system is used',
    collectAs: 'decision_authority',
    type: 'single',
    options: [
      { label: 'You', value: 'you', nextId: 'q13_response_format' },
      { label: 'Other people', value: 'others', nextId: 'q13_response_format' },
    ],
  },

  'q13_response_format': {
    id: 'q13_response_format',
    strato: 'LAYER 5 — DECISION & INTERACTION STYLE',
    question: 'An answer works best for you when it is',
    collectAs: 'response_format',
    type: 'single',
    options: [
      { label: 'Short', value: 'short', nextId: 'q13b_checklists' },
      { label: 'Structured', value: 'structured', nextId: 'q13b_examples' },
    ],
  },

  'q13b_checklists': {
    id: 'q13b_checklists',
    strato: 'LAYER 5 — DECISION & INTERACTION STYLE',
    question: 'Are checklists useful for you?',
    collectAs: 'checklists_useful',
    type: 'single',
    options: [
      { label: 'Yes', value: 'yes', nextId: 'q14_interaction_style' },
      { label: 'No', value: 'no', nextId: 'q14_interaction_style' },
    ],
  },

  'q13b_examples': {
    id: 'q13b_examples',
    strato: 'LAYER 5 — DECISION & INTERACTION STYLE',
    question: 'Are examples useful for you?',
    collectAs: 'examples_useful',
    type: 'single',
    options: [
      { label: 'Yes', value: 'yes', nextId: 'q14_interaction_style' },
      { label: 'No', value: 'no', nextId: 'q14_interaction_style' },
    ],
  },

  'q14_interaction_style': {
    id: 'q14_interaction_style',
    strato: 'LAYER 5 — DECISION & INTERACTION STYLE',
    question: 'You want the system to',
    collectAs: 'interaction_style',
    type: 'single',
    options: [
      { label: 'Challenge your thinking', value: 'challenge', nextId: 'q15_cognitive_bias' },
      { label: 'Support your thinking', value: 'support', nextId: 'q15_cognitive_bias' },
    ],
  },

  'q15_cognitive_bias': {
    id: 'q15_cognitive_bias',
    strato: 'LAYER 5 — DECISION & INTERACTION STYLE',
    question: 'If the system had a dominant trait, it would be',
    collectAs: 'cognitive_bias',
    type: 'single',
    options: [
      { label: 'Analytical', value: 'analytical', nextId: 'q16_primary_output' },
      { label: 'Creative', value: 'creative', nextId: 'q16_primary_output' },
    ],
  },

  // ============================================
  // LAYER 6 — OUTPUT & VALIDATION
  // ============================================
  // Q17 (Answer Validation) → entirely Phase 2

  'q16_primary_output': {
    id: 'q16_primary_output',
    strato: 'LAYER 6 — OUTPUT & VALIDATION',
    question: 'Most of the time, you expect',
    collectAs: 'primary_output',
    type: 'single',
    options: [
      { label: 'Written output', value: 'written', nextId: 'q18_next_step' },
      { label: 'A decision', value: 'decision', nextId: 'q18_next_step' },
    ],
  },

  'q18_next_step': {
    id: 'q18_next_step',
    strato: 'LAYER 6 — OUTPUT & VALIDATION',
    question: 'After a good answer, you expect',
    collectAs: 'next_step',
    type: 'single',
    options: [
      { label: 'A clear next step', value: 'clear_step', nextId: 'q20_missing_factor' },
      { label: 'A follow-up question', value: 'follow_up', nextId: 'q20_missing_factor' },
      { label: 'Both', value: 'both', nextId: 'q20_missing_factor' },
    ],
  },

  // ============================================
  // LAYER 7 — FUTURE STATE
  // ============================================
  // Q19 (Future State) → entirely Phase 2

  'q20_missing_factor': {
    id: 'q20_missing_factor',
    strato: 'LAYER 7 — FUTURE STATE',
    question: 'Is there anything important that was not addressed',
    collectAs: 'missing_factor',
    type: 'single',
    options: [
      { label: 'No', value: 'no', nextId: 'd1_success_criterion' },
      { label: 'Yes', value: 'yes', nextId: 'd1_success_criterion' },
    ],
  },

  // ============================================
  // LAYER 8 — DETERMINISTIC CORE
  // ============================================

  'd1_success_criterion': {
    id: 'd1_success_criterion',
    strato: 'LAYER 8 — DETERMINISTIC CORE',
    question: 'An answer is successful when it',
    collectAs: 'success_criterion',
    type: 'single',
    options: [
      { label: 'Forces a decision', value: 'forces_decision', nextId: 'd2_approximation' },
      { label: 'Triggers action', value: 'triggers_action', nextId: 'd2_approximation' },
      { label: 'Creates control', value: 'creates_control', nextId: 'd2_approximation' },
      { label: 'Reduces mental noise', value: 'reduces_noise', nextId: 'd2_approximation' },
      { label: 'Produces a reusable asset', value: 'reusable_asset', nextId: 'd2_approximation' },
    ],
  },

  'd2_approximation': {
    id: 'd2_approximation',
    strato: 'LAYER 8 — DETERMINISTIC CORE',
    question: 'You prefer answers that are',
    collectAs: 'approximation_tolerance',
    type: 'single',
    options: [
      { label: 'Imperfect but immediately usable', value: 'imperfect_usable', nextId: 'd3_guidance' },
      { label: 'More precise, even if slower', value: 'precise_slower', nextId: 'd3_guidance' },
      { label: 'Context-dependent (default fast)', value: 'context_default_fast', nextId: 'd3_guidance' },
    ],
  },

  'd3_guidance': {
    id: 'd3_guidance',
    strato: 'LAYER 8 — DETERMINISTIC CORE',
    question: 'When progress slows, the system should',
    collectAs: 'guidance_threshold',
    type: 'single',
    options: [
      { label: 'Force a choice', value: 'force_choice', nextId: 'd4_hard_failure' },
      { label: 'Reduce options', value: 'reduce_options', nextId: 'd4_hard_failure' },
      { label: 'Ask a sharper question', value: 'sharper_question', nextId: 'd4_hard_failure' },
      { label: 'Allow one more step', value: 'one_more_step', nextId: 'd4_hard_failure' },
    ],
  },

  'd4_hard_failure': {
    id: 'd4_hard_failure',
    strato: 'LAYER 8 — DETERMINISTIC CORE',
    question: 'An answer fails immediately if it',
    collectAs: 'hard_failure',
    type: 'single',
    options: [
      { label: 'Is too long', value: 'too_long', nextId: null },
      { label: 'Is too theoretical', value: 'too_theoretical', nextId: null },
      { label: 'Is too vague', value: 'too_vague', nextId: null },
      { label: 'Creates too many alternatives', value: 'too_many_alternatives', nextId: null },
      { label: 'Does not lead to action', value: 'no_action', nextId: null },
    ],
  },
}


// ══════════════════════════════════════════════════════════
// PHASE 2 — CONTEXTUAL TEXT QUESTIONS (post-account)
// ══════════════════════════════════════════════════════════
//
// Every question embeds the Phase 1 answer in its text.
// No naked follow-ups. Fully self-contained.
//
// dependsOn: the collectAs key from Phase 1
// dependsOnValue: the specific value that triggers this question
//                 null = always show regardless of Phase 1 answer
//
// Yields ~10–17 questions depending on Phase 1 path
// ══════════════════════════════════════════════════════════

export const phase2Questions: Phase2Question[] = [

  // ── LAYER 1 — IDENTITY & DIRECTION ──

  // Q1 follow-ups
  {
    id: 'p2_clients_type',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    dependsOn: 'operating_position',
    dependsOnValue: 'independent',
    question: 'As an independent professional, what type of clients do you primarily work with?',
    collectAs: 'clients_type',
  },
  {
    id: 'p2_team_size',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    dependsOn: 'operating_position',
    dependsOnValue: 'company',
    question: 'You operate within a structured team. How many people are involved?',
    collectAs: 'team_size',
  },
  {
    id: 'p2_team_area',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    dependsOn: 'operating_position',
    dependsOnValue: 'company',
    question: 'What is your personal area of responsibility within the team?',
    collectAs: 'personal_area',
  },

  // Q2 follow-ups
  {
    id: 'p2_time_lost',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    dependsOn: 'primary_objective',
    dependsOnValue: 'time',
    question: 'You want to regain time. Where is it currently lost the most?',
    collectAs: 'time_lost_where',
  },
  {
    id: 'p2_result_30days',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    dependsOn: 'primary_objective',
    dependsOnValue: 'results',
    question: 'You want concrete results. What result would matter within the next 30 days?',
    collectAs: 'result_30_days',
  },

  // Q3 follow-ups
  {
    id: 'p2_overload_source',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    dependsOn: 'current_state',
    dependsOnValue: 'overload',
    question: 'You are experiencing overload. What is generating it?',
    collectAs: 'overload_source',
  },
  {
    id: 'p2_blockage_decision',
    strato: 'LAYER 1 — IDENTITY & DIRECTION',
    dependsOn: 'current_state',
    dependsOnValue: 'blockage',
    question: 'You are experiencing blockage. Which decision is not moving?',
    collectAs: 'blockage_decision',
  },

  // ── LAYER 2 — OPERATIONAL CONTEXT ──

  // Q4 follow-up
  {
    id: 'p2_document_formats',
    strato: 'LAYER 2 — OPERATIONAL CONTEXT',
    dependsOn: 'daily_work',
    dependsOnValue: 'documents',
    question: 'Your work revolves around documents. Which formats are most frequent?',
    collectAs: 'document_formats',
  },

  // Q5 follow-ups
  {
    id: 'p2_desktop_context',
    strato: 'LAYER 2 — OPERATIONAL CONTEXT',
    dependsOn: 'usage_environment',
    dependsOnValue: 'desktop',
    question: 'You will use this on desktop. Alone or alongside other tools?',
    collectAs: 'desktop_context',
  },
  {
    id: 'p2_mobile_context',
    strato: 'LAYER 2 — OPERATIONAL CONTEXT',
    dependsOn: 'usage_environment',
    dependsOnValue: 'mobile',
    question: 'You will use this on mobile. On the move or in fixed moments?',
    collectAs: 'mobile_context',
  },

  // Q6 follow-ups
  {
    id: 'p2_deadline_ready',
    strato: 'LAYER 2 — OPERATIONAL CONTEXT',
    dependsOn: 'time_pressure',
    dependsOnValue: 'within_7_days',
    question: 'Your deadline is within 7 days. What must be ready?',
    collectAs: 'deadline_what_ready',
  },
  {
    id: 'p2_postponed',
    strato: 'LAYER 2 — OPERATIONAL CONTEXT',
    dependsOn: 'time_pressure',
    dependsOnValue: 'unresolved',
    question: 'Your priorities remain unresolved. What keeps being postponed?',
    collectAs: 'what_postponed',
  },

  // ── LAYER 4 — EXECUTION PREFERENCES ──

  // Q10 — always shown (no Phase 1 select exists for tools)
  {
    id: 'p2_ai_tools',
    strato: 'LAYER 4 — EXECUTION PREFERENCES',
    dependsOn: '_always',
    dependsOnValue: null,
    question: 'What AI tools do you currently use, if any?',
    collectAs: 'ai_tools_used',
  },
  {
    id: 'p2_non_ai_tools',
    strato: 'LAYER 4 — EXECUTION PREFERENCES',
    dependsOn: '_always',
    dependsOnValue: null,
    question: 'What non-AI tools do you currently use in your daily work?',
    collectAs: 'non_ai_tools_used',
  },

  // Q11 follow-up
  {
    id: 'p2_material_kind',
    strato: 'LAYER 4 — EXECUTION PREFERENCES',
    dependsOn: 'starting_material',
    dependsOnValue: 'yes',
    question: 'You have existing material to work from. What kind of material is it?',
    collectAs: 'material_kind',
  },

  // ── LAYER 5 — DECISION & INTERACTION STYLE ──

  // Q12 follow-up
  {
    id: 'p2_who_influences',
    strato: 'LAYER 5 — DECISION & INTERACTION STYLE',
    dependsOn: 'decision_authority',
    dependsOnValue: 'others',
    question: 'Other people influence the decision. Who are they?',
    collectAs: 'who_influences',
  },

  // Q14 follow-ups
  {
    id: 'p2_challenge_how',
    strato: 'LAYER 5 — DECISION & INTERACTION STYLE',
    dependsOn: 'interaction_style',
    dependsOnValue: 'challenge',
    question: 'You want the system to challenge your thinking. In what way?',
    collectAs: 'challenge_how',
  },
  {
    id: 'p2_support_tone',
    strato: 'LAYER 5 — DECISION & INTERACTION STYLE',
    dependsOn: 'interaction_style',
    dependsOnValue: 'support',
    question: 'You want the system to support your thinking. With what tone?',
    collectAs: 'support_tone',
  },

  // ── LAYER 6 — OUTPUT & VALIDATION ──

  // Q16 follow-ups
  {
    id: 'p2_written_use',
    strato: 'LAYER 6 — OUTPUT & VALIDATION',
    dependsOn: 'primary_output',
    dependsOnValue: 'written',
    question: 'You expect written output. For internal or external use?',
    collectAs: 'written_use',
  },
  {
    id: 'p2_decision_type',
    strato: 'LAYER 6 — OUTPUT & VALIDATION',
    dependsOn: 'primary_output',
    dependsOnValue: 'decision',
    question: 'You expect decisions. Strategic or operational?',
    collectAs: 'decision_type',
  },

  // Q17 — always shown
  {
    id: 'p2_answer_validation',
    strato: 'LAYER 6 — OUTPUT & VALIDATION',
    dependsOn: '_always',
    dependsOnValue: null,
    question: 'You recognise a good answer when — describe briefly.',
    collectAs: 'answer_validation',
  },

  // ── LAYER 7 — FUTURE STATE ──

  // Q19 — always shown (two separate questions)
  {
    id: 'p2_future_work',
    strato: 'LAYER 7 — FUTURE STATE',
    dependsOn: '_always',
    dependsOnValue: null,
    question: 'If this system worked perfectly, 30 days from now — what would be different in your work?',
    collectAs: 'future_work',
  },
  {
    id: 'p2_future_head',
    strato: 'LAYER 7 — FUTURE STATE',
    dependsOn: '_always',
    dependsOnValue: null,
    question: 'If this system worked perfectly, 30 days from now — what would be different in your head?',
    collectAs: 'future_head',
  },

  // Q20 follow-up
  {
    id: 'p2_missing_specify',
    strato: 'LAYER 7 — FUTURE STATE',
    dependsOn: 'missing_factor',
    dependsOnValue: 'yes',
    question: 'You said something important was not addressed. What is it?',
    collectAs: 'missing_specify',
  },
]


// ══════════════════════════════════════════════════════════
// HELPER — Generate Phase 2 questions from Phase 1 data
// ══════════════════════════════════════════════════════════

export function getPhase2Questions(phase1Data: CollectedData): Phase2Question[] {
  return phase2Questions.filter(q => {
    if (q.dependsOn === '_always') return true
    const answer = phase1Data[q.dependsOn]
    if (!answer) return false
    if (Array.isArray(answer)) {
      return answer.includes(q.dependsOnValue || '')
    }
    return answer === q.dependsOnValue
  })
}


// ══════════════════════════════════════════════════════════
// LAYERS (progress dots)
// ══════════════════════════════════════════════════════════

export const strati = [
  'LAYER 1 — IDENTITY & DIRECTION',
  'LAYER 2 — OPERATIONAL CONTEXT',
  'LAYER 3 — CONSTRAINTS & LIMITS',
  'LAYER 4 — EXECUTION PREFERENCES',
  'LAYER 5 — DECISION & INTERACTION STYLE',
  'LAYER 6 — OUTPUT & VALIDATION',
  'LAYER 7 — FUTURE STATE',
  'LAYER 8 — DETERMINISTIC CORE',
]

export const startQuestionId = 'q1_position'


// ══════════════════════════════════════════════════════════
// ASSESSMENT CONTENT (copy)
// ══════════════════════════════════════════════════════════

export const assessmentContent = {
  hero: {
    badge: {
      primary: 'AI-UP',
      secondary: 'SECOND BRAIN™ YOUR STARTING POINT',
    },
    intro: {
      blocks: [
        ['This is where your Second Brain begins.', 'Everything starts here.'],
        ['From this foundation,', 'it takes shape around your work', 'and your goals.'],
      ],
    },
  },
  complete: {
    section: 'PHASE 1 COMPLETE',
    title: ['Done.', 'Phase 1 is complete.'],
    body: 'Create your account to continue building your Second Brain.',
    cta: 'Create account',
  },
}
