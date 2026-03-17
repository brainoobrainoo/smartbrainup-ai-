// content/smartbrainup-ai/phases/phase3.ts
// ═══════════════════════════════════════════════════════════
// PHASE 3 — FREE PROJECT DESCRIPTION
// AI-UP SECOND BRAIN™
// ═══════════════════════════════════════════════════════════
//
// Free text input — no questions, no options.
// The client describes their specific project.
// Voice input transcribed to text.
// Saved to responses.phase3 in Supabase via UPDATE.
// ═══════════════════════════════════════════════════════════

export const phase3Content = {
  intro: {
    message: `This is the last step.\n\nTell me about your specific project — what you are working on, what you want to achieve, and any context you think is relevant.\n\nThere is no right or wrong format. Write freely, speak if you prefer. This is your space.`,
    badge: 'PHASE 3 — YOUR PROJECT',
  },
  placeholder: 'Describe your project...',
  disclaimer: 'Everything you write here is private and used only to build your Second Brain.',
  complete: {
    message: 'Your project description has been saved.',
    cta: 'Done',
  },
}
