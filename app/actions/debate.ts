'use server';

import { getModel } from '@/lib/models';
import { Message, ChatMode } from '@/lib/types';
import { getSystemPrompt } from '@/lib/prompts';

export async function debateAction(prompt: string, history: Array<{ role: string, content: string, name?: string }>, turnCount: number, mode: ChatMode) {
    let modelConfig;
    const currentTurnIndex = turnCount % 3;

    if (currentTurnIndex === 0) {
        modelConfig = {
            id: 'gpt_oss',
            name: 'GPT-5 nano',
            system: getSystemPrompt(mode, 'GPT-5 nano', turnCount === 0),
        };
    } else if (currentTurnIndex === 1) {
        modelConfig = {
            id: 'gemma_2',
            name: 'Gemma 2',
            system: getSystemPrompt(mode, 'Gemma 2', false),
        };
    } else {
        modelConfig = {
            id: 'llama_3',
            name: 'LLaMA 3.3',
            system: getSystemPrompt(mode, 'LLaMA 3.3', false),
        };
    }

    // Format history for the Adapter.
    const adapterHistory: Message[] = history.map(msg => ({
        id: Math.random().toString(),
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.name ? `[${msg.name}]: ${msg.content}` : msg.content
    }));

    try {
        const adapter = getModel(modelConfig.id);

        let userMessage = prompt;
        if (turnCount > 0) {
            userMessage = adapterHistory.length > 0 ? adapterHistory[adapterHistory.length - 1].content : "Continue the debate.";
        }

        const text = await adapter.complete(modelConfig.system, userMessage, adapterHistory);

        return {
            content: text,
            modelName: modelConfig.name
        };

    } catch (error: any) {
        console.error("Debate Turn Error:", error);
        throw new Error(error.message || "Failed to fetch next debate turn.");
    }
}
