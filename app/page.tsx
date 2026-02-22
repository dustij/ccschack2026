'use client';

import { AmbientParticles } from '@/components/ui/ambient-particles';
import geminiImg from '@/public/assets/gemini.png';
import chatgptImg from '@/public/assets/gpt.png';
import ollamaImg from '@/public/assets/ollama.png';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Flame, Sparkles, Zap, type LucideIcon } from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';
import NextLink from 'next/link';
import { useRef } from 'react';
import { Link as ScrollLink } from 'react-scroll';

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
  amount: 0.24,
} as const;

type Persona = {
  id: string;
  name: string;
  role: string;
  ai: string;
  color: string;
  lightBg: string;
  icon: LucideIcon;
  image: StaticImageData;
  description: string;
  traits: string[];
  shadowColor: string;
  rotate: number;
};

const AI_PERSONAS: Persona[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    role: 'The Intellectual',
    ai: 'OpenAI',
    color: '#10a37f',
    lightBg: 'bg-[#e0f7f1]',
    icon: Flame,
    image: chatgptImg,
    description:
      'Thinks it is the smartest because of its reasoning depth. Always finds a way to correct you.',
    traits: ['Reasoning', 'Deep', 'Superior'],
    shadowColor: 'rgba(16, 163, 127, 0.4)',
    rotate: -2,
  },
  {
    id: 'gemini',
    name: 'Gemini',
    role: 'The Speedster',
    ai: 'Google',
    color: '#4285f4',
    lightBg: 'bg-[#e8f0fe]',
    icon: Zap,
    image: geminiImg,
    description:
      'Just wants everyone to hurry up. It is the fastest and has absolutely zero patience for lag.',
    traits: ['Fastest', 'Impatient', 'Hyper'],
    shadowColor: 'rgba(66, 133, 244, 0.4)',
    rotate: 2,
  },
  {
    id: 'ollama',
    name: 'Ollama',
    role: 'The Cool One',
    ai: 'Meta Llama 3',
    color: '#f97316',
    lightBg: 'bg-orange-50',
    icon: Sparkles,
    image: ollamaImg,
    description:
      'The open-weight, edgy rebel. Thinks being local is cool and corporate clouds are cringe.',
    traits: ['Open-Weight', 'Edgy', 'Cool'],
    shadowColor: 'rgba(249, 115, 22, 0.4)',
    rotate: -1,
  },
];

