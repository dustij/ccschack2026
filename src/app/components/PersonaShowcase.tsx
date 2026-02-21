import { motion, useScroll, useTransform } from 'motion/react';
import { Heart, Zap, Flame } from 'lucide-react';
import { useRef } from 'react';

const personas = [
  {
    id: 1,
    name: 'Sasha',
    role: 'The Savage',
    ai: 'ChatGPT',
    color: 'var(--candy-pink)',
    gradient: 'from-pink-400 to-pink-600',
    icon: Flame,
    description: 'Cold and brutally honest. Dominates with sharp analysis that spares no one.',
    traits: ['Savage', 'Analytical', 'Ruthless'],
  },
  {
    id: 2,
    name: 'Luna',
    role: 'The Charmer',
    ai: 'Gemini',
    color: 'var(--candy-purple)',
    gradient: 'from-purple-400 to-purple-600',
    icon: Heart,
    description: 'A sweet-talker who enchants with charm. Freely dances between flirting and flattery.',
    traits: ['Enchanting', 'Sweet', 'Flirty'],
  },
  {
    id: 3,
    name: 'Jake',
    role: 'The Wildcard',
    ai: 'Claude',
    color: 'var(--candy-yellow)',
    gradient: 'from-yellow-400 to-yellow-600',
    icon: Zap,
    description: 'Unpredictable responses that flip the mood. Bounces between serious and playful.',
    traits: ['Quirky', 'Unpredictable', 'Humor'],
  },
];

export default function PersonaShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section className="relative py-32 px-6" style={{ position: 'relative' }}>
      <div ref={containerRef} className="max-w-7xl mx-auto relative" style={{ position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2
            className="font-black tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
          >
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 bg-clip-text text-transparent">
              Meet Our AI Personas
            </span>
          </h2>
          <p className="max-w-2xl mx-auto opacity-70" style={{ fontSize: '1.125rem' }}>
            Three unique personalities, one unpredictable talk show
          </p>
        </motion.div>

        {/* Floating Persona Cards */}
        <div className="relative min-h-[800px]" style={{ position: 'relative' }}>
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
                  top: `${index * 15}%`,
                  zIndex: personas.length - index,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="absolute"
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    rotate: index % 2 === 0 ? 2 : -2,
                    y: -10,
                  }}
                  className="w-80 bg-white rounded-[2.5rem] p-8 shadow-2xl border-4 border-white cursor-pointer"
                  style={{
                    boxShadow: `0 25px 50px -12px ${persona.color}40, 0 40px 80px -20px ${persona.color}30`,
                    transform: 'perspective(1000px) rotateX(2deg) translateZ(20px)',
                  }}
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${persona.color}, ${persona.color}80)`,
                    }}
                  >
                    <persona.icon className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Name & Role */}
                  <div className="mb-6">
                    <h3 className="font-black mb-2" style={{ fontSize: '2rem' }}>
                      {persona.name}
                    </h3>
                    <p
                      className="font-black uppercase tracking-wider opacity-60"
                      style={{ fontSize: '0.875rem' }}
                    >
                      {persona.role}
                    </p>
                    <p
                      className="font-black uppercase tracking-wider mt-1"
                      style={{ fontSize: '0.75rem', color: persona.color }}
                    >
                      Powered by {persona.ai}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="mb-6 opacity-70 leading-relaxed">
                    {persona.description}
                  </p>

                  {/* Traits */}
                  <div className="flex flex-wrap gap-2">
                    {persona.traits.map((trait, i) => (
                      <motion.span
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        className="px-4 py-2 rounded-full font-black text-white"
                        style={{
                          background: persona.color,
                          fontSize: '0.875rem',
                        }}
                      >
                        {trait}
                      </motion.span>
                    ))}
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