import { useState, useEffect, useCallback } from 'react';

export function useSearchParams(): [URLSearchParams, (params: URLSearchParams) => void] {
  const [searchParams, setSearchParamsState] = useState<URLSearchParams>(
    () => new URLSearchParams(window.location.search)
  );

  useEffect(() => {
    const handleLocationChange = () => {
      setSearchParamsState(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const setSearchParams = useCallback((newParams: URLSearchParams) => {
    const newUrl = window.location.pathname + '?' + newParams.toString();
    window.history.pushState({}, '', newUrl);
    setSearchParamsState(newParams);
  }, []);

  return [searchParams, setSearchParams];
}
