import { BorderProps, Flex, SpaceProps } from '@chakra-ui/react'
import { ReactNode, useContext } from 'react'
import {
  IUserAgentContext,
  UserAgentContext,
} from '../providers/UserAgentProvider'

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
  const { isFirefox } = useContext<IUserAgentContext>(UserAgentContext)

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
      background={isFirefox ? 'green' : undefined}
      position="relative"
      // The following is needed to make react-beautiful-dnd work with a backdropFilter
      _before={
        !isFirefox
          ? {
              content: '""',
              backdropFilter: 'blur(2.5rem)',
              WebkitBackdropFilter: 'blur(2.5rem)',
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              rounded: rounded ? defaultRounded : undefined,
            }
          : undefined
      }
    >
      {children}
    </Flex>
  )
}
