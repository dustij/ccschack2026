# MultiAgent Chat

A hackathon-ready, production-quality multi-mode, multi-agent AI chat platform built with Next.js 16, React 19, and Tailwind CSS v4. Multiple AI agents powered by Groq's ultra-fast inference respond to each user message — and to each other — in a live sequential conversation.

---

## Features

- **4 Chat Modes** — Academic, Flirt, Roast, Story, each with distinct agent personas and system prompts
- **Multi-Agent Conversations** — 2–3 agents respond sequentially; each agent reads prior agents' responses before replying
- **Typewriter Animation** — Responses appear character-by-character at ~250 chars/sec for a live "thinking" feel
- **Light / Dark Mode** — Toggle per session; theme automatically adapts to the selected chat mode
- **Mode-Adaptive Themes** — Academic (blue), Flirt (rose), Roast (orange), Story (amber), each with light and dark variants
- **Rate-Limit Resilient** — 4 separate Groq API keys distributed across agent slots to survive demo traffic
- **Zero Extra Dependencies** — Uses native `fetch` (Node 18+); no AI SDK packages required
- **Pluggable Model Layer** — Swap any agent to a different provider in one line; Claude, OpenAI, Gemini, and custom REST adapters are included as stubs

---

## System Architecture

```
┌─────────────────────────────────────────┐
│             BROWSER (Client)            │
│  ChatPage.tsx  (state + fetch)          │
│   ├── ModeSelector.tsx  (tab bar)       │
│   ├── MessageList.tsx   (scrollable)    │
│   │    └── MessageBubble.tsx            │
│   └── ChatInput.tsx     (textarea)      │
└──────────────────┬──────────────────────┘
                   │  POST /api/chat
                   │  { message, mode, history }
┌──────────────────▼──────────────────────┐
│        NEXT.JS API ROUTE (Server)       │
│  app/api/chat/route.ts                  │
│   └── lib/orchestrator.ts               │
│        ├── lib/prompts.ts               │
│        └── lib/models/index.ts          │
│             ├── groq.ts   ← active      │
│             ├── claude.ts               │
│             ├── openai.ts               │
│             ├── gemini.ts               │
│             ├── custom.ts               │
│             └── mock.ts                 │
└─────────────────────────────────────────┘
```

### Agent Call Flow

```
User sends message
      │
      ▼
POST /api/chat  { message, mode, history }
      │
      ▼
orchestrator.runAgents(message, mode, history)
      │
      ▼
For each AgentConfig in AGENTS_BY_MODE[mode]:
  ┌─ Agent 1 (primary):   receives userMessage only
  ├─ Agent 2 (secondary): receives userMessage + Agent 1 response
  └─ Agent 3 (tertiary):  receives userMessage + Agent 1 + Agent 2 responses
      │
      ▼
Return { agents: AgentResponse[] }
      │
      ▼
Frontend animates each response with typewriter effect (sequential)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| AI Provider | Groq (`llama-3.3-70b-versatile`) |
| Runtime | Node.js 18+ |
| API Transport | Native `fetch` |

---

## Project Structure

```
ccschack2026/
├── app/
│   ├── api/chat/
│   │   └── route.ts          # POST handler — validation + orchestration
│   ├── globals.css            # Global styles, font stack
│   ├── layout.tsx             # Root layout, metadata
│   └── page.tsx               # Entry point → <ChatPage />
├── components/
│   ├── ChatPage.tsx           # Root client component, owns all state
│   ├── ChatInput.tsx          # Textarea + Send button
│   ├── MessageBubble.tsx      # Individual message rendering
│   ├── MessageList.tsx        # Scrollable message container
│   └── ModeSelector.tsx       # Mode tab bar
├── lib/
│   ├── models/
│   │   ├── index.ts           # Model registry (groq1–groq4, claude, openai, ...)
│   │   ├── groq.ts            # GroqAdapter — Groq REST API
│   │   ├── claude.ts          # ClaudeAdapter stub
│   │   ├── openai.ts          # OpenAIAdapter stub
│   │   ├── gemini.ts          # GeminiAdapter stub
│   │   ├── custom.ts          # CustomRestAdapter stub
│   │   └── mock.ts            # MockAdapter — no API key needed
│   ├── orchestrator.ts        # Sequential multi-agent loop
│   ├── prompts.ts             # AGENTS_BY_MODE + system prompts
│   ├── themes.ts              # Mode × light/dark theme definitions
│   └── types.ts               # All TypeScript interfaces
├── .env.local                 # API keys (never committed)
├── .gitignore
├── CONTRIBUTING.md
├── MAINTAINERS.md
├── RULES.md
└── README.md
```

---

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- At least one [Groq API key](https://console.groq.com) (free tier available)

---

## Installation

```bash
git clone https://github.com/dustij/ccschack2026.git
cd ccschack2026
npm install
```

---

## Environment Setup

Create a `.env.local` file in the project root. This file is listed in `.gitignore` and will never be committed.

```bash
# Groq API keys — obtain from https://console.groq.com
# Using separate keys per agent prevents single-key rate-limit exhaustion
GROQ_API_KEY_1=gsk_...
GROQ_API_KEY_2=gsk_...
GROQ_API_KEY_3=gsk_...
GROQ_API_KEY_4=gsk_...

