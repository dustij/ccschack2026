'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AmbientParticles } from '@/components/ui/ambient-particles';

const CONTENT_TRANSITION = {
  duration: 0.52,
  ease: 'easeOut',
} as const;

const CTA_TRANSITION = {
  duration: 0.42,
  delay: 0.36,
  ease: 'easeOut',
} as const;

export default function Home() {
  return (
    <div className="to-candy-purple-dark relative isolate min-h-screen overflow-hidden bg-white bg-linear-60 dark:from-black">
      <AmbientParticles />
      <div
        aria-hidden="true"
        className="absolute top-10 left-[calc(50%-4rem)] z-0 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:top-[calc(50%-30rem)] lg:left-48 xl:left-[calc(50%-24rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
          }}
          className="from-candy-blue to-candy-pink aspect-1108/632 w-277 bg-linear-to-r opacity-20"
          // className="aspect-1108/632 w-277 bg-linear-to-r from-[#80caff] to-[#4f46e5] opacity-20"
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="relative z-10 mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40"
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
          <h1 className="font-bangers mt-10 text-5xl tracking-tight text-pretty text-gray-900 sm:text-8xl dark:text-white">
            Too Many AI agents? Perfect.
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
            One prompt. Multiple AI agents. No adult supervision.{' '}
          </p>{' '}
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
            Watch them argue over who deserves to respond, spiral into feedback
            loops, or abandon logic entirely when “flirt mode” is enabled.
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
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={CONTENT_TRANSITION}
          className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-32"
        >
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            {/* <div className="relative ml-32 h-full w-full">
              <iframe
                src="https://my.spline.design/genkubgreetingrobot-3AGOK06E2VWQMgtsn90pbrsr/"
                className="h-full w-full rounded-xl"
              />
            </div> */}

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
        </motion.div>
      </motion.div>
    </div>
  );
}
