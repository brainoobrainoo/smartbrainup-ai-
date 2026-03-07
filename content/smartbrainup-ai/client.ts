// content/smartbrainup-ai/client.ts

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

export type Section = 'dashboard' | 'detail' | 'new' | 'billing' | 'support' | 'account' | 'phase2' | 'subscription'

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
    { key: 'subscription' as const, label: 'Generic AI' },
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
    subscription: {
      label: 'Generic AI',
      badge: 'GENERIC AI',
      title: 'Use AI beyond your Second Brain.',
      intro: [
        'Your Second Brain is your dedicated system. It operates on your context, deterministically.',
        'Generic AI gives you access to advanced reasoning tools outside that structure — for open-ended research, exploration, and general-purpose work.',
      ],
      launch: {
        label: 'LAUNCH PERIOD',
        body: 'Each new Second Brain license includes two months of complimentary Basic subscription.',
        note: 'After two months, an active subscription is required to continue using Generic AI.',
      },
      plans: [
        {
          name: 'Basic',
          subtitle: 'Essential Access',
          monthly: '€19',
          yearly: '€190',
          badge: null,
          features: [
            'Generic AI access',
            'Core frameworks included',
            'Standard model',
            'Controlled usage limits',
          ],
        },
        {
          name: 'PRO',
          subtitle: 'Advanced Layer',
          monthly: '€49',
          yearly: '€490',
          badge: null,
          features: [
            'Advanced model',
            'Higher limits',
            'Priority execution',
          ],
        },
        {
          name: 'ELITE',
          subtitle: 'Executive',
          monthly: '€129',
          yearly: '€1,290',
          badge: null,
          features: [
            'Top-tier model',
            'Extended limits',
            'Highest priority performance',
          ],
        },
      ],
      comparison: {
        label: 'SECOND BRAIN vs GENERIC AI',
        columns: ['Generic AI', 'Second Brain'],
        rows: [
          { label: 'Advanced reasoning tools', generic: true, secondBrain: true },
          { label: 'Dedicated system prompt', generic: false, secondBrain: true },
          { label: 'Custom operational modules', generic: false, secondBrain: true },
          { label: 'Persistent context', generic: false, secondBrain: true },
          { label: 'Deterministic architecture', generic: false, secondBrain: true },
        ],
      },
      principle: [
        'The Second Brain is a licensed structure. It is created once and remains fixed.',
        'Generic AI is a continuous operational layer. It requires an active subscription.',
      ],
    },
  },
}