# Model (optional — defaults to llama-3.3-70b-versatile)
GROQ_MODEL=llama-3.3-70b-versatile
```

If you only have one Groq key, you can assign all four variables to the same value. The app will work but may hit rate limits under heavy demo use.

### Optional — Additional Providers

These are available as adapter stubs. Add keys as needed and update `lib/prompts.ts` to assign agents to the desired model.

```bash
# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-opus-4-6

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Google Gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash

# Custom OpenAI-compatible endpoint
CUSTOM_API_URL=https://your-endpoint/v1/chat/completions
CUSTOM_API_KEY=...
CUSTOM_MODEL=your-model-name
```

---

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Verify the API

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is entropy?","mode":"academic","history":[]}'
```

Expected response shape:

```json
{
  "agents": [
    { "agentName": "Groq-1", "text": "...", "role": "assistant" },
    { "agentName": "Groq-2", "text": "...", "role": "assistant" },
    { "agentName": "Groq-3", "text": "...", "role": "assistant" }
  ]
}
```

---

## Chat Modes

| Mode | Agents | Behavior |
|---|---|---|
| **Academic** | Groq-1, Groq-2, Groq-3 | Clear insight → intellectual counterpoint → synthesis |
| **Flirt** | Groq-1, Groq-2 | Playful opener → witty comeback |
| **Roast** | Groq-3, Groq-4 | Roast the topic → roast the first roast |
| **Story** | Groq-1, Groq-2, Groq-3 | Set scene → add twist → cryptic narration |

---

## Adding a New AI Provider

1. Create `lib/models/myprovider.ts` implementing the `ModelAdapter` interface:

```typescript
import { ModelAdapter, Message } from '@/lib/types';

export class MyProviderAdapter implements ModelAdapter {
  async complete(systemPrompt: string, userMessage: string, history: Message[]): Promise<string> {
    // Call your provider's API here
    return responseText;
  }
}
```

2. Register it in `lib/models/index.ts`:

```typescript
myprovider: () => new MyProviderAdapter(),
```

3. In `lib/prompts.ts`, set an agent's `model` field to `'myprovider'`.

4. Add any required env vars to `.env.local`.

Nothing else changes — the orchestrator, API route, and all UI components are provider-agnostic.

---

## UI Overview

```
┌─────────────────────────────────────────────────────────┐
│  MultiAgent    [Academic] [Flirt] [Roast] [Story]  [☀]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                              You                        │
│                     What is entropy?                    │
│                                                         │
│  GROQ-1                                                 │
│  Entropy is a measure of disorder in a system...       │
│                                                         │
│  GROQ-2                                                 │
│  That classical framing misses the statistical...      │
│                                                         │
│  GROQ-3                                                 │
│  To synthesize: Boltzmann's insight connects...        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Message                                      [ Send ]  │
└─────────────────────────────────────────────────────────┘
```

- **Header** — app title, mode tabs, dark/light toggle
- **Message list** — auto-scrolls to latest; loading dots during API call
- **Typewriter effect** — each agent's response types out sequentially at ~250 chars/sec
- **Input** — Enter to send, Shift+Enter for newline; disabled while agents are responding or animating

---

## Contributors

| Name | GitHub |
|---|---|
| Dusti Johnson | [@dustij](https://github.com/dustij) |
| Ujjwal Sitaula | — |
| Sapnish Sharma | [@Sapnish-S](https://github.com/Sapnish-S) |
| Ariel L | [@AriLee1](https://github.com/AriLee1) |
| Rajdeep Sah | [@RajdeepSah](https://github.com/RajdeepSah) |

---

## License

MIT
