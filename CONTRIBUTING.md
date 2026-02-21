# CONTRIBUTING.md — Contribution Guide

Thank you for contributing to MultiAgent Chat. This document covers the workflow, branching strategy, commit standards, code style, and pull request process for all contributors.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Branching Strategy](#branching-strategy)
3. [Commit Standards](#commit-standards)
4. [Code Style](#code-style)
5. [Pull Request Process](#pull-request-process)
6. [Issue Guidelines](#issue-guidelines)
7. [Adding Features](#adding-features)
8. [Testing](#testing)

---

## Getting Started

1. **Fork and clone** the repository:

```bash
git clone https://github.com/dustij/ccschack2026.git
cd ccschack2026
npm install
```

2. **Set up environment variables.** Copy `.env.local.example` if it exists, or create `.env.local` manually (see [README.md](README.md) for the full variable list). Never commit `.env.local`.

3. **Run the dev server** and verify the app loads:

```bash
npm run dev
```

4. **Run a quick API smoke test:**

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hello","mode":"academic","history":[]}'
```

---

## Branching Strategy

All work happens on feature branches. The `main` branch is protected and always contains working, demo-ready code.

### Branch Naming

```
feature/<name>/<short-description>
fix/<name>/<short-description>
docs/<name>/<short-description>
chore/<name>/<short-description>
```

**Examples:**

```
feature/rajdeep/typewriter-animation
fix/ujjwal/groq-rate-limit
docs/sapnish/update-readme
chore/ariel/cleanup-unused-adapters
```

### Rules

- Always branch off `main`
- Keep branches short-lived — one logical change per branch
- Delete branches after they are merged
- Never push directly to `main`

---

## Commit Standards

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <short summary>

[optional body]
```

### Types

| Type | When to use |
|---|---|
| `feat` | A new feature or capability |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace — no logic change |
| `refactor` | Code restructure without behavior change |
| `chore` | Build tooling, config, dependency updates |
| `test` | Adding or updating tests |

### Examples

```
feat(prompts): add system prompts for story mode
fix(groq): handle empty response from Groq API
docs(readme): add environment setup section
refactor(orchestrator): extract context builder to helper function
chore(deps): update next to 16.1.2
```

### Rules

- Summary line: 72 characters maximum
- Use the imperative mood: "add" not "added", "fix" not "fixed"
- Reference issue numbers in the body when applicable: `Closes #12`
- One logical change per commit — avoid "did a bunch of stuff" commits

---

## Code Style

### TypeScript

- All new files must be TypeScript (`.ts` or `.tsx`)
- All exported functions and interfaces must have explicit types
- No `any` types — use `unknown` with type guards if the shape is uncertain
- Prefer `interface` over `type` for object shapes
- Use `const` for values that are never reassigned

### React / Next.js

- Mark client components with `'use client'` at the top of the file
- Keep `ChatPage.tsx` as the sole owner of shared state — child components receive props only
- New components belong in `components/`; new library modules belong in `lib/`
- Do not fetch data inside components — data fetching belongs in `ChatPage.tsx` or API routes

### Tailwind CSS

- Use Tailwind utility classes directly in JSX — do not create custom CSS classes for things Tailwind handles
- Group classes logically: layout → spacing → typography → color → interactive states
- Keep `transition-colors duration-200` on any element that changes color between light/dark

### Model Adapters

- Every adapter must implement `ModelAdapter` from `lib/types.ts` exactly
- Adapters must be stateless — no in-memory caching between requests
- Adapters must not log user messages, history, or system prompts
- Error messages from failed API calls must be thrown as `Error` objects, not returned as strings

### General

- No `console.log` in committed code (use `console.error` for server-side error logging only)
- Remove all commented-out code before opening a PR
- Do not add dependencies without discussing in an issue first — native `fetch` is preferred

---

## Pull Request Process

1. **Open a draft PR early** if you want early feedback. Mark it ready for review when complete.

2. **PR title** must follow the same Conventional Commits format as commit messages.

3. **PR description** must include:
   - What was changed and why
   - How to test the change (steps, curl commands, or screenshots)
   - Any related issue numbers

4. **All PRs require**:
   - At least **1 approving review** from another contributor
   - The branch must be up to date with `main` before merging
   - No merge conflicts

5. **Merging**: Use **Squash and Merge** for feature branches so `main` has one clean commit per PR.

6. **After merging**: Delete your feature branch.

### PR Checklist

Before marking a PR as ready for review, confirm:

- [ ] `.env.local` is not committed or referenced in code
- [ ] No API keys appear in any file
- [ ] `npm run dev` starts without errors
- [ ] The API smoke test returns valid JSON
- [ ] All four chat modes work end to end in the browser
- [ ] Light and dark mode both render correctly
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Code follows the style guidelines above

---

## Issue Guidelines

### Reporting a Bug

Include:
- Steps to reproduce (exact user actions)
- Expected behavior
- Actual behavior
- Browser and OS (for UI issues)
- Relevant error messages from the browser console or terminal

### Requesting a Feature

Include:
- Problem being solved or opportunity being addressed
- Proposed solution (or ask for discussion)
- Any constraints (must work without new npm packages, must not change the API contract, etc.)

### Labels

| Label | Meaning |
|---|---|
| `bug` | Something is broken |
| `enhancement` | New feature or improvement |
| `docs` | Documentation issue |
| `good first issue` | Suitable for new contributors |
| `question` | Needs clarification |

---

## Adding Features

### Adding a New AI Provider

See [README.md — Adding a New AI Provider](README.md#adding-a-new-ai-provider) for the step-by-step process. After adding the adapter, open a PR that includes:
- The new adapter file in `lib/models/`
- Updated `lib/models/index.ts` registration
- Updated `lib/prompts.ts` to use the new model key in at least one agent slot (for testing)
- Documentation of any new env vars in README.md

### Adding a New Chat Mode

1. Add the mode name to the `ChatMode` type in `lib/types.ts`
2. Add an agent config array under the new mode key in `AGENTS_BY_MODE` in `lib/prompts.ts`
3. Add system prompts for each agent under the new mode in `SYSTEM_PROMPTS`
4. Add theme entries (light + dark) for the new mode in `lib/themes.ts`
5. The `ModeSelector` component will automatically pick up the new mode
6. Update the mode table in README.md

### Modifying Agent Behavior

- Changes to system prompts in `lib/prompts.ts` must comply with [RULES.md](RULES.md) Section 3 (Mode-Specific Rules) and Section 5 (System Prompt Rules)
- Changes affecting Roast or Flirt modes require review from a maintainer

---

## Testing

There is currently no automated test suite. All verification is manual.

### Manual Verification Checklist

After any change, verify:

1. `npm run dev` starts without errors
2. API smoke test returns valid JSON for all four modes:

```bash
for mode in academic flirt roast story; do
  echo "=== $mode ===" && \
  curl -s -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d "{\"message\":\"test\",\"mode\":\"$mode\",\"history\":[]}" | \
  python3 -m json.tool
done
```

3. In the browser:
   - All four modes return correctly named agents
   - Typewriter animation plays for each agent sequentially
   - Send button is disabled during loading and animation
   - Light/dark toggle works on all modes
   - Long responses (near 1000 chars) display correctly without overflow
   - Shift+Enter creates a newline; Enter submits
   - Error state displays gracefully when an agent is unavailable

---

## Questions

Open an issue with the `question` label or reach out to a maintainer listed in [MAINTAINERS.md](MAINTAINERS.md).
