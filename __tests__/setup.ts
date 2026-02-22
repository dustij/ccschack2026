/**
 * Global test setup — runs once before every test file.
 *
 * 1. Extends expect() with @testing-library/jest-dom matchers
 *    (toBeInTheDocument, toHaveClass, toHaveAttribute, …)
 * 2. Stubs out packages that only work inside the Next.js server runtime.
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ── Server-only packages ──────────────────────────────────────────────────────
// `server-only` throws when imported outside the Next.js server context.
// Replace it with an empty module so lib/orchestrator.ts and friends can load.
vi.mock('server-only', () => ({}));

// ── Next.js navigation (used by Link / useRouter in some components) ──────────
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));
