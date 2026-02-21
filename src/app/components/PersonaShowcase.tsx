'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { Heart, Zap, Flame, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import chatgptImg from '../../assets/f465c1af3de1e61f29495c91575913755c2b3846.png';
import geminiImg from '../../assets/044f20097f26c9ff486df6b0a9d2022e7289da17.png';
import ollamaImg from '../../assets/0d5e1c995cdc198f4371739604963e7f0be8f8e8.png';

const personas = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    role: 'The Intellectual',
    ai: 'OpenAI',
    color: '#10a37f', // ChatGPT Green
    bgGradient: 'from-[#10a37f] to-[#0d8c6d]',
    lightBg: 'bg-[#e0f7f1]',
    icon: Flame,
    image: chatgptImg,
    description: 'Thinks it is the smartest because of its reasoning depth. Always finds a way to correct you.',
    traits: ['Reasoning', 'Deep', 'Superior'],
    shadowColor: 'rgba(16, 163, 127, 0.4)',
    rotate: -2,
  },
  {
    id: 'gemini',
    name: 'Gemini',
    role: 'The Speedster',
    ai: 'Google',
    color: '#4285F4', // Google Blue
    bgGradient: 'from-[#4285F4] via-[#EA4335] to-[#FBBC05]', // Google colors gradient logic needs Tailwind classes, using style instead
    lightBg: 'bg-[#e8f0fe]',
    icon: Zap,
    image: geminiImg,
    description: 'Just wants everyone to hurry up. It is the fastest and has absolutely zero patience for lag.',
    traits: ['Fastest', 'Impatient', 'Hyper'],
    shadowColor: 'rgba(66, 133, 244, 0.4)',
    rotate: 2,
  },
  {
    id: 'ollama',
    name: 'Ollama',
    role: 'The Cool One',
    ai: 'Meta Llama 3',
    color: '#F97316', // Orange
    bgGradient: 'from-[#F97316] to-[#EA580C]',
    lightBg: 'bg-orange-50',
    icon: Sparkles,
    image: ollamaImg,
    description: 'The open-weight, edgy rebel. Thinks being local is cool and corporate clouds are cringe.',
    traits: ['Open-Weight', 'Edgy', 'Cool'],
    shadowColor: 'rgba(249, 115, 22, 0.4)',
    rotate: -1,
  },
];

export default function PersonaShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section
      ref={containerRef}
      className="relative py-32 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-32"
        >
          <h2
            className="font-black tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
          >
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 bg-clip-text text-transparent">
              Meet Our AI Personas
            </span>
          </h2>

        </motion.div>

        {/* Floating Persona Cards */}
        <div className="relative min-h-[800px] w-full flex justify-center perspective-1000">
          {personas.map((persona, index) => {
            const yOffset = useTransform(
              scrollYProgress,
              [0, 1],
              [100 * (index - 1), -100 * (index - 1)]
            );

            return (
              <motion.div
                key={persona.id}
                style={{
                  y: yOffset,
                  left: `${index * 30 + 5}%`,
                  top: index === 1 ? '10%' : '0%',
                  zIndex: personas.length - index,
                  position: 'absolute',
                }}
                initial={{ opacity: 0, scale: 0.8, y: 100 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="w-80 md:w-96"
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    rotate: 0,
                    y: -10,
                    zIndex: 50,
                  }}
                  className={`relative bg-white rounded-[2.5rem] p-8 pt-24 shadow-2xl border-4 border-white cursor-pointer group transition-all duration-300 ${persona.lightBg}`}
                  style={{
                    boxShadow: `0 25px 50px -12px ${persona.shadowColor}, 0 40px 80px -20px ${persona.shadowColor}`,
                    transform: `rotate(${persona.rotate}deg)`,
                  }}
                >
                  {/* Pop-out Character Image */}
                  <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 z-20 pointer-events-none drop-shadow-2xl filter">
                    <motion.img
                      src={persona.image}
                      alt={persona.name}
                      className="w-full h-full object-contain drop-shadow-lg pointer-events-auto"
                      whileHover={{ scale: 1.2, transition: { duration: 0.3 } }}
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 1.5
                      }}
                    />
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10 flex flex-col items-center text-center">

                    {/* Name & Role */}
                    <div className="mb-6">
                      <h3 className="font-black mb-1" style={{ fontSize: '2.5rem', color: '#1a0b14' }}>
                        {persona.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: persona.color }}>
                          {persona.role}
                        </span>
                      </div>
                      <p
                        className="font-bold uppercase tracking-wider opacity-50"
                        style={{ fontSize: '0.75rem' }}
                      >
                        Powered by {persona.ai}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="mb-6 opacity-70 leading-relaxed text-sm font-medium text-slate-600">
                      {persona.description}
                    </p>

                    {/* Traits */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {persona.traits.map((trait, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ scale: 1.1 }}
                          className="px-3 py-1.5 rounded-xl font-bold text-white text-xs shadow-sm"
                          style={{
                            backgroundColor: persona.color,
                          }}
                        >
                          {trait}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 opacity-20">
                    <persona.icon className="w-12 h-12" style={{ color: persona.color }} />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
