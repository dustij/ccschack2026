'use client';

import { ArrowLeftIcon, ArrowUpIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { AmbientParticles } from '@/components/ui/ambient-particles';
import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';

const CHAT_MODES = ['Roast', 'Flirt'] as const;

const PANEL_TRANSITION = {
  type: 'spring',
  stiffness: 175,
  damping: 14,
  mass: 0.9,
} as const;

const BUTTON_TRANSITION = {
  type: 'spring',
  stiffness: 220,
  damping: 13,
  mass: 0.65,
  delay: 0.62,
} as const;

export default function ChatPage() {
  return (
    <div className="to-candy-purple-dark relative isolate min-h-screen overflow-hidden bg-white bg-linear-60 dark:from-black">
      <AmbientParticles />
      <div
        aria-hidden="true"
        className="absolute top-6 left-[calc(50%-8rem)] z-0 transform-gpu blur-3xl sm:left-[calc(50%-20rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
          }}
          className="from-candy-blue to-candy-pink aspect-1108/632 w-277 bg-linear-to-r opacity-15"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -90, rotate: -14, scale: 0.72 }}
            animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
            transition={BUTTON_TRANSITION}
          >
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="bg-candy-purple-dark/60 hover:bg-candy-purple-dark/80 size-10 rounded-full border border-white/12 text-white"
            >
              <Link href="/" aria-label="Back">
                <ArrowLeftIcon className="size-5" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 90, rotate: 14, scale: 0.72 }}
            animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
            transition={BUTTON_TRANSITION}
          >
            <Combobox defaultValue={CHAT_MODES[0]} aria-label="Mode">
              <ComboboxTrigger className="bg-candy-purple-dark/65 hover:border-candy-pink/55 flex h-10 min-w-28 items-center justify-between gap-2 rounded-full border border-white/12 px-4 text-sm font-medium text-white shadow-xs backdrop-blur-md transition-colors">
                <ComboboxValue placeholder="Mode" />
              </ComboboxTrigger>
              <ComboboxContent className="bg-candy-purple-dark/95 w-32 rounded-xl border border-white/12 p-1 text-white shadow-xl">
                <ComboboxList>
                  {CHAT_MODES.map((mode) => (
                    <ComboboxItem
                      key={mode}
                      value={mode}
                      className="data-highlighted:bg-candy-purple/30 rounded-lg text-white data-highlighted:text-white"
                    >
                      {mode}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </motion.div>
        </header>

        <main className="flex flex-1 flex-col gap-4">
          <motion.section
            initial={{ opacity: 0, y: -140, rotate: -2.4, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            transition={PANEL_TRANSITION}
            className="bg-candy-purple-dark/55 relative flex-1 overflow-hidden rounded-3xl border border-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-md"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/5 via-transparent to-black/25"
            />
            <div className="relative flex h-full items-center justify-center rounded-2xl border border-white/10 bg-black/15 px-4 py-6 text-sm text-white/55">
              Chat window
            </div>
          </motion.section>

          <motion.footer
            initial={{ opacity: 0, y: 130, rotate: 2.2, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            transition={PANEL_TRANSITION}
            className="bg-candy-purple-dark/72 rounded-3xl border border-white/10 p-2 shadow-xl shadow-black/25 backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                className="h-11 rounded-2xl border-0 bg-transparent text-white shadow-none placeholder:text-white/45 focus-visible:ring-0 dark:bg-transparent"
              />
              <motion.div>
                <Button
                  type="button"
                  size="icon-xs"
                  className="text-candy-purple-dark size-10 rounded-full bg-white/30 hover:bg-white/35"
                  aria-label="Send message"
                >
                  <ArrowUpIcon className="size-5" />
                </Button>
              </motion.div>
            </div>
          </motion.footer>
        </main>
      </div>
    </div>
  );
}
