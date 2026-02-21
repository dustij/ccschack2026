'use client';

import {
  useCallback,
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from 'react';

export interface UseAiChatOptions {
  onFinish?: (prompt: string, completion: string) => void;
}

export interface UseAiChatResult {
  input: string;
  isLoading: boolean;
  handleInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (event?: FormEvent<HTMLFormElement>) => void;
  setInput: Dispatch<SetStateAction<string>>;
}

export function useAiChat(_options?: UseAiChatOptions): UseAiChatResult {
  const [input, setInput] = useState('');
  const isLoading = false;

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(event.target.value);
    },
    []
  );

  const handleSubmit = useCallback((event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
  }, []);

  return {
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    setInput,
  };
}
