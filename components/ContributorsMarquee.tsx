'use client';

import { motion } from 'framer-motion';

type Contributor = {
  name: string;
  linkedin: string;
};

const CONTRIBUTORS: Contributor[] = [
  {
    name: 'Sapnish Sharma',
    linkedin: 'https://www.linkedin.com/in/sapnish-sharma-7107a9280/',
  },
  { name: 'Rajdeep Sah', linkedin: 'https://www.linkedin.com/in/rajdeepsah/' },
  {
    name: 'Dusti Johnson',
    linkedin: 'https://www.linkedin.com/in/dusti-johnson/',
  },
  {
    name: 'Ari Lee',
    linkedin: 'https://www.linkedin.com/in/moonyoung-lee-565043342/?locale=en',
  },
  {
    name: 'Ujjwal Sitaula',
    linkedin: 'https://www.linkedin.com/in/ujjwalsitaula839/',
  },
];

// Duplicate the list so the marquee feels seamless
const TRACK = [...CONTRIBUTORS, ...CONTRIBUTORS, ...CONTRIBUTORS];

export function ContributorsMarquee() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="mt-12 w-full"
    >
      {/* heading */}
      <p className="mb-6 text-center text-sm font-semibold tracking-[0.22em] text-white/50 uppercase">
        Created&nbsp;by
      </p>

      {/* marquee wrapper */}
      <div
        className="relative overflow-hidden"
        /* fade-out edges */
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}
        onMouseEnter={(e) =>
          ((
            e.currentTarget.firstChild as HTMLElement
          ).style.animationPlayState = 'paused')
        }
        onMouseLeave={(e) =>
          ((
            e.currentTarget.firstChild as HTMLElement
          ).style.animationPlayState = 'running')
        }
      >
        <div
          className="contributors-track flex gap-6 whitespace-nowrap"
          style={{ animation: 'marquee-rtl 28s linear infinite' }}
        >
          {TRACK.map((c, i) => (
            <div
              key={`${c.name}-${i}`}
              className="inline-flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm"
            >
              {/* Avatar initial */}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-extrabold text-white shadow-lg">
                {c.name.charAt(0)}
              </span>

              {/* Name */}
              <span className="text-sm font-semibold text-white/90">
                {c.name}
              </span>

              {/* LinkedIn button */}
              <a
                href={c.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group flex items-center gap-1.5 rounded-lg bg-[#0A66C2]/80 px-3 py-1.5 text-xs font-bold text-white transition-all duration-200 hover:scale-105 hover:bg-[#0A66C2] hover:shadow-[0_0_12px_rgba(10,102,194,0.6)]"
              >
                {/* LinkedIn "in" icon (inline SVG, no extra dep) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* keyframe injected via a style tag so no Tailwind plugin needed */}
      <style>{`
        @keyframes marquee-rtl {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </motion.div>
  );
}