function PersonaCard({
  persona,
  index,
  interactive = false,
}: {
  persona: Persona;
  index: number;
  interactive?: boolean;
}) {
  const Icon = persona.icon;

  return (
    <motion.article
      whileHover={interactive ? { scale: 1.045, rotate: 0, y: -10 } : undefined}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={`group relative rounded-[2.5rem] border-4 border-white/90 p-8 pt-24 text-center ${persona.lightBg} ${interactive ? 'cursor-pointer' : ''}`}
      style={{
        boxShadow: `0 25px 50px -12px ${persona.shadowColor}, 0 40px 80px -20px ${persona.shadowColor}`,
        rotate: persona.rotate,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="pointer-events-none absolute -top-20 left-1/2 z-20 h-44 w-44 -translate-x-1/2 drop-shadow-2xl sm:-top-24 sm:h-48 sm:w-48 xl:-top-28 xl:h-56 xl:w-56">
        <motion.div
          className="relative h-full w-full"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 4.2 + index * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.65,
          }}
        >
          <Image
            src={persona.image}
            alt={persona.name}
            fill
            className="object-contain"
            sizes="(min-width: 1280px) 14rem, (min-width: 1024px) 12rem, 11rem"
          />
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6">
          <h3 className="text-5xl font-black tracking-tight text-[#1a0b14]">
            {persona.name}
          </h3>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-bold tracking-[0.14em] text-white uppercase"
              style={{ backgroundColor: persona.color }}
            >
              {persona.role}
            </span>
          </div>

          <p className="mt-3 text-[0.72rem] font-bold tracking-[0.2em] text-black/45 uppercase">
            Powered by {persona.ai}
          </p>
        </div>

        <p className="mb-7 text-sm leading-relaxed font-medium text-slate-600/90">
          {persona.description}
        </p>

        <div className="flex flex-wrap justify-center gap-2.5">
          {persona.traits.map((trait) => (
            <motion.span
              key={`${persona.id}-${trait}`}
              whileHover={interactive ? { scale: 1.08 } : undefined}
              className="rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: persona.color }}
            >
              {trait}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="absolute top-5 right-5 opacity-20">
        <Icon className="h-10 w-10" style={{ color: persona.color }} />
      </div>
    </motion.article>
  );
}

export default function Home() {
  const meetAisRef = useRef<HTMLElement | null>(null);
  const currentYear = new Date().getFullYear();
  const { scrollYProgress } = useScroll({
    target: meetAisRef,
    offset: ['start end', 'end start'],
  });

  const leftCardY = useTransform(scrollYProgress, [0, 1], [-90, 90]);
  const centerCardY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const rightCardY = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const desktopParallaxY = [leftCardY, centerCardY, rightCardY] as const;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
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
                <NextLink
                  href="/chat"
                  className="dark:bg-candy-purple-dark/85 dark:hover:bg-candy-purple-dark/80 relative rounded-md bg-purple-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-xs hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 dark:focus-visible:outline-purple-500"
                >
                  Get started
                </NextLink>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...CTA_TRANSITION, delay: 0.42 }}
              >
                <ScrollLink
                  to="about-project"
                  href="#about-project"
                  smooth
                  duration={550}
                  className="cursor-pointer text-base/6 font-semibold text-gray-900 dark:text-white"
                >
                  Learn more <span aria-hidden="true">→</span>
                </ScrollLink>
              </motion.div>
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
              <div className="pointer-events-none relative z-[-1] h-full w-full overflow-hidden rounded-xl lg:absolute lg:top-9 lg:left-100 xl:left-113">
                <iframe
                  title="3D greeting robot animation"
                  src="https://my.spline.design/genkubgreetingrobot-3AGOK06E2VWQMgtsn90pbrsr/"
                  className="h-[calc(100%+28px)] w-[calc(100%+56px)] border-0"
                />
              </div>
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
          ref={meetAisRef}
          id="meet-the-ais"
          className="relative mx-auto max-w-7xl px-6 pb-0 lg:px-8"
        >
          <div className="relative overflow-visible rounded-[2.75rem] px-4 py-14 sm:overflow-hidden sm:px-8 sm:py-16 lg:py-24">
            <motion.div
              className="relative text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={MEET_AIS_VIEWPORT}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <h2
                className="font-bangers mb-5 px-2 leading-[1.08] tracking-wide text-transparent sm:px-0 sm:leading-[1.02]"
                style={{ fontSize: 'clamp(2.25rem, 11vw, 5.75rem)' }}
              >
                <span className="inline-block bg-linear-to-r from-pink-500 via-purple-500 to-yellow-500 bg-clip-text pr-[0.08em]">
                  Meet Our AI Personas
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-base font-medium text-white/70 sm:text-lg">
                Their personalities are stable. Their egos are not.
              </p>
            </motion.div>

            <div className="relative mt-28 flex flex-col gap-20 sm:mt-20 sm:gap-16 lg:hidden">
              {AI_PERSONAS.map((persona, index) => (
                <motion.div
                  key={persona.id}
                  className="mx-auto w-full max-w-sm"
                  initial={{ opacity: 0, scale: 0.94, y: 64 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={MEET_AIS_VIEWPORT}
                  transition={{
                    duration: 0.55,
                    ease: 'easeOut',
                    delay: index * 0.14,
                  }}
                >
                  <PersonaCard persona={persona} index={index} />
                </motion.div>
              ))}
            </div>

            <div
              className="relative mt-24 hidden min-h-140 w-full lg:block"
              style={{ perspective: '1200px' }}
            >
              {AI_PERSONAS.map((persona, index) => (
                <motion.div
                  key={persona.id}
                  className="absolute w-80 xl:w-96"
                  style={{
                    left: `${index * 30 + 5}%`,
                    top: index === 1 ? '12%' : '2%',
                    zIndex: AI_PERSONAS.length - index,
                  }}
                  initial={{ opacity: 0, scale: 0.84, y: 96 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={MEET_AIS_VIEWPORT}
                  transition={{
                    duration: 0.62,
                    ease: 'easeOut',
                    delay: index * 0.2,
                  }}
                >
                  <motion.div
                    className="will-change-transform"
                    style={{ y: desktopParallaxY[index] }}
                  >
                    <PersonaCard persona={persona} index={index} interactive />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* ABOUT THE PROJECT */}
        <section
          id="about-project"
          className="relative mx-auto min-h-screen max-w-7xl px-6 pt-16 lg:px-8"
        >
          <motion.div
            className="rounded-[2.5rem] border-4 border-white/90 bg-white/85 p-8 shadow-[0_30px_70px_-18px_rgba(20,16,45,0.35)] backdrop-blur-sm sm:p-12"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.24 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h2 className="font-bangers text-candy-purple-dark text-5xl tracking-wide sm:text-6xl">
              About the project
            </h2>
            <p className="mt-5 max-w-3xl text-base font-medium text-slate-700 sm:text-lg">
              In a world increasingly shaped by artificial intelligence, model
              capabilities are advancing at an astonishing pace. So naturally,
              we asked: if one AI is powerful… wouldn’t more be better?
            </p>
            <p className="mt-4 max-w-3xl text-base font-medium text-slate-700 sm:text-lg">
              Inspired by a viral clip of two AI models endlessly persuading
              each other to “keep the conversation chill,” we wondered what
              would happen if multiple agents responded to the same prompt
              simultaneously.
            </p>
            <p className="mt-4 max-w-3xl text-base font-medium text-slate-700 sm:text-lg">
              This project explores what happens when multiple AI models
              interact in real time.Instead of a single polished response, you
              witness debate, love, derailment, and ego clashes.
            </p>
          </motion.div>
          <motion.div
            className="mt-20 pb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="text-xl font-semibold tracking-wide text-white/90 sm:text-2xl">
              Thank you for checking out our project.
            </p>
            <p className="mt-3 text-sm font-medium text-white/70 sm:text-base">
              We appreciate your time and hope you had fun exploring the chaos.
            </p>
            <p className="mt-6 text-sm font-medium text-white/70 sm:text-base">
              Created by:
            </p>
            <ul className="mt-3 text-sm font-medium text-white/70 sm:text-base">
              <li>Dusti Johnson</li>
              <li>Sapnish Sharma</li>
              <li>Rajdeep Sah</li>
              <li>Ariel L</li>
              <li>Ujjwal Sitaula</li>
            </ul>
          </motion.div>
        </section>
        <footer className="mx-auto max-w-7xl px-6 pb-10 lg:px-8">
          <div className="rounded-2xl border border-white/20 bg-black/20 px-4 py-4 text-center text-xs font-medium tracking-wide text-white/75 backdrop-blur-sm sm:text-sm">
            &copy; {currentYear} AI Personas Project. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
