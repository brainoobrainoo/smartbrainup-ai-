// lib/cardColors.ts

export const CARD_COLORS: { key: string; from: string; to: string }[] = [
  { key: 'default', from: '#e0e0e0', to: '#aeaeae' },
  { key: 'slate', from: '#c8cfd8', to: '#8f99a8' },
  { key: 'ocean', from: '#b8d4e3', to: '#7ba3bd' },
  { key: 'sage', from: '#c2d4c2', to: '#8aaa8a' },
  { key: 'sand', from: '#ddd5c8', to: '#b5a898' },
  { key: 'rose', from: '#dfc8cb', to: '#b89a9f' },
  { key: 'lavender', from: '#cfc8df', to: '#a89ab8' },
  { key: 'charcoal', from: '#6a6a6a', to: '#3a3a3a' },
]

export function getColorByKey(key: string) {
  return CARD_COLORS.find((c) => c.key === key) || CARD_COLORS[0]
}
