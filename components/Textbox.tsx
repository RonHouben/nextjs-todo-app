import {
  ChangeEvent,
  KeyboardEvent,
  FocusEvent,
  useEffect,
  useState,
  useMemo,
  InputHTMLAttributes,
} from "react";
import { useDebounce } from "../hooks/useDebounce";
import { Key } from "../utils/interfaces/Key.enum";

interface Props {
  value: string;
  onChange?: (text: string) => void;
  onSubmit?: (text: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  autoSubmit?: boolean;
  submitOnEnterKey?: boolean;
  submitOnBlur?: boolean;
  autoFocus?: boolean;
  clearOnEnterKey?: boolean;
  border?: boolean;
  className?: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  disabled?: boolean;
}

export default function Textbox({
  value: initialValue = "",
  placeholder,
  onChange = () => {},
  onSubmit = () => {},
  debounceDelay = 0,
  autoSubmit = false,
  submitOnBlur = false,
  submitOnEnterKey = false,
  autoFocus = false,
  clearOnEnterKey = false,
  border,
  className,
  type,
  disabled,
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

  // only call onSubmit when the debouncedValue is changed && autoSubmit === true
  useEffect(() => {
    // call external onChange
    if (autoSubmit && debouncedValue && textChanged) {
      // call external onSubmit
      onSubmit(debouncedValue);
    }
  }, [debouncedValue, autoSubmit, debouncedValue, textChanged]);

  // update local states
  useEffect(() => {
    setTextValue(initialValue);
    setDebouncedValue(initialValue);
  }, [initialValue]);

  // handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (textChanged) {
      // update local state
      setDebouncedValue(e.target.value);
      // call external onChange
      onChange(textValue);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (submitOnEnterKey && e.key === Key.Enter && textValue) {
      // call external onSubmit
      onSubmit(textValue);

      if (clearOnEnterKey) {
        setTextValue("");
        setDebouncedValue("");
      }
    }
  };

  const handleOnBlur = (_e: FocusEvent<HTMLInputElement>) => {
    if (submitOnBlur && textChanged) {
      // call external onSubmit
      onSubmit(textValue);
    }
  };

  return (
    <input
      className={`w-full bg-transparent p-2 focus-within:text-light-4 text-light-3 dark:text-dark-2 
      ${border ? "border-2 rounded-lg light:border-light-1" : ""}
      ${disabled ? "bg-light-1" : ""}
        ${className}`}
      placeholder={placeholder}
      value={textValue}
      type={type}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleOnBlur}
      autoFocus={autoFocus}
      disabled={disabled}
    />
  );
}
