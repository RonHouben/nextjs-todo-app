import { useCallback, useState } from "react";
import { debounce } from "lodash";

interface Props<T> {
  initialState: T;
  wait: number;
  options?: {
    leading?: boolean;
    maxWait?: number;
    trailing?: boolean;
  };
}

export const useDebounce = <T>({
  initialState,
  wait,
  options,
}: Props<T>): [T, (v: T) => void] => {
  // set state
  const [state, setState] = useState(initialState);

  // function to debounce the setState
  // const setDebouncedState = (val: T) => debounce(val);
  const setDebouncedState = useCallback(
    debounce((val: T) => setState(val), wait, options),
    []
  );

  return [state, setDebouncedState];
};
