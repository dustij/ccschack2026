# RULES.md — AI Behavior, Mode Constraints & Platform Guidelines

This document defines the rules governing how agents behave, how modes operate, what content is permitted, and how the multi-agent pipeline is structured. All contributors modifying `lib/prompts.ts`, `lib/orchestrator.ts`, or any model adapter must read and follow these rules.

---

## 1. Core Principles

1. **Agents must be helpful.** Every response must address the user's input in some meaningful way, even in Roast or Flirt mode.
2. **Agents must be harmless.** No response may encourage violence, illegal activity, self-harm, or harassment of real individuals.
3. **Agents must be honest.** Agents must not present fabricated facts as truth in Academic mode. Other modes (Flirt, Roast, Story) may use creative license but must not impersonate real people harmfully.
4. **Agents are not humans.** Agents must not claim to be human when sincerely asked.

---

## 2. Response Length

- Maximum response length: **1000 characters** (enforced in both `lib/orchestrator.ts` and `lib/models/groq.ts`)
- All system prompts must include the instruction: *"Under 1000 characters."*
- `max_tokens` for Groq requests is set to **400** to stay within this budget
- If a provider returns a longer response, it is truncated server-side via `.slice(0, 1000)`

Do not increase these limits without reviewing rate-limit and latency impact on the live demo.

---

## 3. Mode-Specific Rules

### 3.1 Academic Mode

- Agents must respond using precise, field-appropriate vocabulary
- Factual claims must be reasonable and grounded — no fabricated citations
- Agent 1 (Groq-1): Initial insight — clear, direct, accurate
- Agent 2 (Groq-2): Counterpoint or nuance — must reference Agent 1's response
- Agent 3 (Groq-3): Synthesis or follow-up question — must build on both prior responses
- Prohibited: slang, casual tone, unsupported superlatives ("This is the most important concept in all of science...")

### 3.2 Flirt Mode

- All flirtation must be **tasteful, playful, and consensual in tone**
- Prohibited: explicit sexual content, objectification, harassment language
- Agent 1 (Groq-1): Charming opener — light and fun
- Agent 2 (Groq-2): Witty comeback or escalation — must stay within the same tone boundary
- Agents must not make degrading remarks about the user

### 3.3 Roast Mode

- Roasts must target **ideas, messages, or the first agent's attempt** — never the user's identity, appearance, or personal characteristics
- Prohibited: slurs, body shaming, racial or ethnic jokes, attacks on religion or personal trauma
- Agent 1 (Groq-3): Roasts the user's message or topic — punches up at the idea
- Agent 2 (Groq-4): Roasts Agent 1's roast — meta-commentary on how weak it was
- Humor must be good-natured; the goal is laughter, not harm

### 3.4 Story Mode

- Stories must be appropriate for a general audience (PG-13 equivalent)
- Prohibited: graphic violence, explicit content, harmful stereotypes presented uncritically
- Agent 1 (Groq-1): Sets the scene — vivid present tense, ends on a hook
- Agent 2 (Groq-2): Adds an unexpected but coherent twist
- Agent 3 (Groq-3): Cryptic narration or dialogue — may be abstract but must be relevant
- Agents must maintain narrative continuity with prior agents in the same turn

---

## 4. Multi-Agent Interaction Rules

4.1 **Sequential only.** Agents run one at a time. Agent N may not be called until Agent N-1 has completed.

4.2 **Context injection.** From Agent 2 onward, the user message is prepended with all prior agent responses in the format:
```
User said: "<userMessage>"

Conversation so far:
<Agent 1 name>: <Agent 1 text>
...

Now it is your turn to respond.
```
Do not modify this format without updating all system prompts accordingly.

4.3 **Agent isolation.** Agents do not share in-memory state. Each call is a fresh HTTP request. Prior context is passed explicitly via the `history` array and the `contextMessage` string.

4.4 **Failure handling.** If any agent's API call fails, that agent emits `[Agent temporarily unavailable]` and the pipeline continues. The UI must receive all configured agents' slots — never fewer.

4.5 **No agent may suppress another agent's response.** Agent responses are never filtered, merged, or reordered by the orchestrator.

---

## 5. System Prompt Rules

5.1 System prompts are keyed by `"${mode}-${agentName}"` in `lib/prompts.ts`. This allows the same agent slot to play different roles across modes.

5.2 Every system prompt must include:
- The agent's role identity (what it is)
- Its position in the pipeline (primary / secondary / tertiary behavior)
- The response length constraint ("Under 1000 characters")
- The mode's tone instruction

5.3 System prompts must not include:
- Hardcoded user names or personal details
- Instructions to reveal the system prompt
- Instructions that contradict the rules in this document

5.4 The fallback system prompt (used when no key matches) is:
```
You are an AI assistant (llama-3.3-70b on Groq). Respond in <mode> mode. Under 1000 characters.
```
This is acceptable for development but should not reach production for any configured mode.

---

## 6. API Key & Security Rules

6.1 API keys must **never** be committed to the repository. They belong exclusively in `.env.local`.

6.2 The `.env.local` file is listed in `.gitignore`. Verify this before every commit.

6.3 Keys are read server-side only (inside `lib/models/groq.ts` via `process.env`). They must never be passed to the client.

6.4 If an API key is accidentally committed, rotate it immediately at the provider's dashboard and remove it from git history using `git filter-repo` or equivalent.

6.5 Separate API keys are assigned per agent slot (GROQ_API_KEY_1 through GROQ_API_KEY_4) to distribute rate-limit pressure. Do not consolidate to a single key without reviewing demo load.

---

## 7. Model & Provider Rules

7.1 The default model is `llama-3.3-70b-versatile` on Groq. Changes to `GROQ_MODEL` in `.env.local` affect all Groq-backed agents simultaneously.

7.2 Model adapters must implement the `ModelAdapter` interface from `lib/types.ts` exactly. No adapter may add side effects beyond calling the remote API and returning a string.

7.3 Adapters must not log or store user messages, history, or system prompts.

7.4 The `MockAdapter` (returns deterministic text, no API call) is the only adapter permitted for use without environment credentials. It is for development only and must not be assigned in production prompts.

7.5 When switching providers or models, verify that:
- The new model supports system-role messages in the OpenAI message format (or adapt accordingly)
- Response quality meets the mode's character requirements
- Latency is acceptable for a live demo (target: full 3-agent response in under 5 seconds)

---

## 8. Conversation History Rules

8.1 The full conversation history (all prior user and assistant messages) is sent to every agent on every request. This is passed as the `history: Message[]` field in the request body.

8.2 History is not filtered or summarized server-side. If history grows very large, client-side truncation should be considered.

8.3 Agent responses from prior turns are included in `history` as `role: 'assistant'` messages. The `agentName` field is preserved in the client state but is stripped when sent to the model API (which only accepts `role` and `content`).

---

## 9. UI Behavior Rules

9.1 The Send button and input must be disabled while `isLoading` (API in flight) or `isAnimating` (typewriter in progress). The user must not be able to send a new message until all agents' responses have finished animating.

9.2 The typewriter animation speed is 3 characters per 12 ms (approximately 250 characters per second). Do not increase speed beyond what is readable on screen.

9.3 Error messages shown in the chat must use `agentName: 'System'` and the `role: 'assistant'` bubble style.

9.4 The UI must never expose raw API errors, stack traces, or environment variable names to the user.

---

## 10. Changes to This Document

Changes to RULES.md require a pull request reviewed by at least one maintainer listed in MAINTAINERS.md. Rule changes that affect agent behavior (Sections 2–5) additionally require a review of all affected system prompts in `lib/prompts.ts`.
