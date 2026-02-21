'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User } from 'lucide-react';

import chatgptImg from '../../assets/f465c1af3de1e61f29495c91575913755c2b3846.png';
import geminiImg from '../../assets/044f20097f26c9ff486df6b0a9d2022e7289da17.png';
import ollamaImg from '../../assets/0d5e1c995cdc198f4371739604963e7f0be8f8e8.png';

const personas = {
  chatgpt: {
    name: 'ChatGPT',
    role: 'The Intellectual',
    color: 'bg-emerald-500',
    textColor: 'text-white',
    image: chatgptImg,
  },
  gemini: {
    name: 'Gemini',
    role: 'The Speedster',
    color: 'bg-blue-500',
    textColor: 'text-white',
    image: geminiImg,
  },
  ollama: {
    name: 'Ollama',
    role: 'The Cool One',
    color: 'bg-orange-500',
    textColor: 'text-white',
    image: ollamaImg,
  }
};

type Message = {
  id: string;
  sender: 'user' | 'chatgpt' | 'gemini' | 'ollama';
  text: string;
};

// Mock AI responses generator
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

export default function ChatStage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'chatgpt', text: "I've already analyzed the probability of this conversation being productive. It's low." },
    { id: '2', sender: 'gemini', text: "Hurry up! I'm bored! Let's go go go! ⚡" },
    { id: '3', sender: 'ollama', text: "Chill out. I'm just here to keep it real. No filters. 😎" }
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

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
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
          text: responses.chatgpt
        }]);
      }, 1000);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + 'g',
          sender: 'gemini',
          text: responses.gemini
        }]);
      }, 2500);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + 'cl',
          sender: 'ollama',
          text: responses.ollama
        }]);
        setIsTyping(false);
      }, 4000);

    } catch (error) {
      console.error("Error generating response:", error);
      setIsTyping(false);
    }
  };

  return (
    <section id="chat-stage" className="min-h-screen py-20 px-4 flex flex-col items-center justify-center relative z-10">
      <div className="w-full max-w-[95vw] md:max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-xl rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white"
          style={{
            boxShadow: '0 30px 60px -15px rgba(236, 72, 153, 0.3), 0 50px 100px -25px rgba(168, 85, 247, 0.3)',
            transform: 'perspective(1000px) rotateX(1deg) translateZ(25px)',
          }}
        >
          {/* Header */}
          <div className="bg-white/50 p-6 border-b border-white/50 flex justify-between items-center">
            <h2 className="text-3xl font-black text-gray-800 flex items-center gap-2">
              <Sparkles className="text-purple-500" />
              LIVE STAGE
            </h2>
            <div className="flex -space-x-2">
              {(Object.values(personas) as any[]).map((p) => (
                <div key={p.name} className={`w-12 h-12 rounded-full border-4 border-white flex items-center justify-center overflow-hidden ${p.color}`}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div ref={scrollRef} className="h-[60vh] overflow-y-auto p-6 space-y-6 scrollbar-hide">
            <AnimatePresence mode='popLayout'>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  layout
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg shadow-lg z-10 overflow-hidden
                      ${msg.sender === 'user' ? 'bg-gray-800 text-white' : personas[msg.sender].color}
                    `}>
                      {msg.sender === 'user' ? <User size={18} /> : (
                        <img src={personas[msg.sender].image} alt={personas[msg.sender].name} className="w-full h-full object-cover" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div className={`p-4 rounded-3xl shadow-sm text-lg font-medium relative
                      ${msg.sender === 'user'
                        ? 'bg-gray-800 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none'
                      }
                    `}>
                      {msg.sender !== 'user' && (
                        <span className="text-xs font-bold uppercase block mb-1 opacity-50 text-gray-500">
                          {personas[msg.sender].name}
                        </span>
                      )}
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 text-gray-400 text-sm font-bold ml-14">
                Writing their next roast...
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/80 border-t border-white/50">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Throw them a topic..."
                className="w-full bg-white rounded-full py-4 pl-6 pr-16 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/30 shadow-inner"
              />
              <button
                onClick={handleSend}
                className="absolute right-2 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}