import { runAgents } from '@/lib/orchestrator';
import { ChatMode, ChatRequest, ChatResponse } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

const VALID_MODES: ChatMode[] = ['Academic', 'Flirt', 'Roast'];

export async function POST(
  req: NextRequest
): Promise<NextResponse<ChatResponse>> {
  let body: ChatRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { agents: [], error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { message, mode, history = [] } = body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return NextResponse.json(
      { agents: [], error: 'message is required' },
      { status: 400 }
    );
  }

  if (!VALID_MODES.includes(mode)) {
    return NextResponse.json(
      {
        agents: [],
        error: `Invalid mode. Use one of: ${VALID_MODES.join(', ')}`,
      },
      { status: 400 }
    );
  }

  try {
    const agents = await runAgents(message.trim(), mode, history);
    return NextResponse.json({ agents });
  } catch (err) {
    console.error('Orchestration error:', err);
    return NextResponse.json(
      { agents: [], error: 'Internal server error' },
      { status: 500 }
    );
  }
}
