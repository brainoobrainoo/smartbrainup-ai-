'use client'

import { createContext, useContext } from 'react'

type Theme = 'dark' | 'light'

export const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({
  theme: 'light' as Theme,
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)
