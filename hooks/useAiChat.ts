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
  onFinish?: (prompt: string, completion: string) => void | Promise<void>;
}

export interface UseAiChatResult {
  input: string;
  isLoading: boolean;
  handleInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (
    event?: FormEvent<HTMLFormElement>,
    promptOverride?: string
  ) => Promise<void>;
  setInput: Dispatch<SetStateAction<string>>;
}

function buildMockCompletion(prompt: string): string {
  return `Mock AI reply: ${prompt}`;
}

export function useAiChat(options?: UseAiChatOptions): UseAiChatResult {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(event.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (event?: FormEvent<HTMLFormElement>, promptOverride?: string) => {
      event?.preventDefault();

      const prompt = (promptOverride ?? input).trim();
      if (!prompt || isLoading) {
        return;
      }

      setIsLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 650));
        const completion = buildMockCompletion(prompt);
        await options?.onFinish?.(prompt, completion);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, options]
  );

  return {
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    setInput,
  };
}
