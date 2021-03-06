import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
  colors: {
    primary: { dark: '#34495E', light: '#1ABC9C' },
    secondary: { dark: '#1ABC9C', light: '#34495E' },
    text: {
      dark: '#FFFFFA',
      light: '#34495E',
    },
  },
})

export default theme
