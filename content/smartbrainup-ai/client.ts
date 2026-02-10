// content/smartbrainup-ai/client.ts

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

export type Section = 'dashboard' | 'detail' | 'new' | 'billing' | 'support' | 'account' | 'phase2'

export type SecondBrain = {
  id: any
  num: string
  name: string
  context: string
  status: 'active' | 'setup'
  platforms: string[]
  created: string
  lastActive: string
  pmf: string
  interactions: number
  cardColor: string
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
// Content
// ────────────────────────────────────────────

export const clientContent = {
  user: {
    name: 'Marco Rossi',
    email: 'marco.rossi@company.com',
    method: 'Google OAuth',
    since: 'Jan 2026',
  },

  brains: [] as SecondBrain[],

  billing: [] as BillingItem[],

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
      empty: 'No billing records yet.',
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
