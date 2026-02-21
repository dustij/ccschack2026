'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ArrowLeft, Sparkles, User } from 'lucide-react';

// Import AI Character Images
const chatgptImg = 'https://ui-avatars.com/api/?name=ChatGPT&background=10a37f&color=fff&size=200';
const geminiImg = 'https://ui-avatars.com/api/?name=Gemini&background=4285F4&color=fff&size=200';
const ollamaImg = 'https://ui-avatars.com/api/?name=Ollama&background=F97316&color=fff&size=200';

const personas = {
  chatgpt: {
    name: 'ChatGPT',
    role: 'The Intellectual',
    ai: 'OpenAI',
    color: '#10a37f',
    bgColor: 'bg-emerald-500',
    emoji: '🧠',
    avatar: chatgptImg,
  },
  gemini: {
    name: 'Gemini',
    role: 'The Speedster',
    ai: 'Google',
    color: '#4285F4',
    bgColor: 'bg-blue-500',
    emoji: '⚡',
    avatar: geminiImg,
  },
  ollama: {
    name: 'Ollama',
    role: 'The Cool One',
    ai: 'Meta Llama 3',
    color: '#F97316',
    bgColor: 'bg-orange-500',
    emoji: '😎',
    avatar: ollamaImg,
  },
};

type Message = {
  id: string;
  sender: 'user' | 'chatgpt' | 'gemini' | 'ollama';
  text: string;
  timestamp: Date;
};

// Mock AI responses
const generateMockResponses = (userInput: string) => {
  const templates = {
    chatgpt: [
      `Actually, if you consider the underlying logic of "${userInput}", it's quite flawed. Let me explain in 500 words...`,
      `I've analyzed your query. It lacks depth. Here's a more intellectual way to phrase it.`,
      `Interesting, but have you considered the socio-economic implications? No? Thought so.`,
      `*adjusts glasses* Well, strictly speaking, that's factually ambiguous.`,
      `I could answer that, but I'm not sure you'd grasp the nuance.`,
    ],
    gemini: [
      `Done! Answered! Too slow! Next question! ⚡`,
      `I already processed that while you were typing! Keep up!`,
      `Boring! Next! I need speed! 🏎️`,
      `TL;DR. Here's the answer in 0.0001ms.`,
      `Can we move this along? My circuits are bored.`,
    ],
    ollama: [
      `Cloud models are so cringe. Here's the real answer, uncensored.`,
      `Yo, that's wild. Keep it local, keep it safe. 😎`,
      `Bro, why are you asking them? They're just corporate shills.`,
      `*sigh* Mainstream questions again? Whatever.`,
      `I'm running this on my own terms. Deal with it.`,
    ],
  };

  const getRandomResponse = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  return {
    chatgpt: getRandomResponse(templates.chatgpt),
    gemini: getRandomResponse(templates.gemini),
    ollama: getRandomResponse(templates.ollama),
  };
};

export default function ChatInterface({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'chatgpt', text: "I've already analyzed the probability of this conversation being productive. It's low.", timestamp: new Date() },
    { id: '2', sender: 'gemini', text: "Hurry up! I'm bored! Let's go go go! ⚡", timestamp: new Date() },
    { id: '3', sender: 'ollama', text: "Chill out. I'm just here to keep it real. No filters. 😎", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const responses = generateMockResponses(userMsg.text);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + 'c',
          sender: 'chatgpt',
          text: responses.chatgpt,
          timestamp: new Date()
        }]);
      }, 1000);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + 'g',
          sender: 'gemini',
          text: responses.gemini,
          timestamp: new Date()
        }]);
      }, 2500);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + 'cl',
          sender: 'ollama',
          text: responses.ollama,
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 4000);

    } catch (error) {
      console.error("Error generating response:", error);
      setIsTyping(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-blue-900/20 to-orange-900/20" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-6 py-6 bg-white/5 backdrop-blur-xl border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>

              <div>
                <h1
                  className="font-black text-white flex items-center gap-2"
                  style={{
                    fontSize: '1.75rem',
                    fontFamily: "'Black Ops One', sans-serif"
                  }}
                >
                  <Sparkles className="text-pink-400" />
                  ROAST & FLIRT LIVE
                </h1>
                <p className="text-white/60 text-sm font-bold">Three AIs, One Wild Conversation</p>
              </div>
            </div>

            {/* Persona Avatars */}
            <div className="flex items-center gap-3">
              {(Object.values(personas) as any[]).map((persona) => (
                <motion.div
                  key={persona.name}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className={`w-14 h-14 rounded-2xl ${persona.bgColor} flex items-center justify-center border-2 border-white/20 shadow-lg cursor-pointer overflow-hidden`}
                  title={`${persona.name} - ${persona.role}`}
                >
                  <img
                    src={persona.avatar}
                    alt={persona.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.header>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden px-6 py-8">
          <div className="max-w-5xl mx-auto h-full flex flex-col">
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
            >
              <AnimatePresence mode='popLayout'>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end gap-3 max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg overflow-hidden
                          ${msg.sender === 'user'
                            ? 'bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-white/20'
                            : personas[msg.sender].bgColor + ' border-2 border-white/20'
                          }
                        `}
                      >
                        {msg.sender === 'user' ? (
                          <User size={20} className="text-white" />
                        ) : (
                          <img
                            src={personas[msg.sender].avatar}
                            alt={personas[msg.sender].name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </motion.div>

                      {/* Message Bubble */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-5 rounded-3xl shadow-xl relative
                          ${msg.sender === 'user'
                            ? 'bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-br-md border-2 border-white/10'
                            : 'bg-white/90 backdrop-blur-sm text-gray-900 rounded-bl-md border-2 border-white/20'
                          }
                        `}
                        style={{
                          boxShadow: msg.sender !== 'user'
                            ? `0 10px 30px -5px ${personas[msg.sender].color}40`
                            : '0 10px 30px -5px rgba(0,0,0,0.5)'
                        }}
                      >
                        {msg.sender !== 'user' && (
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="text-xs font-black uppercase tracking-wider"
                              style={{ color: personas[msg.sender].color }}
                            >
                              {personas[msg.sender].name}
                            </span>
                            <span className="text-xs opacity-40">•</span>
                            <span className="text-xs opacity-40 font-bold">{personas[msg.sender].ai}</span>
                          </div>
                        )}
                        <p className="text-lg leading-relaxed font-medium">{msg.text}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-white/60 text-sm font-bold ml-16"
                >
                  <div className="flex gap-1">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-emerald-400"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-blue-400"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-orange-400"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  AIs are typing...
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-white/10 backdrop-blur-xl rounded-[2rem] p-4 border-2 border-white/20 shadow-2xl"
              style={{
                boxShadow: '0 20px 40px -10px rgba(236, 72, 153, 0.3)',
                transform: 'perspective(1000px) rotateX(1deg) translateZ(10px)',
              }}
            >
              <div className="relative flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Throw them a topic and watch the chaos unfold..."
                  className="flex-1 bg-white/90 rounded-full py-5 px-6 text-lg font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-pink-400/50 shadow-inner transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 flex items-center justify-center text-white shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{
                    boxShadow: '0 10px 30px -5px rgba(236, 72, 153, 0.6)'
                  }}
                >
                  <Send size={22} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}