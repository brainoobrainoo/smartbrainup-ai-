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
      { label: 'Less than 10 minutes', value: 'under_10', nextId: 'q9_execution' },
      { label: '10–30 minutes', value: '10_to_30', nextId: 'q9_execution' },
      { label: 'More than 30 minutes', value: 'over_30', nextId: 'q9_execution' },
    ],
  },

  // ============================================
  // LAYER 4 — EXECUTION PREFERENCES
  // ============================================

  'q9_execution': {
    id: 'q9_execution',
    strato: 'LAYER 4 — EXECUTION PREFERENCES',
    topic: 'EXECUTION MODE',
    question: 'You want the system to mainly',
    collectAs: 'execution_mode',
    type: 'single',
    options: [
      { label: 'Propose options\nand alternatives', value: 'propose_options', nextId: 'q10_setup' },
      { label: 'Execute clear\ninstructions', value: 'execute_instructions', nextId: 'q10_setup' },
      { label: 'Drive a single\nrecommended path', value: 'single_path', nextId: 'q10_setup' },
    ],
  },

  'q10_setup': {
    id: 'q10_setup',
    strato: 'LAYER 4 — EXECUTION PREFERENCES',
    topic: 'WORKING SETUP',
    question: 'Your current working setup is mainly',
    collectAs: 'working_setup',
    type: 'single',
    options: [
      { label: 'AI-first (you already use\nAI tools regularly)', value: 'ai_first', nextId: 'q11_material' },
      { label: 'Tool-driven (documents,\nemail, project tools)', value: 'tool_driven', nextId: 'q11_material' },
      { label: 'Minimal (few tools,\nsimple setup)', value: 'minimal', nextId: 'q11_material' },
    ],
  },

  'q11_material': {
    id: 'q11_material',
    strato: 'LAYER 4 — EXECUTION PREFERENCES',
    topic: 'STARTING MATERIAL',
    question: 'Right now, you are starting from',
    collectAs: 'starting_material',
    type: 'single',
    options: [
      { label: 'Structured material', value: 'structured', nextId: 'q12_authority' },
      { label: 'Unstructured material', value: 'unstructured', nextId: 'q12_authority' },
      { label: 'No material at all', value: 'no_material', nextId: 'q12_authority' },
    ],
  },

  // ============================================
  // LAYER 5 — DECISION & INTERACTION STYLE
  // ============================================

  'q12_authority': {
    id: 'q12_authority',
    strato: 'LAYER 5 — DECISION & INTERACTION STYLE',
    topic: 'DECISION AUTHORITY',
    question: 'When using this system, decisions are made by',
    collectAs: 'decision_authority',
    type: 'single',
    options: [
      { label: 'You alone', value: 'alone', nextId: 'q13_format' },
      { label: 'You together\nwith others', value: 'together', nextId: 'q13_format' },
      { label: 'Someone else', value: 'someone_else', nextId: 'q13_format' },
    ],
  },

  'q13_format': {
    id: 'q13_format',
    strato: 'LAYER 5 — DECISION & INTERACTION STYLE',
    topic: 'RESPONSE FORMAT',
    question: 'Answers work best for you when they are',
    collectAs: 'response_format',
    type: 'single',
    options: [
      { label: 'Short and direct', value: 'short_direct', nextId: 'q14_interaction' },
      { label: 'Structured\nand articulated', value: 'structured_articulated', nextId: 'q14_interaction' },
    ],
  },

  'q14_interaction': {
    id: 'q14_interaction',
    strato: 'LAYER 5 — DECISION & INTERACTION STYLE',
    topic: 'INTERACTION STYLE',
    question: 'You want the system to',
    collectAs: 'interaction_style',
    type: 'single',
    options: [
      { label: 'Challenge\nyour thinking', value: 'challenge', nextId: 'q15_thinking' },
      { label: 'Support\nyour thinking', value: 'support', nextId: 'q15_thinking' },
    ],
  },

  'q15_thinking': {
    id: 'q15_thinking',
    strato: 'LAYER 5 — DECISION & INTERACTION STYLE',
    topic: 'THINKING STYLE',
    question: 'The system should mainly think in a',
    collectAs: 'thinking_style',
    type: 'single',
    options: [
      { label: 'Analytical way', value: 'analytical', nextId: 'q16_output' },
      { label: 'Creative way', value: 'creative', nextId: 'q16_output' },
      { label: 'Balanced way', value: 'balanced', nextId: 'q16_output' },
    ],
  },

  // ============================================
  // LAYER 6 — OUTPUT & VALIDATION
  // ============================================

  'q16_output': {
    id: 'q16_output',
    strato: 'LAYER 6 — OUTPUT & VALIDATION',
    topic: 'PRIMARY OUTPUT',
    question: 'Most of the time, you expect',
    collectAs: 'primary_output',
    type: 'single',
    options: [
      { label: 'A written output', value: 'written_output', nextId: 'q17_quality' },
      { label: 'A concrete decision', value: 'concrete_decision', nextId: 'q17_quality' },
    ],
  },

  'q17_quality': {
    id: 'q17_quality',
    strato: 'LAYER 6 — OUTPUT & VALIDATION',
    topic: 'ANSWER QUALITY',
    question: 'A good answer is one that primarily',
    collectAs: 'answer_quality',
    type: 'single',
    options: [
      { label: 'Leads immediately\nto action', value: 'immediate_action', nextId: 'q18_nextstep' },
      { label: 'Reduces\nmental noise', value: 'reduce_noise', nextId: 'q18_nextstep' },
      { label: 'Clarifies priorities', value: 'clarify_priorities', nextId: 'q18_nextstep' },
      { label: 'Creates a sense\nof control', value: 'sense_control', nextId: 'q18_nextstep' },
      { label: 'Can be\nreused later', value: 'reusable', nextId: 'q18_nextstep' },
    ],
  },

  'q18_nextstep': {
    id: 'q18_nextstep',
    strato: 'LAYER 6 — OUTPUT & VALIDATION',
    topic: 'NEXT STEP',
    question: 'After a good answer, you expect',
    collectAs: 'next_step',
    type: 'single',
    options: [
      { label: 'A clear next step', value: 'clear_step', nextId: 'q19_change' },
      { label: 'A follow-up question', value: 'followup_question', nextId: 'q19_change' },
      { label: 'Both', value: 'both', nextId: 'q19_change' },
    ],
  },

  // ============================================
  // LAYER 7 — FUTURE STATE
  // ============================================

  'q19_change': {
    id: 'q19_change',
    strato: 'LAYER 7 — FUTURE STATE',
    topic: 'DESIRED CHANGE',
    question: 'In 30 days, the most important change should be',
    collectAs: 'desired_change',
    type: 'single',
    options: [
      { label: 'Clearer priorities', value: 'clearer_priorities', nextId: 'q20_missing' },
      { label: 'Faster execution', value: 'faster_execution', nextId: 'q20_missing' },
      { label: 'Better decisions', value: 'better_decisions', nextId: 'q20_missing' },
      { label: 'Less mental noise', value: 'less_noise', nextId: 'q20_missing' },
      { label: 'Stronger sense\nof control', value: 'stronger_control', nextId: 'q20_missing' },
    ],
  },

  'q20_missing': {
    id: 'q20_missing',
    strato: 'LAYER 7 — FUTURE STATE',
    topic: 'ANYTHING MISSING',
    question: 'Right now, something important is',
    collectAs: 'anything_missing',
    type: 'single',
    options: [
      { label: 'Already covered', value: 'covered', nextId: 'd1_success' },
      { label: 'Missing', value: 'missing', nextId: 'd1_success' },
    ],
  },

  // ============================================
  // LAYER 8 — DETERMINISTIC CORE
  // ============================================

  'd1_success': {
    id: 'd1_success',
    strato: 'LAYER 8 — DETERMINISTIC CORE',
    topic: 'SUCCESS DEFINITION',
    question: 'An answer is successful when it',
    collectAs: 'success_definition',
    type: 'single',
    options: [
      { label: 'Forces a decision', value: 'force_decision', nextId: 'd2_speed' },
      { label: 'Triggers\nimmediate action', value: 'trigger_action', nextId: 'd2_speed' },
      { label: 'Creates a sense\nof control', value: 'sense_control', nextId: 'd2_speed' },
      { label: 'Reduces\nmental noise', value: 'reduce_noise', nextId: 'd2_speed' },
      { label: 'Produces a\nreusable asset', value: 'reusable_asset', nextId: 'd2_speed' },
    ],
  },

  'd2_speed': {
    id: 'd2_speed',
    strato: 'LAYER 8 — DETERMINISTIC CORE',
    topic: 'SPEED OR PRECISION',
    question: 'You prefer answers that are',
    collectAs: 'speed_or_precision',
    type: 'single',
    options: [
      { label: 'Immediately usable,\neven if imperfect', value: 'speed', nextId: 'd3_guidance' },
      { label: 'More precise,\neven if slower', value: 'precision', nextId: 'd3_guidance' },
      { label: 'Adaptive to context', value: 'adaptive', nextId: 'd3_guidance' },
    ],
  },

  'd3_guidance': {
    id: 'd3_guidance',
    strato: 'LAYER 8 — DETERMINISTIC CORE',
    topic: 'GUIDANCE STYLE',
    question: 'When progress slows, the system should',
    collectAs: 'guidance_style',
    type: 'single',
    options: [
      { label: 'Force a choice', value: 'force_choice', nextId: 'd4_failure' },
      { label: 'Reduce options', value: 'reduce_options', nextId: 'd4_failure' },
      { label: 'Ask a sharper\nquestion', value: 'sharper_question', nextId: 'd4_failure' },
      { label: 'Allow one\nmore step', value: 'allow_step', nextId: 'd4_failure' },
    ],
  },

  'd4_failure': {
    id: 'd4_failure',
    strato: 'LAYER 8 — DETERMINISTIC CORE',
    topic: 'HARD FAILURE',
    question: 'An answer immediately fails if it is',
    collectAs: 'hard_failure',
    type: 'single',
    options: [
      { label: 'Too long', value: 'too_long', nextId: null },
      { label: 'Too theoretical', value: 'too_theoretical', nextId: null },
      { label: 'Too vague', value: 'too_vague', nextId: null },
      { label: 'Full of alternatives', value: 'full_alternatives', nextId: null },
      { label: 'Not leading\nto action', value: 'no_action', nextId: null },
    ],
  },

}


// ══════════════════════════════════════════════════════════
// LAYERS (progress reference)
// ══════════════════════════════════════════════════════════

export const phase2Strati = [
  'LAYER 3 — CONSTRAINTS & LIMITS',
  'LAYER 4 — EXECUTION PREFERENCES',
  'LAYER 5 — DECISION & INTERACTION STYLE',
  'LAYER 6 — OUTPUT & VALIDATION',
  'LAYER 7 — FUTURE STATE',
  'LAYER 8 — DETERMINISTIC CORE',
]

export const phase2StartQuestionId = 'q7_constraint'


// ══════════════════════════════════════════════════════════
// CONTENT (copy)
// ══════════════════════════════════════════════════════════

export const phase2Content = {
  header: {
    badge: {
      primary: 'AI-UP SECOND BRAIN™',
      secondary: 'TAILORED EXECUTION',
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
