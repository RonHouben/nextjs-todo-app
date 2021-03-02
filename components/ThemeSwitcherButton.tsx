import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import firebase from 'firebase/app'
import React from 'react'

export default function ThemeSwitcherButton() {
  const { colorMode, toggleColorMode } = useColorMode()
  const iconColor = useColorModeValue('secondary.light', 'secondary.dark')

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
      title={`Switch to ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
      aria-label={`Switch to ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
      variant="outline"
      size="lg"
      isRound
      color={iconColor}
      borderColor={iconColor}
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      onClick={() =>
        colorMode === 'light'
          ? handleSwitchTheme('dark')
          : handleSwitchTheme('light')
      }
    />
  )
}
