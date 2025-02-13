import { useState, useEffect } from 'react';

let hydrated = false

export const useHydrated = () => {
  const [, setIsHydrated] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      hydrated = true;
      setIsHydrated(true);
    }
  }, []);

  return hydrated;
};
