import {
  Box,
  Flex,
  FormLabel,
  Input,
  useColorModeValue,
} from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

interface Props {
  id: string
  checked: boolean
  onToggle: (checked: boolean) => void
}

export default function RoundCheckbox({ id, checked, onToggle }: Props) {
  const borderColor = useColorModeValue('secondary.light', 'secondary.dark')
  const bgColorUnchecked = useColorModeValue('primary.light', 'primary.dark')
  const bgColorChecked = useColorModeValue('secondary.light', 'secondary.dark')

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
        {!checked && (
          <Box bgColor={bgColorUnchecked} h="5" w="5" rounded="full" />
        )}
        {checked && (
          <Flex
            justifyContent="center"
            alignItems="center"
            bgColor={bgColorChecked}
          >
            <Image
              layout="fixed"
              src="/icons/icon-check.svg"
              height="10px"
              width="10px"
            />
          </Flex>
        )}
      </FormLabel>
    </Flex>
  )
}
