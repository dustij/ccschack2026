'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { Cpu, Zap, MessageCircle, Brain, Layers, AlertTriangle, Sparkles, Flame, Heart } from 'lucide-react';

// --- Card Components for Scroll Animation ---

type CardProps = {
  i: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  children: React.ReactNode;
  color: string;
};

const Card = ({ i, progress, range, targetScale, children, color }: CardProps) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const scale = useTransform(progress, range, [1, targetScale]);
  
  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
      <motion.div 
        style={{ 
          scale, 
          top: `calc(-5vh + ${i * 25}px)` 
        }} 
        className={`relative flex flex-col items-center justify-center w-[90vw] max-w-[1000px] h-[60vh] max-h-[500px] rounded-[3rem] p-8 md:p-12 border border-white/40 shadow-2xl backdrop-blur-xl origin-top ${color}`}
      >
        {children}
      </motion.div>
    </div>
  );
};

// --- Reused Data & Components ---

const techStack = [
  {
    title: 'Orchestration',
    subtitle: 'POWERED BY PUTER.JS',
    icon: Layers,
    description: 'Handles simultaneous API calls without the latency killing the comedic timing.',
    color: '#3B82F6', // Blue
    lightBg: 'bg-blue-50',
    tags: ['No Latency', 'Real-time', 'Fast'],
    rotate: -1,
  },
  {
    title: 'The Brains',
    subtitle: 'TRIPLE THREAT STACK',
    icon: Brain,
    description: 'GPT-OSS-120B, Llama, and Gemini. Three geniuses, zero agreement.',
    color: '#EC4899', // Pink
    lightBg: 'bg-pink-50',
    tags: ['GPT-OSS', 'Llama 3', 'Gemini'],
    rotate: 2,
  },
  {
    title: 'Personality',
    subtitle: 'MODEL EGO ENGINE',
    icon: Zap,
    description: 'Custom system prompts that encourage "Model Ego," ensuring every response is a debate.',
    color: '#EAB308', // Yellow
    lightBg: 'bg-yellow-50',
    tags: ['Conflict', 'Debate', 'Drama'],
    rotate: -2,
  },
];

const faq = [
  {
    title: 'The Delay',
    subtitle: 'WHY SO SLOW?',
    question: "Why is my answer taking so long?",
    answer: "Because Gemini just corrected GPT-OSS’s math, and Llama is currently making fun of Gemini’s corporate tone. Give them a second; democracy is messy.",
    color: '#10B981', // Emerald
    lightBg: 'bg-emerald-50',
    icon: Flame,
    tags: ['Chaos', 'Democracy'],
    rotate: 1,
  },
  {
    title: 'The Drama',
    subtitle: 'MAKE THEM STOP',
    question: "Can’t you just make them agree?",
    answer: "We could, but then we’d just be another boring chatbot. We’re here for the drama.",
    color: '#8B5CF6', // Violet
    lightBg: 'bg-violet-50',
    icon: Heart,
    tags: ['Boring', 'Drama', 'Fun'],
    rotate: -1,
  },
  {
    title: 'The Utility',
    subtitle: 'IS IT USEFUL?',
    question: "Is this actually useful?",
    answer: "Surprisingly, yes. By watching the models argue, you actually see the strengths and weaknesses of each AI's logic. It’s not a bug; it’s a feature.",
    color: '#F97316', // Orange
    lightBg: 'bg-orange-50',
    icon: Sparkles,
    tags: ['Feature', 'Logic', 'Truth'],
    rotate: 2,
  },
];

