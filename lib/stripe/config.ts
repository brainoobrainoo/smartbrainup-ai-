// Stripe Configuration — SmartBrainUp.ai
// All IDs are TEST mode

export const STRIPE_CONFIG = {
  // Licensing products → credits mapping
  licensing: {
    'prod_U40ywZprhyoNqt': { name: 'Single', credits: 1 },
    'prod_U4104wOi7cIgZz': { name: 'Team', credits: 3 },
    'prod_U43LvlaWFPIouJ': { name: 'Department', credits: 5 },
    'prod_U43M6bZvYWCWe9': { name: 'Organization', credits: 10 },
  },

  // Subscription price_ids → plan mapping
  subscriptions: {
    'price_1T5t0oAs5Tihp760PXwJ0DpK': { plan: 'basic', interval: 'month' },
    'price_1T5t2yAs5Tihp760a855XpAH': { plan: 'basic', interval: 'year' },
    'price_1T5vpeAs5Tihp760BsjvWw5e': { plan: 'pro', interval: 'month' },
    'price_1T5vrbAs5Tihp760qsaPAZ8G': { plan: 'pro', interval: 'year' },
    'price_1T5vt3As5Tihp760qjGOu0vc': { plan: 'elite', interval: 'month' },
    'price_1T5vu2As5Tihp760zMZ9fqe3': { plan: 'elite', interval: 'year' },
  },

  // Basic trial auto-activation after licensing
  basicTrialPriceId: 'price_1T5t0oAs5Tihp760PXwJ0DpK',
  basicTrialDays: 60,

  // Upgrade discount (PRO/ELITE within 48h of licensing)
  upgradeWindowHours: 48,
} as const

// Type helpers
export type LicensingProductId = keyof typeof STRIPE_CONFIG.licensing
export type SubscriptionPriceId = keyof typeof STRIPE_CONFIG.subscriptions
