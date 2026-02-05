// content/smartbrainup-ai/client.ts

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

export type Section = 'dashboard' | 'detail' | 'new' | 'billing' | 'support' | 'account'

export type SecondBrain = {
  id: number
  num: string
  name: string
  context: string
  status: 'active' | 'setup'
  platforms: string[]
  created: string
  lastActive: string
  pmf: string
  interactions: number
}

export type BillingItem = {
  id: number
  date: string
  item: string
  amount: string
  status: string
}

export type PricingPlan = {
  name: string
  brains: string
  price: string
  lines: string[]
}

// ────────────────────────────────────────────
// Mock data (→ Supabase in production)
// ────────────────────────────────────────────

export const clientContent = {
  user: {
    name: 'Marco Rossi',
    email: 'marco.rossi@company.com',
    method: 'Google OAuth',
    since: 'Jan 2026',
  },

  brains: [
    {
      id: 1,
      num: '01',
      name: 'Strategic Planning',
      context:
        'Corporate strategy and decision-making for Q1–Q2 2026. Focus on market expansion in DACH region and partnership development.',
      status: 'active',
      platforms: ['Claude', 'GPT', 'Gemini'],
      created: '15 Jan 2026',
      lastActive: '3 Feb 2026',
      pmf: 'PMF™ v2.1',
      interactions: 47,
    },
    {
      id: 2,
      num: '02',
      name: 'Legal Compliance',
      context:
        'GDPR compliance review and contract analysis for B2B partnerships across EU markets.',
      status: 'active',
      platforms: ['Claude', 'GPT'],
      created: '22 Jan 2026',
      lastActive: '2 Feb 2026',
      pmf: 'PMF™ v2.1',
      interactions: 23,
    },
    {
      id: 3,
      num: '03',
      name: 'Team Onboarding',
      context:
        'New hire integration process for technical roles. Knowledge transfer acceleration.',
      status: 'setup',
      platforms: ['Claude'],
      created: '1 Feb 2026',
      lastActive: '1 Feb 2026',
      pmf: 'Pending',
      interactions: 3,
    },
  ] as SecondBrain[],

  billing: [
    {
      id: 1,
      date: '15 Jan 2026',
      item: 'AI-UP Second Brain™ — 3 Second Brains',
      amount: '€4,997.00',
      status: 'Paid',
    },
    {
      id: 2,
      date: '1 Feb 2026',
      item: 'AI-UP Second Brain™ — Single Second Brain',
      amount: '€1,997.00',
      status: 'Paid',
    },
  ] as BillingItem[],

  plans: [
    {
      name: 'Single',
      brains: '1 Second Brain',
      price: '€1,997',
      lines: [
        'One personal Second Brain.',
        'Persistent context.',
        'Execution across five AI platforms.',
      ],
    },
    {
      name: 'Team',
      brains: '3 Second Brains',
      price: '€4,997',
      lines: [
        'Three Second Brains',
        'with separated contexts.',
        'Suitable for small teams.',
      ],
    },
    {
      name: 'Department',
      brains: '5 Second Brains',
      price: '€7,997',
      lines: [
        'Five Second Brains',
        'with separated contexts.',
        'Suitable for roles and functions.',
      ],
    },
    {
      name: 'Organization',
      brains: '10 Second Brains',
      price: '€14,997',
      lines: [
        'Ten Second Brains',
        'with separated contexts.',
        'Suitable for cross-team operations.',
      ],
    },
  ] as PricingPlan[],

  enterprise: {
    name: 'Enterprise',
    brains: 'Unlimited Second Brains',
    price: 'Custom',
    lines: [
      'Organization-wide deployment.',
      'Multiple users and domains.',
      'Governance, compliance and integration.',
    ],
  },

  nav: [
    { key: 'dashboard' as const, label: 'Dashboard' },
    { key: 'billing' as const, label: 'Billing' },
    { key: 'support' as const, label: 'Support' },
    { key: 'account' as const, label: 'Account' },
  ],

  sections: {
    dashboard: {
      label: 'Your Second Brains',
    },
    detail: {
      context: {
        label: 'Context',
        title: 'Project context',
      },
      execution: 'Execution',
      activity: 'Activity',
    },
    newBrain: {
      label: 'Add Second Brain',
    },
    billing: {
      label: 'Billing',
      title: 'Licenses & Invoices',
      body: [
        'All purchases related to the AI-UP Second Brain™ method.',
        'Each license is tied to one or more Second Brains.',
      ],
    },
    support: {
      label: 'Support',
      title: 'Technical assistance',
      body: [
        'AI-guided support for your Second Brain setup,',
        'platform execution and method-related questions.',
      ],
      welcome: 'Welcome to AI-UP Second Brain™ support. How can I help you today?',
    },
    account: {
      label: 'Account',
      title: 'Your information',
      body: [
        'Manage your identity and access method.',
        'Authentication is handled via Magic Link or OAuth provider.',
      ],
    },
  },
}
