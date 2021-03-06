import {
  BorderProps,
  Flex,
  SpaceProps,
  useColorModeValue,
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { useUserAgent } from '../hooks/useUserAgent'

interface Props {
  children: ReactNode
  shadow?: boolean
  rounded?: boolean
  centerContent?: boolean
  bgColor?: string
  padding?: SpaceProps['padding']
}
export default function Paper({
  children,
  shadow,
  rounded,
  centerContent,
  padding,
}: Props) {
  const defaultRounded: BorderProps['rounded'] = 'lg'
  const bgColor = useColorModeValue('primary.light', 'primary.dark')
  const { isFirefox } = useUserAgent()

  return (
    <Flex
      flexDir="column"
      padding={padding || '2'}
      shadow={shadow ? 'dark-lg' : undefined}
      rounded={rounded ? defaultRounded : undefined}
      textAlign={centerContent ? 'center' : undefined}
      justifyContent={centerContent ? 'center' : undefined}
      alignItems={centerContent ? 'center' : undefined}
      zIndex={100}
      position="relative"
      // The following is needed to make react-beautiful-dnd work with a backdropFilter
      background={isFirefox ? bgColor : undefined}
      style={
        !isFirefox
          ? {
              backdropFilter: 'blur(2.5rem)',
              WebkitBackdropFilter: 'blur(2.5rem)',
            }
          : undefined
      }
    >
      {children}
    </Flex>
  )
}
