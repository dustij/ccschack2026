import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function Hero({ onStartShow }: { onStartShow: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-black tracking-tight leading-[1.1]"
            style={{ 
              fontSize: 'clamp(4rem, 10vw, 7.5rem)',
              fontFamily: "'Black Ops One', sans-serif",
              color: 'white',
              textShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            <span className="block">
              ROAST
            </span>
            <span className="block">
              & FLIRT
            </span>
          </motion.h1>

          

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full font-black uppercase tracking-wider text-white transition-all relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--candy-pink), var(--candy-purple))',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: `
                  inset 0 1px 0 rgba(255, 255, 255, 0.5),
                  inset 0 -1px 0 rgba(0, 0, 0, 0.3),
                  inset 2px 2px 3px rgba(255, 255, 255, 0.3),
                  inset -2px -2px 3px rgba(0, 0, 0, 0.3),
                  0 4px 12px rgba(0, 0, 0, 0.25),
                  0 8px 20px rgba(236, 72, 153, 0.3)
                `,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.3)',
              }}
              onClick={onStartShow}
            >
              Start the Show
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full font-black uppercase tracking-wider bg-white transition-all relative overflow-hidden"
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
          className="relative w-full h-[600px] rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <iframe
            src="https://my.spline.design/genkubgreetingrobot-3AGOK06E2VWQMgtsn90pbrsr/"
            frameBorder="0"
            width="100%"
            height="100%"
            className="absolute inset-0"
          />
          {/* Cover Spline watermark */}
          <div className="absolute bottom-0 right-0 w-40 h-16 pointer-events-none" style={{ background: 'linear-gradient(135deg, transparent 0%, #1a1a2e 40%, #16213e 100%)' }} />
        </motion.div>
      </div>
    </section>
  );
}