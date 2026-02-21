'use client';

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export default function Hero({ onStartShow }: { onStartShow: () => void }) {

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center -mt-20">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 relative"
        >
          {/* Ambient Glow Effects */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen animate-pulse" />
          <div className="absolute top-10 right-10 w-48 h-48 bg-purple-600/30 rounded-full blur-[60px] pointer-events-none mix-blend-screen" />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-black tracking-tight leading-[1.1] relative z-10"
            style={{ 
              fontSize: 'clamp(4rem, 10vw, 7.5rem)',
              fontFamily: "'Black Ops One', sans-serif",
              color: 'white',
              textShadow: '0 0 10px rgba(255,255,255,0.3), 0 10px 30px rgba(0,0,0,0.5), 4px 4px 0px rgba(0,0,0,0.2)',
            }}
          >
            <span className="block relative">
              ROAST
              {/* Subtle rim light effect on text */}
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-b from-white/50 to-transparent pointer-events-none mix-blend-overlay" aria-hidden="true">ROAST</span>
            </span>
            <span className="block relative">
              & FLIRT
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-b from-white/50 to-transparent pointer-events-none mix-blend-overlay" aria-hidden="true">& FLIRT</span>
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98, y: 4, boxShadow: '0 0px 0 #7c3aed, 0 0px 0 rgba(0,0,0,0)' }}
              className="px-8 py-3 rounded-full font-black uppercase tracking-widest text-white text-sm relative overflow-hidden cursor-pointer"
              style={{
                background: 'linear-gradient(to bottom, var(--candy-pink), var(--candy-purple))',
                border: '2px solid rgba(255,255,255,0.2)',
                boxShadow: `
                  0 4px 0 #7c3aed,
                  0 10px 15px rgba(124, 58, 237, 0.5),
                  inset 0 3px 2px rgba(255,255,255,0.5),
                  inset 0 -3px 2px rgba(0,0,0,0.1)
                `,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
              onClick={onStartShow}
            >
              Start the Show
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="px-6 py-3 text-sm rounded-full font-black uppercase tracking-wider bg-white transition-all relative overflow-hidden cursor-pointer"
              style={{ 
                border: '3px solid var(--candy-purple)',
                boxShadow: `
                  inset 0 2px 0 rgba(255, 255, 255, 1),
                  inset 0 -2px 0 rgba(168, 85, 247, 0.4),
                  inset 3px 3px 6px rgba(255, 255, 255, 0.9),
                  inset -3px -3px 6px rgba(168, 85, 247, 0.3),
                  inset 0 0 20px rgba(255, 255, 255, 0.6),
                  0 2px 4px rgba(0, 0, 0, 0.1),
                  0 6px 16px rgba(0, 0, 0, 0.2),
                  0 10px 30px rgba(168, 85, 247, 0.4)
                `,
                textShadow: '0 1px 3px rgba(168, 85, 247, 0.5), 0 -1px 0 rgba(255, 255, 255, 0.8)',
                background: 'linear-gradient(145deg, #ffffff, #f3f3f3)',
              }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Content - Spline Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative w-full h-[600px] rounded-[3rem] overflow-hidden shadow-2xl bg-black/20 backdrop-blur-sm"
        >
          <iframe 
            src='https://my.spline.design/beepboopbemyvalentine-KYbtUL5Q6ynnrg04Wz1q7HOQ/' 
            frameBorder='0' 
            width='100%' 
            height='100%' 
            className="absolute inset-0"
            title="Spline 3D Animation"
          />
          
          {/* Cover Spline watermark */}
          <div className="absolute bottom-0 right-0 w-40 h-16 pointer-events-none" style={{ background: 'linear-gradient(135deg, transparent 0%, #1a1a2e 40%, #16213e 100%)' }} />
        </motion.div>
      </div>
    </section>
  );
}
