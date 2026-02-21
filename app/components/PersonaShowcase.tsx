'use client';

import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { Heart, Zap, Flame, LucideIcon } from 'lucide-react';
import { useRef } from 'react';

const fighters = [
    {
        id: 1,
        name: 'Grok',
        role: 'The Rebel',
        ai: 'xAI Grok-2',
        color: 'var(--candy-pink)',
        icon: Flame,
        description: 'Rebellious and unfiltered. Live access to X, zero chill, and a savage wit to match.',
        traits: ['Real-Time', 'Unfiltered', 'Savage'],
    },
    {
        id: 2,
        name: 'Gemini',
        role: 'The Academic',
        ai: 'Google Gemini 2.5 Pro',
        color: 'var(--candy-purple)',
        icon: Heart,
        description: '#1 on SWE-bench 2026. Wields a 1M-token context window like a philosophical weapon.',
        traits: ['Elite', 'Analytical', 'Merciless'],
    },
    {
        id: 3,
        name: 'Llama',
        role: "The People's Champ",
        ai: 'Meta Llama 4',
        color: 'var(--candy-yellow)',
        icon: Zap,
        description: "Open-source, 300+ tokens/sec, and free forever. The fighter that can't be bought.",
        traits: ['Open-Source', 'Fast', 'Scrappy'],
    },
];

// Each card is its own component so hooks are never called inside .map()
function FighterCard({
    fighter,
    index,
    scrollYProgress,
}: {
    fighter: typeof fighters[0];
    index: number;
    scrollYProgress: MotionValue<number>;
}) {
    const yOffset = useTransform(
        scrollYProgress,
        [0, 1],
        [100 * (index - 1), -100 * (index - 1)],
    );
    const Icon: LucideIcon = fighter.icon;

    return (
        <motion.div
            style={{
                y: yOffset,
                left: `${index * 30 + 5}%`,
                top: `${index * 15}%`,
                zIndex: fighters.length - index,
                position: 'absolute',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
        >
            <motion.div
                whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2, y: -10 }}
                className="w-80 bg-white rounded-[2.5rem] p-8 shadow-2xl border-4 border-white cursor-pointer"
                style={{
                    boxShadow: `0 25px 50px -12px ${fighter.color}40, 0 40px 80px -20px ${fighter.color}30`,
                }}
            >
                <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${fighter.color}, ${fighter.color}80)` }}
                >
                    <Icon className="w-10 h-10 text-white" />
                </motion.div>

                <div className="mb-6">
                    <h3 className="font-black mb-1 text-gray-900" style={{ fontSize: '2rem' }}>{fighter.name}</h3>
                    <p className="font-black uppercase tracking-wider opacity-60 text-gray-700 text-sm">{fighter.role}</p>
                    <p className="font-black uppercase tracking-wider mt-1 text-xs" style={{ color: fighter.color }}>
                        Powered by {fighter.ai}
                    </p>
                </div>

                <p className="mb-6 opacity-70 leading-relaxed text-gray-700">{fighter.description}</p>

                <div className="flex flex-wrap gap-2">
                    {fighter.traits.map((trait) => (
                        <motion.span
                            key={trait}
                            whileHover={{ scale: 1.1 }}
                            className="px-4 py-2 rounded-full font-black text-white text-sm"
                            style={{ background: fighter.color }}
                        >
                            {trait}
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function PersonaShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    return (
        <section id="persona-showcase" className="relative py-32 px-6">
            <div ref={containerRef} className="max-w-7xl mx-auto relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2
                        className="font-black tracking-tight mb-6"
                        style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontFamily: 'var(--font-black-ops), sans-serif' }}
                    >
                        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 bg-clip-text text-transparent">
                            Meet The Fighters
                        </span>
                    </h2>
                    <p className="max-w-2xl mx-auto opacity-70 text-lg text-white">
                        Three AI models. Three personas. One roast battle.
                    </p>
                </motion.div>

                <div className="relative min-h-[800px]">
                    {fighters.map((fighter, index) => (
                        <FighterCard
                            key={fighter.id}
                            fighter={fighter}
                            index={index}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
