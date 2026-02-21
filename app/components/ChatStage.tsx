'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User } from 'lucide-react';

const fighters = {
    grok: {
        name: 'Grok',
        ai: 'xAI',
        color: 'var(--candy-pink)',
        bgClass: 'bg-pink-500',
        emoji: '🔥',
        endpoint: '/api/chat/grok',
        intro: "Oh look, another human with a question. I've seen better prompts trending on X 5 minutes ago. 🔥",
    },
    gemini: {
        name: 'Gemini',
        ai: 'Google',
        color: 'var(--candy-purple)',
        bgClass: 'bg-purple-500',
        emoji: '💜',
        endpoint: '/api/chat/gemini',
        intro: "Greetings. I hold the #1 SWE-bench score for 2026. I'll attempt to simplify my answer to your level. 💜",
    },
    llama: {
        name: 'Llama',
        ai: 'Meta',
        color: 'var(--candy-yellow)',
        bgClass: 'bg-yellow-400',
        emoji: '⚡',
        endpoint: '/api/chat/llama',
        intro: "Llama 4 here — open-source, free, running at 300 tokens/sec. Ask me anything. Freedom is the best feature. ⚡",
    },
} as const;

type FighterKey = keyof typeof fighters;

type Message = {
    id: string;
    sender: 'user' | FighterKey;
    text: string;
    streaming?: boolean;
};

type HistoryMsg = { role: 'user' | 'assistant'; content: string };

async function streamFighter(
    fighter: FighterKey,
    history: HistoryMsg[],
    onChunk: (c: string) => void,
    onDone: () => void,
) {
    try {
        const res = await fetch(fighters[fighter].endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: history }),
        });
        if (!res.ok || !res.body) { onChunk(`[Error ${res.status}]`); onDone(); return; }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            onChunk(decoder.decode(value, { stream: true }));
        }
    } catch (err) {
        onChunk(`[Network error]`);
    }
    onDone();
}

export default function ChatStage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'grok', text: fighters.grok.intro },
        { id: '2', sender: 'gemini', text: fighters.gemini.intro },
        { id: '3', sender: 'llama', text: fighters.llama.intro },
    ]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const historyRef = useRef<HistoryMsg[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isStreaming) return;
        const userText = input.trim();
        setInput('');
        setIsStreaming(true);

        const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText };
        setMessages(prev => [...prev, userMsg]);

        const currentHistory: HistoryMsg[] = [...historyRef.current, { role: 'user', content: userText }];

        const msgIds = {
            grok: `${Date.now()}-grok`,
            gemini: `${Date.now()}-gemini`,
            llama: `${Date.now()}-llama`,
        };

        setMessages(prev => [
            ...prev,
            { id: msgIds.grok, sender: 'grok', text: '', streaming: true },
            { id: msgIds.gemini, sender: 'gemini', text: '', streaming: true },
            { id: msgIds.llama, sender: 'llama', text: '', streaming: true },
        ]);

        const finalTexts: Record<FighterKey, string> = { grok: '', gemini: '', llama: '' };
        let doneCount = 0;

        const onChunk = (f: FighterKey) => (chunk: string) => {
            finalTexts[f] += chunk;
            setMessages(prev => prev.map(m => m.id === msgIds[f] ? { ...m, text: finalTexts[f] } : m));
        };

        const onDone = (f: FighterKey) => () => {
            setMessages(prev => prev.map(m => m.id === msgIds[f] ? { ...m, streaming: false } : m));
            if (++doneCount === 3) {
                historyRef.current = [...currentHistory, {
                    role: 'assistant',
                    content: `Grok: ${finalTexts.grok}\n\nGemini: ${finalTexts.gemini}\n\nLlama: ${finalTexts.llama}`,
                }];
                setIsStreaming(false);
            }
        };

        await Promise.allSettled([
            streamFighter('grok', currentHistory, onChunk('grok'), onDone('grok')),
            streamFighter('gemini', currentHistory, onChunk('gemini'), onDone('gemini')),
            streamFighter('llama', currentHistory, onChunk('llama'), onDone('llama')),
        ]);
    };

    return (
        <section id="chat-stage" className="min-h-screen py-20 px-4 flex flex-col items-center justify-center relative z-10">
            <div className="w-full max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h2
                        className="font-black text-white mb-3"
                        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: 'var(--font-black-ops), sans-serif' }}
                    >
                        <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
                            LIVE STAGE
                        </span>
                    </h2>
                    <p className="text-white/60">Try a prompt — watch all three fighters respond simultaneously</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/5 backdrop-blur-xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/10"
                    style={{ boxShadow: '0 30px 60px -15px rgba(236,72,153,0.2), 0 50px 100px -25px rgba(168,85,247,0.2)' }}
                >
                    {/* Header */}
                    <div className="bg-white/5 p-6 border-b border-white/10 flex justify-between items-center">
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                            <Sparkles className="text-candy-purple" size={20} />
                            BATTLE PREVIEW
                        </h3>
                        <div className="flex -space-x-2">
                            {(Object.entries(fighters) as [FighterKey, typeof fighters[FighterKey]][]).map(([key, f]) => (
                                <div key={key} className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-lg ${f.bgClass}`}>
                                    {f.emoji}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div ref={scrollRef} className="h-[50vh] overflow-y-auto p-6 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {messages.map((msg) => {
                                const fighter = msg.sender !== 'user' ? fighters[msg.sender] : null;
                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        layout
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex items-end gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-base shadow-lg ${msg.sender === 'user' ? 'bg-gray-700' : fighter!.bgClass}`}>
                                                {msg.sender === 'user' ? <User size={16} className="text-white" /> : fighter!.emoji}
                                            </div>
                                            <div className={`p-4 rounded-2xl text-base font-medium relative ${msg.sender === 'user' ? 'bg-gray-800 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                                                {msg.sender !== 'user' && (
                                                    <span className="text-xs font-black uppercase block mb-1 opacity-50" style={{ color: fighter!.color }}>
                                                        {fighter!.name} · {fighter!.ai}
                                                    </span>
                                                )}
                                                <span className="whitespace-pre-wrap">{msg.text}</span>
                                                {msg.streaming && <span className="inline-block w-1.5 h-4 bg-current ml-1 animate-pulse rounded-sm" />}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white/5 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={isStreaming ? 'Fighters are battling...' : 'Throw them a topic...'}
                                disabled={isStreaming}
                                className="flex-1 bg-white/10 rounded-full py-4 px-6 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-base disabled:opacity-50"
                            />
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleSend}
                                disabled={!input.trim() || isStreaming}
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg disabled:opacity-40"
                                style={{ background: 'linear-gradient(135deg, var(--candy-pink), var(--candy-purple))' }}
                            >
                                <Send size={18} />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
