import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ArrowLeft, Sparkles, User } from 'lucide-react';

// Import AI logos
import chatgptLogo from '../../assets/1f7acd67555d424234fe2f4185a731db7ca96760.png';
import geminiLogo from '../../assets/0c6f0925fd667be9ae2195488325235a4653f79a.png';
import claudeLogo from '../../assets/e7f38dd691db90f7e3383f99a23e3a41a3ba1aaa.png';

// ── Fighter Config ────────────────────────────────────────────────────────────
const fighters = {
  grok: {
    name: 'Grok',
    role: 'The Rebel',
    ai: 'xAI Grok-2',
    color: 'var(--candy-pink)',
    bgColor: 'bg-pink-500',
    emoji: '🔥',
    avatar: chatgptLogo,
    endpoint: '/api/chat/grok',
  },
  gemini: {
    name: 'Gemini',
    role: 'The Academic',
    ai: 'Google Gemini 2.5 Pro',
    color: 'var(--candy-purple)',
    bgColor: 'bg-purple-500',
    emoji: '💜',
    avatar: geminiLogo,
    endpoint: '/api/chat/gemini',
  },
  llama: {
    name: 'Llama',
    role: 'The People\'s Champ',
    ai: 'Meta Llama 4',
    color: 'var(--candy-yellow)',
    bgColor: 'bg-yellow-400',
    emoji: '⚡',
    avatar: claudeLogo,
    endpoint: '/api/chat/llama',
  },
} as const;

type FighterKey = keyof typeof fighters;

type Message = {
  id: string;
  sender: 'user' | FighterKey;
  text: string;
  streaming?: boolean;
  timestamp: Date;
};

type HistoryMessage = { role: 'user' | 'assistant'; content: string };

