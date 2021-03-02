import { Input, useColorModeValue } from '@chakra-ui/react'
import React, {
  ChangeEvent,
  FocusEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { Key } from '../utils/interfaces/Key.enum'

interface Props {
  value: string
  onChange?: (text: string) => void
  onSubmit?: (text: string) => void
  placeholder?: string
  debounceDelay?: number
  autoSubmit?: boolean
  submitOnEnterKey?: boolean
  submitOnBlur?: boolean
  autoFocus?: boolean
  clearOnEnterKey?: boolean
  className?: string
  type?: InputHTMLAttributes<HTMLInputElement>['type']
  disabled?: boolean
}

export default function Textbox({
  value: initialValue = '',
  placeholder,
  onChange = () => {},
  onSubmit = () => {},
  debounceDelay = 0,
  autoSubmit = false,
  submitOnBlur = false,
  submitOnEnterKey = false,
  autoFocus = false,
  clearOnEnterKey = false,
  className,
  type,
  disabled,
}: Props) {
  // set textValue state
  const [textValue, setTextValue] = useState<string>(initialValue)
  const textChanged: boolean = useMemo(() => initialValue !== textValue, [
    textValue,
  ])

  // hooks
  const inputRef = useRef<HTMLInputElement>(null)
  const textColor = useColorModeValue('text.light', 'text.dark')
  const [debouncedValue, setDebouncedValue] = useDebounce<string>({
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
      onChange(textValue)
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
      ref={inputRef}
      variant="unstyled"
      isDisabled={disabled}
      color={textColor}
      className={className}
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
