import {
  ChangeEvent,
  KeyboardEvent,
  FocusEvent,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useDebounce } from "../hooks/useDebounce";
import { Key } from "../interfaces/Key.enum";

interface Props {
  value?: string;
  onChange: (newTitle: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  autoSubmit?: boolean;
  submitOnEnterKey: boolean;
  submitOnBlur?: boolean;
  autoFocus?: boolean;
  clearOnEnterKey: boolean;
}

export default function Textbox({
  value: initialValue = "",
  placeholder,
  onChange,
  debounceDelay = 3000,
  autoSubmit = false,
  submitOnBlur = false,
  submitOnEnterKey = false,
  autoFocus = false,
  clearOnEnterKey = false,
}: Props) {
  // set textValue state
  const [textValue, setTextValue] = useState<string>(initialValue);
  const textChanged: boolean = useMemo(() => initialValue !== textValue, [
    textValue,
  ]);

  // hooks
  const [debouncedValue, setDebouncedValue] = useDebounce<string>({
    initialState: textValue,
    wait: debounceDelay,
  });

  // only call onChange when the debouncedValue is changed && autoSubmit === true
  useEffect(() => {
    if (autoSubmit && debouncedValue && textChanged) {
      onChange(debouncedValue);
    }
  }, [onChange, debouncedValue]);

  // update local states
  useEffect(() => {
    setTextValue(initialValue);
  }, [initialValue]);

  // handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // update local state
    setTextValue(e.target.value);

    if (autoSubmit && textChanged) {
      // set the debounced state
      setDebouncedValue(e.target.value);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (submitOnEnterKey && e.key === Key.Enter && textChanged) {
      // call external onChange
      onChange(textValue);

      if (clearOnEnterKey) {
        setTextValue("");
      }
    }
  };

  const handleOnBlur = (_e: FocusEvent<HTMLInputElement>) => {
    if (submitOnBlur && textChanged) {
      // call external onChange
      onChange(textValue);
    }
  };

  return (
    <input
      className={`w-full bg-transparent p-2 focus-within:text-light-4 text-light-3 dark:text-dark-4`}
      placeholder={placeholder}
      value={textValue}
      type="text"
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleOnBlur}
      autoFocus={autoFocus}
    />
  );
}
