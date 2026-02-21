/**
 * hooks/useParallelRoast.ts
 *
 * Fires three simultaneous streaming requests — one per fighter — and exposes
 * each stream's live text, loading state, and error independently.
 *
 * Usage:
 *   const { streams } = useParallelRoast();
 *   streams.grok.submit("Which LLM is best?");
 */
'use client';

import { useChat } from 'ai/react';

export type FighterKey = 'grok' | 'gemini' | 'llama';

function useFighterStream(fighter: FighterKey) {
    return useChat({
        api: `/api/chat/${fighter}`,
        id: fighter, // isolates each stream's state in the AI SDK cache
    });
}

export function useParallelRoast() {
    const grok = useFighterStream('grok');
    const gemini = useFighterStream('gemini');
    const llama = useFighterStream('llama');

    /**
     * Submit a single prompt to ALL three fighters simultaneously.
     * Call this instead of each fighter's individual `append`.
     */
    function submit(userPrompt: string) {
        const message = { role: 'user' as const, content: userPrompt };
        grok.append(message);
        gemini.append(message);
        llama.append(message);
    }

    return {
        streams: { grok, gemini, llama },
        submit,
        isLoading: grok.isLoading || gemini.isLoading || llama.isLoading,
    };
}
