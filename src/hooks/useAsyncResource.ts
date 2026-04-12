import {useCallback, useEffect, useState} from 'react';

type AsyncRunner<T> = () => Promise<T>;

type AsyncResourceState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

export const useAsyncResource = <T>(
  runner: AsyncRunner<T>,
): AsyncResourceState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await runner();
      setData(response);
    } catch {
      setError('Unable to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [runner]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {data, isLoading, error, reload};
};
