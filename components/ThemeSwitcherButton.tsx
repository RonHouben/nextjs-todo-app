import React from 'react'
import { useTheme } from 'next-themes'
import { Key } from '../interfaces/Key.enum'
import IconButton from './IconButton'

export default function ThemeSwitcherButton() {
  const { theme, setTheme } = useTheme()

  return (
    <React.Fragment>
      {theme === 'light' && (
        <IconButton
          src='/images/icon-moon.svg'
          size='medium'
          onClick={() => setTheme('dark')}
          onKeyPress={(e) => (e.key === Key.Spacebar ? setTheme('dark') : null)}
        />
      )}
      {theme === 'dark' && (
        <IconButton
          src='/images/icon-sun.svg'
          size='large'
          onClick={() => setTheme('light')}
          onKeyPress={(e) =>
            e.key === Key.Spacebar ? setTheme('light') : null
          }
        />
      )}
    </React.Fragment>
  )
}
