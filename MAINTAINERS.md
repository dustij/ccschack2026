# MAINTAINERS.md — Project Maintainers & Responsibilities

This document lists the active maintainers of MultiAgent Chat, defines their responsibilities, and describes how the project is managed and released.

---

## Active Maintainers

| Name | GitHub | Role |
|---|---|---|
| Dusti Johnson | [@dustij](https://github.com/dustij) | Lead Maintainer |
| Ujjwal Sitaula | — | Maintainer |
| Sapnish Sharma | [@Sapnish-S](https://github.com/Sapnish-S) | Maintainer |
| Ariel L | [@AriLee1](https://github.com/AriLee1) | Maintainer |
| Rajdeep Sah | [@RajdeepSah](https://github.com/RajdeepSah) | Maintainer |

---

## Responsibilities

### All Maintainers

- Review and approve pull requests within the repository
- Triage incoming issues (label, prioritize, close as stale when appropriate)
- Ensure the `main` branch is always in a working, demo-ready state
- Enforce coding standards and rules defined in [CONTRIBUTING.md](CONTRIBUTING.md) and [RULES.md](RULES.md)
- Rotate or revoke API keys if a security incident is suspected

### Lead Maintainer (Dusti Johnson)

- Final authority on architectural decisions and breaking changes
- Manages repository settings, branch protection rules, and collaborator access
- Responsible for cutting releases and writing release notes
- Point of contact for critical security reports
- Resolves disagreements between maintainers

---

## Code Review Standards

### What Every PR Review Must Check

1. **Correctness** — Does the code do what it claims? Are edge cases handled?
2. **Security** — No API keys in code, no exposed secrets, no client-side env var access
3. **Rule compliance** — Changes to AI behavior must comply with [RULES.md](RULES.md)
4. **Code style** — Follows the standards in [CONTRIBUTING.md](CONTRIBUTING.md)
5. **Scope** — Does the PR stay focused on its stated purpose? Reject scope creep.
6. **Build integrity** — `npm run dev` must start cleanly; TypeScript must compile without errors

### Approval Requirements

| Change Type | Required Approvals |
|---|---|
| Documentation only | 1 maintainer |
| Bug fix | 1 maintainer |
| New feature | 1 maintainer (2 preferred for UI changes) |
| New AI provider adapter | 1 maintainer + smoke test evidence |
| Changes to `lib/prompts.ts` (agent behavior) | 1 maintainer with RULES.md review |
| Changes to `RULES.md` | Lead Maintainer |
| Changes to branch protection or repository settings | Lead Maintainer |

### Merging

- Use **Squash and Merge** for feature and fix branches
- Use **Merge Commit** only for release merges from a release branch to `main`
- Never force-push to `main`

---

## Issue Triage

When a new issue is opened:

1. Within 48 hours: Apply labels (`bug`, `enhancement`, `question`, `docs`, `good first issue`)
2. If a bug: attempt to reproduce and add a reproduction note
3. If unclear: request clarification with the `question` label and a comment
4. If out of scope or a duplicate: close with a brief explanation
5. If stale (no activity for 30 days): apply `stale` label; close after 7 more days without activity

---

## Release Management

This project does not currently use versioned releases in the traditional sense (it is a hackathon project). However, the following practices keep `main` stable:

### Before Any Demo or Presentation

1. Ensure all active PRs targeting the demo are merged
2. Pull `main` locally and run `npm run dev`
3. Run the full 4-mode API smoke test (see CONTRIBUTING.md)
4. Verify light/dark mode, all 4 chat modes, and typewriter animation in the browser
5. Confirm `.env.local` is present and all 4 Groq keys are valid
6. Confirm `.env.local` is NOT committed (`git status` must not list it)

### Tagging a Stable Point

When the project reaches a demo-ready state worth preserving:

```bash
git tag -a v1.0.0 -m "Hackathon demo — CCSC 2026"
git push origin v1.0.0
```

Use semantic versioning: `MAJOR.MINOR.PATCH`
- MAJOR: breaking change to the API contract or architecture
- MINOR: new feature (new mode, new provider, significant UI change)
- PATCH: bug fix, documentation update, minor style change

---

## API Key Management

### Key Rotation

Rotate Groq API keys by:
1. Generating new keys at [console.groq.com](https://console.groq.com)
2. Updating `.env.local` on all active development machines
3. Notifying all contributors via the team channel
4. Verifying the app works with new keys before the old ones are revoked

### Accidental Key Exposure

If a key is committed to the repository:

1. **Immediately** rotate the key at the provider dashboard — assume it is compromised
2. Remove the key from the commit history:
   ```bash
   git filter-repo --path .env.local --invert-paths
   git push origin --force --all
   ```
   Note: This rewrites history. Notify all contributors to re-clone.
3. Verify `.gitignore` includes `.env.local`
4. Audit the last 30 days of API usage logs for unexpected activity

### Key Distribution

Each agent slot uses a separate API key (GROQ_API_KEY_1 through GROQ_API_KEY_4). This is intentional — it distributes rate-limit pressure across keys during live demos. Do not consolidate to a single key.

---

## Adding and Removing Maintainers

### Adding a Maintainer

1. The candidate must have contributed at least one merged PR
2. Existing maintainers discuss and reach consensus (or Lead Maintainer decides)
3. Lead Maintainer grants repository collaborator access
4. Name and GitHub handle are added to this file via a PR

### Removing a Maintainer

- A maintainer may step down voluntarily by opening a PR to remove themselves from this file
- A maintainer may be removed by the Lead Maintainer if they are unresponsive for 90+ days or if conduct becomes an issue
- Repository access is revoked when a maintainer is removed

---

## Security Reporting

To report a security vulnerability (exposed credentials, injection risk, data exposure):

1. Do **not** open a public GitHub issue
2. Contact the Lead Maintainer directly via GitHub ([@dustij](https://github.com/dustij))
3. Include a description of the vulnerability, steps to reproduce, and potential impact
4. Expect an acknowledgment within 48 hours

---

## Governance

This is a team hackathon project. Decisions are made by consensus among active maintainers. When consensus cannot be reached, the Lead Maintainer makes the final call.

There is no formal voting process. Maintainers are expected to be collegial, constructive, and focused on building the best possible demo product.
