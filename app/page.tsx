'use client';

import { AmbientParticles } from '@/components/ui/ambient-particles';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CONTENT_TRANSITION = {
  duration: 0.52,
  ease: 'easeOut',
} as const;

const CTA_TRANSITION = {
  duration: 0.42,
  delay: 0.36,
  ease: 'easeOut',
} as const;

const MEET_AIS_VIEWPORT = {
  once: true,
  amount: 0.18,
} as const;

const AI_PERSONAS = [
  {
    name: 'ChatGPT',
    role: 'THE INTELLECTUAL',
    poweredBy: 'POWERED BY OPENAI',
    description:
      'Thinks it is the smartest because of its reasoning depth. Always finds a way to correct you.',
    traits: ['Reasoning', 'Deep', 'Superior'],
    avatarLabel: 'GPT',
    avatarClass: 'from-emerald-100 to-emerald-300',
    roleClass: 'bg-emerald-500',
    traitClass: 'bg-emerald-500/90',
    cardClass: 'lg:max-w-[23rem] lg:translate-y-0 lg:z-30',
    spark: '~',
  },
  {
    name: 'Gemini',
    role: 'THE SPEEDSTER',
    poweredBy: 'POWERED BY GOOGLE',
    description:
      'Just wants everyone to hurry up. It is the fastest and has absolutely zero patience for lag.',
    traits: ['Fastest', 'Impatient', 'Hyper'],
    avatarLabel: 'GEM',
    avatarClass: 'from-blue-100 to-indigo-200',
    roleClass: 'bg-blue-500',
    traitClass: 'bg-blue-500/90',
    cardClass: 'lg:-mx-8 lg:max-w-[24rem] lg:translate-y-14 lg:z-20',
    spark: '//',
  },
  {
    name: 'Ollama',
    role: 'THE COOL ONE',
    poweredBy: 'POWERED BY META LLAMA 3',
    description:
      'The open-weight, edgy rebel. Thinks being local is cool and corporate clouds are cringe.',
    traits: ['Open-Weight', 'Edgy', 'Cool'],
    avatarLabel: 'OLL',
    avatarClass: 'from-orange-100 to-amber-200',
    roleClass: 'bg-orange-500',
    traitClass: 'bg-orange-500/90',
    cardClass: 'lg:max-w-[23rem] lg:translate-y-6 lg:z-30',
    spark: '*',
  },
] as const;

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden="true"
        className="to-candy-purple-dark pointer-events-none fixed inset-0 z-0 overflow-hidden bg-white bg-linear-60 dark:from-black"
      >
        <AmbientParticles />
        <div className="absolute top-10 left-[calc(50%-4rem)] z-0 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:top-[calc(50%-30rem)] lg:left-48 xl:left-[calc(50%-24rem)]">
          <div
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
            className="from-candy-blue to-candy-pink aspect-1108/632 w-277 bg-linear-to-r opacity-20"
            // className="aspect-1108/632 w-277 bg-linear-to-r from-[#80caff] to-[#4f46e5] opacity-20"
          />
        </div>
      </div>
      <div className="relative z-10">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="relative mx-auto min-h-screen max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40"
        >
          <motion.div
            initial={{ opacity: 0, y: -28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={CONTENT_TRANSITION}
            className="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:pt-8"
          >
            {/* <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=purple&shade=600"
            className="h-11 dark:hidden"
          />
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=purple&shade=500"
            className="h-11 not-dark:hidden"
          /> */}
            {/* <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-purple-50 px-3 py-1 text-sm/6 font-semibold text-purple-600 ring-1 ring-purple-600/20 ring-inset dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/25">
                What's new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm/6 font-medium text-gray-600 dark:text-gray-300">
                <span>Just shipped v1.0</span>
                <ChevronRightIcon
                  aria-hidden="true"
                  className="size-5 text-gray-400 dark:text-gray-500"
                />
              </span>
            </a>
          </div> */}
            <h1 className="font-bangers mt-10 text-7xl tracking-tight text-pretty text-gray-900 sm:text-8xl dark:text-white">
              Too Many AI agents? Perfect.
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
              One prompt. Multiple AI agents. No adult supervision.{' '}
            </p>{' '}
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
              Watch them argue over who deserves to respond, spiral into
              feedback loops, or abandon logic entirely when “flirt mode” is
              enabled.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={CTA_TRANSITION}
                className="get-started-border relative flex p-px"
              >
                <Link
                  href="/chat"
                  className="dark:bg-candy-purple-dark/85 dark:hover:bg-candy-purple-dark/80 relative rounded-md bg-purple-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-xs hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 dark:focus-visible:outline-purple-500"
                >
                  Get started
                </Link>
              </motion.div>
              <motion.a
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...CTA_TRANSITION, delay: 0.42 }}
                href="#"
                className="text-base/6 font-semibold text-gray-900 dark:text-white"
              >
                Learn more <span aria-hidden="true">→</span>
              </motion.a>
            </div>
          </motion.div>
          {/* <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={CONTENT_TRANSITION}
            className="mx-auto mt-16 flex max-w-2xl flex-col sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none lg:flex-row xl:ml-32"
          > */}
          <div className="mx-auto mt-16 flex max-w-2xl flex-col sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none lg:flex-row xl:ml-32">
            <div className="flex h-96 max-w-3xl sm:max-w-5xl lg:max-w-none">
              {/* <div className="h-full w-[1000] bg-white"></div> */}
              {/* <div className="relative h-full w-1000 bg-white"> */}
              <iframe
                src="https://my.spline.design/genkubgreetingrobot-3AGOK06E2VWQMgtsn90pbrsr/"
                className="pointer-events-none z-[-1] h-full w-full rounded-xl lg:absolute lg:top-9 lg:left-100 xl:left-113"
              />
              {/* </div> */}

              {/* <img
              alt="App screenshot"
              src="https://tailwindcss.com/plus-assets/img/component-images/project-app-screenshot.png"
              width={2432}
              height={1442}
              className="w-304 rounded-md bg-gray-50 shadow-xl ring-1 ring-gray-900/10 dark:hidden"
            />
            <img
              alt="App screenshot"
              src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
              width={2432}
              height={1442}
              className="w-304 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 not-dark:hidden"
            /> */}
            </div>
          </div>
          {/* </motion.div> */}
        </motion.div>
        {/* MEET THE AIs */}
        <section
          id="meet-the-ais"
          className="relative mx-auto max-w-7xl px-6 pb-28 lg:px-8"
        >
          <div className="relative overflow-hidden rounded-[2.75rem] px-4 py-12 sm:px-8 sm:py-16">
            {/* <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute -top-16 -left-8 h-56 w-56 rounded-full bg-emerald-500/25 blur-3xl" />
              <div className="absolute top-10 right-0 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
              <div className="absolute right-1/2 bottom-0 h-52 w-52 translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />
              <div className="absolute top-24 left-[10%] h-52 w-40 rotate-6 rounded-[2rem] bg-fuchsia-500/15" />
              <div className="absolute top-8 right-[10%] h-60 w-44 -rotate-8 rounded-[2rem] bg-indigo-500/20" />
            </div> */}

            <motion.h2
              className="font-bangers relative text-center text-7xl tracking-wide text-transparent sm:text-8xl"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={MEET_AIS_VIEWPORT}
              transition={{ duration: 0.42, ease: 'easeOut', delay: 0.06 }}
            >
              <span className="bg-linear-to-r from-[#ff62bf] via-[#9e6bff] to-[#ffcd65] bg-clip-text">
                Meet the AIs
              </span>
            </motion.h2>

            <div className="relative mt-14 flex flex-col gap-20 sm:gap-16 lg:mt-20 lg:flex-row lg:items-end lg:justify-center lg:gap-8">
              {AI_PERSONAS.map((persona, index) => (
                <motion.article
                  key={persona.name}
                  className={`relative mx-auto mt-10 flex w-full max-w-sm flex-col items-center rounded-[2.25rem] bg-white px-8 pt-20 pb-10 text-center shadow-[0_22px_60px_rgba(0,0,0,0.4)] lg:mt-0 ${persona.cardClass}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: [0, -10, 0] }}
                  viewport={MEET_AIS_VIEWPORT}
                  transition={{
                    opacity: {
                      duration: 0.45,
                      ease: 'easeOut',
                      delay: 0.12 + index * 0.12,
                    },
                    y: {
                      duration: 4.4 + index * 0.35,
                      ease: 'easeInOut',
                      delay: 0.62 + index * 0.12,
                      repeat: Infinity,
                    },
                  }}
                  style={{ willChange: 'transform, opacity' }}
                >
                  <span className="absolute top-8 right-7 text-3xl font-semibold text-black/15">
                    {persona.spark}
                  </span>

                  <div
                    className={`absolute -top-12 flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-b sm:-top-16 sm:h-32 sm:w-32 ${persona.avatarClass} shadow-[0_18px_35px_rgba(0,0,0,0.22)]`}
                  >
                    <span className="absolute -top-3 h-4 w-4 rounded-full bg-white/70" />
                    <span className="text-lg font-black tracking-[0.16em] text-black/70">
                      {persona.avatarLabel}
                    </span>
                  </div>

                  <h3 className="text-5xl font-black tracking-tight text-[#180f1f] sm:text-6xl">
                    {persona.name}
                  </h3>

                  <p
                    className={`mt-4 inline-flex rounded-full px-4 py-1 text-sm font-extrabold tracking-[0.04em] text-white ${persona.roleClass}`}
                  >
                    {persona.role}
                  </p>

                  <p className="mt-4 text-sm font-semibold tracking-[0.12em] text-black/45">
                    {persona.poweredBy}
                  </p>

                  <p className="mt-8 text-xl leading-8 text-slate-500">
                    {persona.description}
                  </p>

                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {persona.traits.map((trait) => (
                      <span
                        key={trait}
                        className={`inline-flex rounded-full px-4 py-1 text-sm font-bold text-white ${persona.traitClass}`}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
