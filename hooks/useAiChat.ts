'use client';

import {
  useCallback,
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from 'react';
import type { AgentResponse, Message } from '@/lib/types';

export interface UseAiChatOptions {
  mode: string;
  onFinish?: (prompt: string, agents: AgentResponse[]) => void | Promise<void>;
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

export function useAiChat({ mode, onFinish }: UseAiChatOptions): UseAiChatResult {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);

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
      if (!prompt || isLoading) return;

      setIsLoading(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: prompt,
            mode: mode.toLowerCase(),
            history,
          }),
        });

        if (!res.ok) {
          console.error('Chat API error:', res.status);
          return;
        }

        const data = await res.json();
        const agents: AgentResponse[] = data.agents ?? [];

        if (agents.length > 0) {
          const userMsg: Message = { role: 'user', content: prompt };
          const agentMsgs: Message[] = agents.map((a) => ({
            role: 'assistant',
            content: a.text,
            agentName: a.agentName,
          }));
          setHistory((prev) => [...prev, userMsg, ...agentMsgs]);
          await onFinish?.(prompt, agents);
        }
      } catch (err) {
        console.error('Chat error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, mode, history, onFinish]
  );

  return {
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    setInput,
  };
}
