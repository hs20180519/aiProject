import { useState, useEffect } from "react";

function useDebounced(value: string, delay: number) {
  const [deboundedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return deboundedValue;
}

export default useDebounced;
