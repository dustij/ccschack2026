import { ChatMode } from '@/lib/types';

export interface Theme {
  /** Full page background */
  page: string;
  /** Header bar (bg + border) */
  header: string;
  /** App title color */
  titleText: string;
  /** Dark/light toggle button */
  toggleBtn: string;
  /** Message list scroll area */
  list: string;
  /** Empty state headline */
  emptyTitle: string;
  /** Empty state body text */
  emptySub: string;
  /** Loading dot color */
  loadingDot: string;
  /** Loading dot container */
  loadingBg: string;
  /** User message bubble (right side) */
  userBubble: string;
  /** Agent message bubble — one neutral style for all agents */
  agentBubble: string;
  /** Input bar container */
  inputArea: string;
  /** Textarea element */
  textarea: string;
  /** Send button (enabled) */
  sendBtn: string;
  /** Active mode tab */
  modeActive: string;
  /** Inactive mode tab */
  modeInactive: string;
}

type ModeTheme = { light: Theme; dark: Theme };

// Shared dark base — all modes use the same neutral dark background;
// only accent colors differ in dark mode.
const darkBase = (accent: {
  userBubble: string;
  sendBtn: string;
  modeActive: string;
  textareaFocus: string;
}): Theme => ({
  page: 'bg-neutral-950',
  header: 'bg-neutral-900 border-neutral-800',
  titleText: 'text-neutral-100',
  toggleBtn: 'text-neutral-500 hover:text-neutral-200',
  list: 'bg-neutral-950',
  emptyTitle: 'text-neutral-400',
  emptySub: 'text-neutral-600',
  loadingDot: 'bg-neutral-600',
  loadingBg: 'bg-neutral-800',
  agentBubble: 'bg-neutral-800 border border-neutral-700 text-neutral-100',
  inputArea: 'bg-neutral-900 border-neutral-800',
  textarea: `border-neutral-700 bg-neutral-800 text-neutral-100 placeholder:text-neutral-500 ${accent.textareaFocus}`,
  modeInactive: 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800',
  ...accent,
});

// ─── Academic ─────────────────────────────────────────────────────────────────
const academic: ModeTheme = {
  light: {
    page: 'bg-white',
    header: 'bg-white border-neutral-200',
    titleText: 'text-neutral-900',
    toggleBtn: 'text-neutral-400 hover:text-neutral-700',
    list: 'bg-neutral-50',
    emptyTitle: 'text-neutral-500',
    emptySub: 'text-neutral-400',
    loadingDot: 'bg-neutral-400',
    loadingBg: 'bg-neutral-200',
    userBubble: 'bg-blue-600 text-white',
    agentBubble: 'bg-white border border-neutral-200 text-neutral-800 shadow-sm',
    inputArea: 'bg-white border-neutral-200',
    textarea: 'border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:ring-blue-500',
    sendBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
    modeActive: 'bg-neutral-900 text-white',
    modeInactive: 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100',
  },
  dark: darkBase({
    userBubble: 'bg-blue-500 text-white',
    sendBtn: 'bg-blue-500 hover:bg-blue-600 text-white',
    modeActive: 'bg-neutral-100 text-neutral-900',
    textareaFocus: 'focus:border-blue-400 focus:ring-blue-400',
  }),
};

// ─── Flirt ────────────────────────────────────────────────────────────────────
const flirt: ModeTheme = {
  light: {
    page: 'bg-rose-50',
    header: 'bg-white border-rose-100',
    titleText: 'text-neutral-900',
    toggleBtn: 'text-neutral-400 hover:text-neutral-700',
    list: 'bg-rose-50',
    emptyTitle: 'text-neutral-500',
    emptySub: 'text-neutral-400',
    loadingDot: 'bg-rose-300',
    loadingBg: 'bg-rose-100',
    userBubble: 'bg-rose-500 text-white',
    agentBubble: 'bg-white border border-rose-100 text-neutral-800 shadow-sm',
    inputArea: 'bg-white border-rose-100',
    textarea: 'border-rose-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-rose-400 focus:ring-rose-400',
    sendBtn: 'bg-rose-500 hover:bg-rose-600 text-white',
    modeActive: 'bg-neutral-900 text-white',
    modeInactive: 'text-neutral-500 hover:text-neutral-800 hover:bg-rose-100',
  },
  dark: darkBase({
    userBubble: 'bg-rose-500 text-white',
    sendBtn: 'bg-rose-500 hover:bg-rose-600 text-white',
    modeActive: 'bg-neutral-100 text-neutral-900',
    textareaFocus: 'focus:border-rose-400 focus:ring-rose-400',
  }),
};

// ─── Roast ────────────────────────────────────────────────────────────────────
const roast: ModeTheme = {
  light: {
    page: 'bg-orange-50',
    header: 'bg-white border-orange-100',
    titleText: 'text-neutral-900',
    toggleBtn: 'text-neutral-400 hover:text-neutral-700',
    list: 'bg-orange-50',
    emptyTitle: 'text-neutral-500',
    emptySub: 'text-neutral-400',
    loadingDot: 'bg-orange-400',
    loadingBg: 'bg-orange-100',
    userBubble: 'bg-orange-600 text-white',
    agentBubble: 'bg-white border border-orange-100 text-neutral-800 shadow-sm',
    inputArea: 'bg-white border-orange-100',
    textarea: 'border-orange-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-orange-500 focus:ring-orange-400',
    sendBtn: 'bg-orange-600 hover:bg-orange-700 text-white',
    modeActive: 'bg-neutral-900 text-white',
    modeInactive: 'text-neutral-500 hover:text-neutral-800 hover:bg-orange-100',
  },
  dark: darkBase({
    userBubble: 'bg-orange-500 text-white',
    sendBtn: 'bg-orange-500 hover:bg-orange-600 text-white',
    modeActive: 'bg-neutral-100 text-neutral-900',
    textareaFocus: 'focus:border-orange-400 focus:ring-orange-400',
  }),
};

// ─── Story ────────────────────────────────────────────────────────────────────
const story: ModeTheme = {
  light: {
    page: 'bg-amber-50',
    header: 'bg-white border-amber-100',
    titleText: 'text-neutral-900',
    toggleBtn: 'text-neutral-400 hover:text-neutral-700',
    list: 'bg-amber-50',
    emptyTitle: 'text-neutral-500',
    emptySub: 'text-neutral-400',
    loadingDot: 'bg-amber-400',
    loadingBg: 'bg-amber-100',
    userBubble: 'bg-amber-600 text-white',
    agentBubble: 'bg-white border border-amber-100 text-neutral-800 shadow-sm',
    inputArea: 'bg-white border-amber-100',
    textarea: 'border-amber-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:ring-amber-400',
    sendBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
    modeActive: 'bg-neutral-900 text-white',
    modeInactive: 'text-neutral-500 hover:text-neutral-800 hover:bg-amber-100',
  },
  dark: darkBase({
    userBubble: 'bg-amber-500 text-white',
    sendBtn: 'bg-amber-500 hover:bg-amber-600 text-white',
    modeActive: 'bg-neutral-100 text-neutral-900',
    textareaFocus: 'focus:border-amber-400 focus:ring-amber-400',
  }),
};

export const THEMES: Record<ChatMode, ModeTheme> = {
  academic,
  flirt,
  roast,
  story,
};
