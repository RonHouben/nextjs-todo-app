import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useColorMode } from '@chakra-ui/react'
import firebase from 'firebase/app'
import React from 'react'
import IconButton from '../components/IconButton'

export default function ThemeSwitcherButton() {
  const { colorMode, toggleColorMode } = useColorMode()

  const handleSwitchTheme = (newTheme: typeof colorMode) => {
    // log analytics event
    firebase.analytics().logEvent('switched_theme', {
      before: colorMode,
      after: newTheme,
    })
    // toggle color mode
    toggleColorMode()
  }

  return (
    <IconButton
      as={colorMode === 'light' ? MoonIcon : SunIcon}
      title={`Switch to ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
      ariaLabel={`Switch to ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
      onClick={() =>
        colorMode === 'light'
          ? handleSwitchTheme('dark')
          : handleSwitchTheme('light')
      }
    />
  )
}
