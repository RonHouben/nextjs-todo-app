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
    keppel: {
      main: '#3BBA9C',
      transparent: '#3BBA9CBB',
    },
    gunMetal: '#2E3047',
    outSpace: '#43455C',
    arsenic: '#3C3F58',
    rhythm: '#707793',
  },
})

export default theme
