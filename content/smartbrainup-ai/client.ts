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
// Static content (non-user-specific)
// ────────────────────────────────────────────

export const clientContent = {
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
      empty: 'No purchases yet. Your billing history will appear here after your first Second Brain.',
    },
    support: {
      label: 'Support',
      title: 'Technical assistance',
      welcome: 'Welcome to AI-UP Second Brain™ support. How can I help you today?',
    },
    account: {
      label: 'Account',
      title: 'Your information',
    },
  },
}
