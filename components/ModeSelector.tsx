'use client';

import { ChatMode } from '@/lib/types';
import { Theme } from '@/lib/themes';

const MODES: { value: ChatMode; label: string }[] = [
  { value: 'academic', label: 'Academic' },
  { value: 'flirt',    label: 'Flirt'    },
  { value: 'roast',    label: 'Roast'    },
  { value: 'story',    label: 'Story'    },
];

interface Props {
  mode: ChatMode;
  onChange: (mode: ChatMode) => void;
  theme: Theme;
}

export default function ModeSelector({ mode, onChange, theme }: Props) {
  return (
    <nav className="flex items-center gap-0.5" role="tablist" aria-label="Chat mode">
      {MODES.map((m) => (
        <button
          key={m.value}
          role="tab"
          aria-selected={mode === m.value}
          onClick={() => onChange(m.value)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
            mode === m.value ? theme.modeActive : theme.modeInactive
          }`}
        >
          {m.label}
        </button>
      ))}
    </nav>
  );
}
