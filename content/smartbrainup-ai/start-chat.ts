// content/smartbrainup-ai/start-chat.ts
// ═══════════════════════════════════════════════════════════
// PUBLIC CHAT — /start
// Text content separated from code.
// Change language here. Page component stays untouched.
// ═══════════════════════════════════════════════════════════

export const startChatContent = {
  welcomeLine1: 'Welcome.',
  welcomeLine2: 'Ask me anything about the method.',
  welcomeLine3: "When you've seen enough, tap Build.",
  quickQuestions: [
    'What is AI-UP Second Brain?',
    'How does it work?',
    'What do I get?',
    'How is it different from ChatGPT?',
    'Do I need technical skills?',
    'Which AI platforms does it support?',
    'How much does it cost?',
    'Is my data protected?',
  ],
  welcomeLine4: 'Or ask anything you want.',
  placeholder: 'Ask your question...',
  buildButton: 'build',
  disclaimer: 'AI-UP Second Brain\u2122',

  // ── Build mode (Phase 1 questionnaire inside chat) ──
  buildIntro: 'Phase 1 —\na short sequence of questions to start shaping the first direction\nof your Second Brain.',
  buildComplete: 'Done',
  buildCompleteDetail: 'Phase 1 complete',
  buildCompleteSub: 'Your initial context has been captured',
  buildContinue: 'Continue',
  buildActivateSub: 'Your context has been captured. Activate your Second Brain to continue.',
  buildActivate: 'Activate',

  // ── Phase 2 (tailored assessment inside chat) ──
  phase2Intro: 'Phase 2 —\ntailoring your Second Brain\naround your constraints, decisions\nand working style.',
  phase2Complete: 'Done',
  phase2CompleteDetail: 'Phase 2 complete',
  phase2CompleteSub: 'All context layers have been captured',

  // ── Free chat (project description after Phase 2) ──
  freeChatPrompt: 'The structure is set.\nNow tell us about your specific project in your own words.\n\nThe more detail you provide, the more precise and effective your Second Brain will be.\nYou can type or use the microphone.\n\nWhen you feel you\'ve explained enough, tap Build.',
  finalComplete: 'Done\nWe\'ve received everything\n\nYour Second Brain will be active within 48 hours.\nWe\'ll contact you if we need clarification or additional details.',
}
