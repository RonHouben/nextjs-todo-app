import {
  IconButton as ChakraIconButton,
  IconButtonProps as ChakraIconButtonProps,
  useColorModeValue,
} from '@chakra-ui/react'

interface Props {
  as: ChakraIconButtonProps['as']
  title: ChakraIconButtonProps['title']
  ariaLabel: ChakraIconButtonProps['aria-label']
  size?: ChakraIconButtonProps['size']
  onClick: () => void
}

export default function IconButton({
  as,
  title,
  ariaLabel,
  size,
  onClick,
}: Props) {
  const iconColor = useColorModeValue('secondary.light', 'secondary.dark')

  return (
    <ChakraIconButton
      as={as}
      title={title}
      aria-label={ariaLabel}
      size={size || 'md'}
      variant="unstyled"
      tabIndex={0}
      rounded="full"
      cursor="pointer"
      color={iconColor}
      borderColor={iconColor}
      _focus={{
        borderColor: iconColor,
        borderWidth: '3px',
      }}
      onClick={onClick}
      onKeyPress={onClick}
    />
  )
}
