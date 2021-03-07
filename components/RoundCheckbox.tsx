import { CheckIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  FormLabel,
  Input,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'

interface Props {
  id: string
  checked: boolean
  onToggle: (checked: boolean) => void
}

export default function RoundCheckbox({ id, checked, onToggle }: Props) {
  const borderColor = useColorModeValue('secondary.light', 'secondary.dark')
  const bgColor = useColorModeValue('primary.light', 'primary.dark')

  const handleChange = () => {
    onToggle(!checked)
  }

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      padding="3"
      tabIndex={0}
      onKeyPress={handleChange}
    >
      <Input
        type="checkbox"
        id={id + '-rounded-checkbox'}
        hidden
        checked={checked}
        onChange={handleChange}
      />
      <FormLabel
        display="flex"
        position="relative"
        margin="0"
        title={checked ? 'Toggle Completed' : 'Complete Todo'}
        htmlFor={id + 'rounded-checkbox'}
        rounded="full"
        h="6"
        w="6"
        justifyContent="center"
        alignItems="center"
        userSelect="none"
        cursor="pointer"
        bgColor={borderColor}
        onClick={handleChange}
      >
        {!checked && <Box bgColor={bgColor} h="5" w="5" rounded="full" />}
        {checked && <CheckIcon color={bgColor} h="4" w="4" />}
      </FormLabel>
    </Flex>
  )
}