export default function StatsSection() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  const cards = [
    {
      color: 'bg-white/90',
      content: (
        <div className="text-center">
          <strong className="block text-5xl md:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 mb-6 drop-shadow-sm">
             They Lied.
          </strong>
          <p className="text-xl md:text-3xl font-medium text-gray-800 leading-relaxed max-w-2xl mx-auto">
             In reality, when you put three of the smartest minds in the world in one room, they don't collaborate—
             <span className="font-black text-pink-600 inline-block ml-2">they compete.</span>
          </p>
        </div>
      )
    },
    {
      color: 'bg-purple-50/95',
      content: (
        <div className="text-center">
          <h3 className="text-3xl md:text-5xl font-black text-purple-900 mb-6">The Conflict Engine</h3>
          <p className="text-lg md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-light">
            We’ve built an AI interface where <strong className="text-purple-600 font-bold">GPT-OSS-120B</strong>, <strong className="text-blue-600 font-bold">Gemini</strong>, and <strong className="text-orange-600 font-bold">Ollama 4</strong> don't just answer your questions; <br/><span className="underline decoration-wavy decoration-red-400 decoration-2 underline-offset-4 font-bold mt-4 inline-block">they fight over them.</span>
          </p>
        </div>
      )
    },
    {
      color: 'bg-white/95',
      content: (
        <div className="text-center relative">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
              <AlertTriangle className="w-12 h-12 text-yellow-500 animate-pulse" />
          </div>
          <h3 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 uppercase tracking-widest">The Experience</h3>
          <p className="text-lg md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Instead of a boring, helpful response, you get a front-row seat to an <span className="font-bold text-purple-600 border-b-4 border-purple-200">intellectual cage match</span>. 
          </p>
          <p className="mt-4 text-gray-500 font-medium">
            It highlights disagreements, roasts logic, and occasionally—if they stop bickering—actually gives you an answer.
          </p>
        </div>
      )
    }
  ];

  return (
    <section className="relative bg-black pt-20" ref={container}>
      
      {/* Scrollable Narrative Cards */}
      <div className="relative mb-32">
        {cards.map((card, i) => {
          const targetScale = 1 - ( (cards.length - i) * 0.05 );
          return (
            <Card 
              key={i} 
              i={i} 
              range={[i * 0.25, 1]} 
              targetScale={targetScale} 
              progress={scrollYProgress}
              color={card.color}
            >
              {card.content}
            </Card>
          );
        })}
      </div>

      {/* Static Content (Tech Stack & FAQ) */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
         {/* The Tech Behind the Chaos */}
         <div className="mb-32">
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center font-black text-white text-3xl md:text-4xl mb-12 drop-shadow-lg"
          >
            The Tech Behind the Chaos
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, rotate: 0, y: -10, zIndex: 10 }}
                className={`relative bg-white rounded-[2.5rem] p-8 pt-12 shadow-2xl border-4 border-white cursor-pointer group transition-all duration-300 ${tech.lightBg}`}
                style={{
                  boxShadow: `0 25px 50px -12px ${tech.color}40, 0 40px 80px -20px ${tech.color}40`,
                  transform: `rotate(${tech.rotate}deg)`,
                }}
              >
                 {/* Decorative Icon Top Right */}
                 <div className="absolute top-6 right-6 opacity-20">
                    <tech.icon size={48} style={{ color: tech.color }} />
                 </div>

                 <div className="relative z-10 flex flex-col items-center text-center h-full">
                    <div className="mb-6">
                      <h3 className="font-black mb-2 text-gray-900 leading-none" style={{ fontSize: '2rem' }}>
                        {tech.title}
                      </h3>
                      <span 
                        className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white inline-block mb-2" 
                        style={{ backgroundColor: tech.color }}
                      >
                         {tech.subtitle}
                      </span>
                    </div>

                    <p className="mb-8 opacity-70 leading-relaxed text-sm font-medium text-slate-600">
                      {tech.description}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-2 justify-center">
                       {tech.tags.map((tag, i) => (
                         <span
                           key={i}
                           className="px-3 py-1.5 rounded-xl font-bold text-white text-[10px] shadow-sm"
                           style={{ backgroundColor: tech.color }}
                         >
                           {tag}
                         </span>
                       ))}
                    </div>
                 </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sarcastic FAQ */}
        <div>
          <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             className="flex items-center justify-center gap-4 mb-12"
          >
            <MessageCircle className="text-white w-10 h-10" />
            <h3 className="text-center font-black text-white text-3xl md:text-4xl drop-shadow-lg">
              Sarcastic "Learn More" FAQ
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {faq.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, rotate: 0, y: -10, zIndex: 10 }}
                className={`relative bg-white rounded-[2.5rem] p-8 pt-12 shadow-2xl border-4 border-white cursor-pointer group transition-all duration-300 ${item.lightBg}`}
                style={{
                   boxShadow: `0 25px 50px -12px ${item.color}40, 0 40px 80px -20px ${item.color}40`,
                   transform: `rotate(${item.rotate}deg)`,
                }}
              >
                {/* Decorative Icon Top Right */}
                 <div className="absolute top-6 right-6 opacity-20">
                    <item.icon size={48} style={{ color: item.color }} />
                 </div>

                 <div className="relative z-10 flex flex-col items-center text-center h-full">
                    <div className="mb-6">
                      <h4 className="font-black mb-2 text-gray-900 leading-none" style={{ fontSize: '1.75rem' }}>
                        {item.title}
                      </h4>
                      <span 
                        className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white inline-block" 
                        style={{ backgroundColor: item.color }}
                      >
                         {item.subtitle}
                      </span>
                    </div>

                    <div className="mb-6 text-left w-full bg-white/50 p-4 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="font-bold text-gray-800 text-sm mb-1">Q: {item.question}</p>
                    </div>

                    <p className="mb-8 opacity-80 leading-relaxed text-sm font-medium text-slate-700">
                      "{item.answer}"
                    </p>

                    <div className="mt-auto flex flex-wrap gap-2 justify-center">
                       {item.tags.map((tag, i) => (
                         <span
                           key={i}
                           className="px-3 py-1.5 rounded-xl font-bold text-white text-[10px] shadow-sm"
                           style={{ backgroundColor: item.color }}
                         >
                           {tag}
                         </span>
                       ))}
                    </div>
                 </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}