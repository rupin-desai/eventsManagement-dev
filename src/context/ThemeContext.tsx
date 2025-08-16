import React, { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

// Theme configuration interface
export interface ThemeContextType {
  colors: {
    primary: string
    primaryLight: string
    primaryDark: string
    secondary: string
    secondaryLight: string
    secondaryDark: string
  }
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Color definitions with variations
  const colors = {
    primary: '#FBD336',       // Yellow
    primaryLight: '#fde68a',  // Lighter yellow
    primaryDark: '#d4a61c',   // Darker yellow
    secondary: '#BB1F2F',     // Red
    secondaryLight: '#dc2f41', // Lighter red
    secondaryDark: '#8b1722', // Darker red
  }

  const contextValue: ThemeContextType = {
    colors,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Export theme context
export { ThemeContext }

// Default export
export default ThemeProvider