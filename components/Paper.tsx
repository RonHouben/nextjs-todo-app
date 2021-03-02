import { Flex, SpaceProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

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
  return (
    <Flex
      flexDir="column"
      padding={padding || '2'}
      shadow={shadow ? 'dark-lg' : undefined}
      rounded={rounded ? 'md' : undefined}
      textAlign={centerContent ? 'center' : undefined}
      justifyContent={centerContent ? 'center' : undefined}
      alignItems={centerContent ? 'center' : undefined}
      style={{
        backdropFilter: 'blur(2.5rem)',
        WebkitBackdropFilter: 'blur(2.5rem)',
      }}
      zIndex={100}
    >
      {children}
    </Flex>
  )
}
