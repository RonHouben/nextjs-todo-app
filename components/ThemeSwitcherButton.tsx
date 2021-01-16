import React from 'react'
import { useTheme } from 'next-themes'
import IconButton from './IconButton'

export default function ThemeSwitcherButton() {
  const { theme, setTheme } = useTheme()

  return (
    <React.Fragment>
      {theme === 'light' && (
        <IconButton
          src='/icons/icon-moon.svg'
          size='xl'
          onClick={() => setTheme('dark')}
        />
      )}
      {theme === 'dark' && (
        <IconButton
          src='/icons/icon-sun.svg'
          size='xl'
          onClick={() => setTheme('light')}
        />
      )}
    </React.Fragment>
  )
}
