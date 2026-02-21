'use client';

import { motion } from 'motion/react';

export default function Hero({ onStartShow }: { onStartShow: () => void }) {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
            <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="space-y-8"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="font-black tracking-tight leading-[1.1]"
                        style={{
                            fontSize: 'clamp(4rem, 10vw, 7.5rem)',
                            fontFamily: 'var(--font-black-ops), sans-serif',
                            color: 'white',
                            textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        }}
                    >
                        <span className="block">MODEL</span>
                        <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
                            MAYHEM
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-white/70 text-xl leading-relaxed max-w-md"
                    >
                        Three AI fighters. One prompt. Grok, Gemini & Llama roast each other in real-time.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-full font-black uppercase tracking-wider text-white transition-all"
                            style={{
                                background: 'linear-gradient(135deg, var(--candy-pink), var(--candy-purple))',
                                border: '2px solid rgba(255,255,255,0.3)',
                                boxShadow: '0 8px 20px rgba(236, 72, 153, 0.4)',
                                fontFamily: 'var(--font-black-ops), sans-serif',
                            }}
                            onClick={onStartShow}
                        >
                            Start the Battle
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-full font-black uppercase tracking-wider text-white transition-all"
                            style={{
                                border: '2px solid rgba(255,255,255,0.3)',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                            }}
                            onClick={() => document.getElementById('persona-showcase')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Meet the Fighters
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Right Content — Spline Robot */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative w-full h-[600px] rounded-[3rem] overflow-hidden shadow-2xl"
                >
                    <iframe
                        src="https://my.spline.design/genkubgreetingrobot-3AGOK06E2VWQMgtsn90pbrsr/"
                        frameBorder="0"
                        width="100%"
                        height="100%"
                        className="absolute inset-0"
                        title="3D Robot"
                    />
                    {/* Cover Spline watermark */}
                    <div
                        className="absolute bottom-0 right-0 w-40 h-16 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, transparent 0%, #000 50%)' }}
                    />
                </motion.div>
            </div>
        </section>
    );
}
