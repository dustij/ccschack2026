export type ChatMode = 'academic' | 'flirt' | 'roast' | 'story';
export type Role = 'user' | 'assistant';

export interface Message {
  role: Role;
  content: string;
  agentName?: string;
}

export interface AgentResponse {
  agentName: string;
  text: string;
  role: 'assistant';
}

export interface ChatRequest {
  message: string;
  mode: ChatMode;
  history: Message[];
}

export interface ChatResponse {
  agents: AgentResponse[];
  error?: string;
}

export interface AgentConfig {
  agentName: string;
  role: 'primary' | 'secondary' | 'tertiary';
  model: string;
}

export interface ModelAdapter {
  complete(
    systemPrompt: string,
    userMessage: string,
    history: Message[]
  ): Promise<string>;
}
