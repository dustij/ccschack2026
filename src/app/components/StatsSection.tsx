import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

const stats = [
  { id: 1, value: 10000, suffix: '+', label: 'Daily Chats', color: 'var(--candy-pink)' },
  { id: 2, value: 84, suffix: '%', label: 'Satisfaction', color: 'var(--candy-purple)' },
  { id: 3, value: 3, suffix: ' AI', label: 'Personas', color: 'var(--candy-yellow)' },
  { id: 4, value: 99, suffix: '%', label: 'Fun Guaranteed', color: 'var(--candy-blue)' },
];

function CountUp({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <div ref={ref} className="font-black" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}>
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
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
              By The Numbers
            </span>
          </h2>
        </motion.div>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                y: -10,
                rotate: index % 2 === 0 ? 2 : -2,
              }}
              className="bg-white rounded-[2rem] p-8 shadow-2xl border-4 border-white text-center"
              style={{
                boxShadow: `0 25px 50px -12px ${stat.color}40, 0 40px 80px -20px ${stat.color}30`,
                transform: 'perspective(1000px) rotateX(2deg) translateZ(20px)',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
                style={{ color: stat.color }}
              >
                <CountUp end={stat.value} suffix={stat.suffix} />
              </motion.div>
              <p
                className="font-black uppercase tracking-wider mt-4"
                style={{ fontSize: '1.125rem' }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {[
            {
              title: 'Real-Time Chat',
              description: 'AIs respond instantly with vivid, dynamic conversations',
              emoji: '⚡',
              color: 'var(--candy-yellow)',
            },
            {
              title: 'Emotional Layout',
              description: 'UI reacts emotionally to the conversation content',
              emoji: '💫',
              color: 'var(--candy-purple)',
            },
            {
              title: 'Unpredictable',
              description: 'Every conversation unfolds differently—never boring',
              emoji: '🎭',
              color: 'var(--candy-pink)',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white rounded-[2rem] p-8 shadow-xl border-2 border-white"
              style={{
                boxShadow: `0 20px 40px -10px ${feature.color}30, 0 30px 60px -15px ${feature.color}20`,
                transform: 'perspective(1000px) rotateX(2deg) translateZ(15px)',
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                style={{ background: feature.color }}
              >
                <span style={{ fontSize: '2rem' }}>{feature.emoji}</span>
              </div>
              <h3 className="font-black mb-3" style={{ fontSize: '1.5rem' }}>
                {feature.title}
              </h3>
              <p className="opacity-70 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}