// ── Stream a single fighter ───────────────────────────────────────────────────
async function streamFighter(
  fighter: FighterKey,
  history: HistoryMessage[],
  onChunk: (chunk: string) => void,
  onDone: () => void,
) {
  const res = await fetch(fighters[fighter].endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history }),
  });

  if (!res.ok || !res.body) {
    onChunk(`[Error: ${res.status} ${res.statusText}]`);
    onDone();
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
  onDone();
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ChatInterface({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'grok', text: "Oh look, another human with questions. Let's see if you can keep up. 🔥", timestamp: new Date() },
    { id: '2', sender: 'gemini', text: "Greetings. I've processed approximately 1M tokens today alone. What shall we discuss? 💜", timestamp: new Date() },
    { id: '3', sender: 'llama', text: "Hey! Llama 4 here — open-source, fast, and FREE. Ask me anything! ⚡", timestamp: new Date() },
  ]);

  // Conversation history sent to every model (neutral, no persona bias)
  const historyRef = useRef<HistoryMessage[]>([]);

  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userText = input.trim();
    setInput('');
    setIsStreaming(true);

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    // Build history for the API (only user/assistant turns)
    const currentHistory: HistoryMessage[] = [
      ...historyRef.current,
      { role: 'user', content: userText },
    ];

    // Placeholder streaming messages for all three fighters
    const msgIds: Record<FighterKey, string> = {
      grok: `${Date.now()}-grok`,
      gemini: `${Date.now()}-gemini`,
      llama: `${Date.now()}-llama`,
    };

    setMessages(prev => [
      ...prev,
      { id: msgIds.grok, sender: 'grok', text: '', streaming: true, timestamp: new Date() },
      { id: msgIds.gemini, sender: 'gemini', text: '', streaming: true, timestamp: new Date() },
      { id: msgIds.llama, sender: 'llama', text: '', streaming: true, timestamp: new Date() },
    ]);

    const finalTexts: Record<FighterKey, string> = { grok: '', gemini: '', llama: '' };
    let doneCount = 0;

    const onChunk = (fighter: FighterKey) => (chunk: string) => {
      finalTexts[fighter] += chunk;
      setMessages(prev =>
        prev.map(m =>
          m.id === msgIds[fighter] ? { ...m, text: finalTexts[fighter] } : m,
        ),
      );
    };

    const onDone = (fighter: FighterKey) => () => {
      setMessages(prev =>
        prev.map(m =>
          m.id === msgIds[fighter] ? { ...m, streaming: false } : m,
        ),
      );
      doneCount++;
      if (doneCount === 3) {
        // Update shared history with a combined assistant turn
        historyRef.current = [
          ...currentHistory,
          {
            role: 'assistant',
            content: `Grok: ${finalTexts.grok}\n\nGemini: ${finalTexts.gemini}\n\nLlama: ${finalTexts.llama}`,
          },
        ];
        setIsStreaming(false);
      }
    };

    // Fire all three in parallel
    await Promise.allSettled([
      streamFighter('grok', currentHistory, onChunk('grok'), onDone('grok')),
      streamFighter('gemini', currentHistory, onChunk('gemini'), onDone('gemini')),
      streamFighter('llama', currentHistory, onChunk('llama'), onDone('llama')),
    ]);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-yellow-900/20" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

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
                  style={{ fontSize: '1.75rem', fontFamily: "'Black Ops One', sans-serif" }}
                >
                  <Sparkles className="text-pink-400" />
                  MODEL MAYHEM
                </h1>
                <p className="text-white/60 text-sm font-bold">Three AIs, One Savage Roast Battle</p>
              </div>
            </div>

            {/* Fighter Avatars */}
            <div className="flex items-center gap-3">
              {(Object.entries(fighters) as [FighterKey, typeof fighters[FighterKey]][]).map(([key, f]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className={`w-14 h-14 rounded-2xl ${f.bgColor} flex items-center justify-center border-2 border-white/20 shadow-lg cursor-pointer overflow-hidden`}
                  title={`${f.name} — ${f.role}`}
                >
                  <img src={f.avatar} alt={f.name} className="w-10 h-10 object-contain" />
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
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => {
                  const fighter = msg.sender !== 'user' ? fighters[msg.sender] : null;
                  return (
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
                              : fighter!.bgColor + ' border-2 border-white/20'
                            }
                          `}
                        >
                          {msg.sender === 'user' ? (
                            <User size={20} className="text-white" />
                          ) : (
                            <img src={fighter!.avatar} alt={fighter!.name} className="w-8 h-8 object-contain" />
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
                              ? `0 10px 30px -5px ${fighter!.color}40`
                              : '0 10px 30px -5px rgba(0,0,0,0.5)',
                          }}
                        >
                          {msg.sender !== 'user' && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-black uppercase tracking-wider" style={{ color: fighter!.color }}>
                                {fighter!.name}
                              </span>
                              <span className="text-xs opacity-40">•</span>
                              <span className="text-xs opacity-40 font-bold">{fighter!.ai}</span>
                            </div>
                          )}
                          <p className="text-lg leading-relaxed font-medium whitespace-pre-wrap">
                            {msg.text}
                            {msg.streaming && (
                              <span className="inline-block w-2 h-5 bg-current ml-1 animate-pulse rounded-sm" />
                            )}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isStreaming && messages.every(m => !m.streaming) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-white/60 text-sm font-bold ml-16"
                >
                  <div className="flex gap-1">
                    {['bg-pink-400', 'bg-purple-400', 'bg-yellow-400'].map((color, i) => (
                      <motion.div
                        key={i}
                        className={`w-2 h-2 rounded-full ${color}`}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                  Fighters are typing...
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
                  placeholder={isStreaming ? 'Wait for the fighters to finish...' : 'Throw them a topic and watch the chaos unfold...'}
                  disabled={isStreaming}
                  className="flex-1 bg-white/90 rounded-full py-5 px-6 text-lg font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-pink-400/50 shadow-inner transition-all disabled:opacity-60"
                />
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isStreaming}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 flex items-center justify-center text-white shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{ boxShadow: '0 10px 30px -5px rgba(236, 72, 153, 0.6)' }}
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