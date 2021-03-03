import { Input, InputProps, useColorModeValue } from '@chakra-ui/react'
import React, {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { Key } from '../utils/interfaces/Key.enum'

interface Props {
  value: InputProps['value']
  variant?: InputProps['variant']
  onChange?: (text: string) => void
  onSubmit?: (text: strin) => void
  placeholder?: InputProps['placeholder']
  debounceDelay?: number
  autoSubmit?: boolean
  submitOnEnterKey?: boolean
  submitOnBlur?: boolean
  autoFocus?: boolean
  clearOnEnterKey?: boolean
  type?: InputProps['type']
  width?: InputProps['width']
  disabled?: boolean
}

export default function Textbox({
  value: initialValue,
  placeholder,
  variant,
  width,
  onChange = () => {},
  onSubmit = () => {},
  debounceDelay = 0,
  autoSubmit = false,
  submitOnBlur = false,
  submitOnEnterKey = false,
  autoFocus = false,
  clearOnEnterKey = false,
  type,
  disabled,
}: Props) {
  // set textValue state
  const [textValue, setTextValue] = useState<InputProps['value']>(initialValue)
  const textChanged: boolean = useMemo(() => initialValue !== textValue, [
    textValue,
  ])

  // hooks
  const inputRef = useRef<HTMLInputElement>(null)
  const textColor = useColorModeValue('text.light', 'text.dark')
  const focusBorderColor = useColorModeValue(
    'secondary.light',
    'secondary.dark'
  )
  const [debouncedValue, setDebouncedValue] = useDebounce<InputProps['value']>({
    initialState: textValue,
    wait: debounceDelay,
  })

  // only call onSubmit when the debouncedValue is changed && autoSubmit === true
  useEffect(() => {
    // call external onChange
    if (autoSubmit && debouncedValue && textChanged) {
      // call external onSubmit
      onSubmit(debouncedValue)
    }
  }, [debouncedValue, autoSubmit, debouncedValue, textChanged])

  // update local states
  useEffect(() => {
    setTextValue(initialValue)
    setDebouncedValue(initialValue)
  }, [initialValue])

  // handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    if (textChanged) {
      // update local state
      setDebouncedValue(e.target.value)
      // call external onChange
      onChange(textValue?.toString() || '')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (submitOnEnterKey && e.key === Key.Enter && textValue) {
      // call external onSubmit
      onSubmit(textValue)

      if (clearOnEnterKey) {
        setTextValue('')
        setDebouncedValue('')
      }
    }
  }

  const handleOnBlur = (_e: FocusEvent<HTMLInputElement>) => {
    if (submitOnBlur && textChanged) {
      // call external onSubmit
      onSubmit(textValue)
    }
  }

  return (
    <Input
      width={width || 'sm'}
      ref={inputRef}
      variant={variant}
      isDisabled={disabled}
      color={textColor}
      focusBorderColor={focusBorderColor}
      placeholder={placeholder}
      value={textValue}
      type={type}
      fontSize="md"
      userSelect="all"
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleOnBlur}
      onFocus={() => inputRef.current?.select()}
      autoFocus={autoFocus}
      disabled={disabled}
      _placeholder={{
        color: textColor,
      }}
    />
  )
}
