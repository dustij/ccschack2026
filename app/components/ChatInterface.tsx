'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ArrowLeft, Sparkles, User, StopCircle } from 'lucide-react';

// ── Fighter config ────────────────────────────────────────────────────────────
const fighters = {
    grok: {
        name: 'Grok',
        role: 'The Rebel',
        ai: 'xAI Grok-2',
        color: 'var(--candy-pink)',
        bgClass: 'bg-pink-500',
        logo: '/logos/1f7acd67555d424234fe2f4185a731db7ca96760.png',
        endpoint: '/api/chat/grok',
    },
    gemini: {
        name: 'Gemini',
        role: 'The Academic',
        ai: 'Google Gemini',
        color: 'var(--candy-purple)',
        bgClass: 'bg-purple-500',
        logo: '/logos/0c6f0925fd667be9ae2195488325235a4653f79a.png',
        endpoint: '/api/chat/gemini',
    },
    llama: {
        name: 'Llama',
        role: "People's Champ",
        ai: 'Meta Llama 4',
        color: 'var(--candy-yellow)',
        bgClass: 'bg-yellow-400',
        logo: '/logos/e7f38dd691db90f7e3383f99a23e3a41a3ba1aaa.png',
        endpoint: '/api/chat/llama',
    },
} as const;

type FighterKey = keyof typeof fighters;
type HistoryMsg = { role: 'user' | 'assistant'; content: string };
type FighterHistories = Record<FighterKey, HistoryMsg[]>;
type RoundSnapshot = Record<FighterKey, string>;

type Message = {
    id: string;
    sender: 'user' | FighterKey | 'divider';
    text: string;
    streaming?: boolean;
    timestamp: Date;
};

// ── Stream one fighter from the API ──────────────────────────────────────────
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
        if (!res.ok || !res.body) { onChunk(`⚠️ ${res.status}`); onDone(); return; }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            onChunk(decoder.decode(value, { stream: true }));
        }
    } catch {
        onChunk('⚠️ Network error');
    }
    onDone();
}

// ── Fire all 3 fighters in parallel for one round ────────────────────────────
function runRound(
    histories: FighterHistories,
    addMessages: (msgs: Message[]) => void,
    patchMessage: (id: string, patch: Partial<Message>) => void,
): Promise<RoundSnapshot> {
    return new Promise(resolve => {
        const ts = Date.now();
        const ids: Record<FighterKey, string> = {
            grok: `${ts}-grok`,
            gemini: `${ts}-gemini`,
            llama: `${ts}-llama`,
        };

        addMessages([
            { id: ids.grok, sender: 'grok', text: '', streaming: true, timestamp: new Date() },
            { id: ids.gemini, sender: 'gemini', text: '', streaming: true, timestamp: new Date() },
            { id: ids.llama, sender: 'llama', text: '', streaming: true, timestamp: new Date() },
        ]);

        const finals: RoundSnapshot = { grok: '', gemini: '', llama: '' };
        let doneCount = 0;

        (Object.keys(fighters) as FighterKey[]).forEach(f => {
            streamFighter(
                f,
                histories[f],
                chunk => {
                    finals[f] += chunk;
                    patchMessage(ids[f], { text: finals[f] });
                },
                () => {
                    patchMessage(ids[f], { streaming: false });
                    if (++doneCount === 3) resolve(finals);
                },
            );
        });
    });
}

// ── Build fire-back histories for the next round ─────────────────────────────
function nextHistories(
    question: string,
    snapshot: RoundSnapshot,
): FighterHistories {
    // Only include fighters that actually responded (non-empty)
    const others = (self: FighterKey) => {
        const lines = (Object.keys(fighters) as FighterKey[])
            .filter(f => f !== self && snapshot[f].trim().length > 0)
            .map(f => `${fighters[f].name} said: "${snapshot[f].trim()}"`);
        return lines.length > 0
            ? lines.join('\n\n')
            : 'The others have not responded yet.';
    };

    const fireBack = (self: FighterKey): HistoryMsg[] => {
        const myPrev = snapshot[self].trim();
        // If this fighter didn't respond last round, give them a fresh start
        if (!myPrev) {
            return [{ role: 'user', content: question }];
        }
        return [
            { role: 'user', content: question },
            { role: 'assistant', content: myPrev },
            { role: 'user', content: `The other AIs responded:\n\n${others(self)}\n\nFire back. Prove you're better. Stay in character. Keep it punchy.` },
        ];
    };

    return { grok: fireBack('grok'), gemini: fireBack('gemini'), llama: fireBack('llama') };
}


// ── Component ─────────────────────────────────────────────────────────────────
export default function ChatInterface({ onBack }: { onBack: () => void }) {
    const FIGHTER_KEYS = Object.keys(fighters) as FighterKey[];

    const [messages, setMessages] = useState<Message[]>([
        { id: '0g', sender: 'grok', text: "Ready. Ask me anything and watch the others scramble to catch up. 🔥", timestamp: new Date() },
        { id: '0m', sender: 'gemini', text: "Prepared. I'll give you the most accurate, well-reasoned answer available. 💜", timestamp: new Date() },
        { id: '0l', sender: 'llama', text: "Open-source and here. No API bill, no lock-in, no nonsense. Hit me. ⚡", timestamp: new Date() },
    ]);

    const [input, setInput] = useState('');
    const MAX_AUTO_ROUNDS = 3; // cap auto-loop to save tokens
    const [isBattling, setIsBattling] = useState(false);
    const [canContinue, setCanContinue] = useState(false);
    const continueRef = useRef<(() => void) | null>(null);
    const [roundNum, setRoundNum] = useState(0);
    const stopRef = useRef(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const addMessages = useCallback((msgs: Message[]) => setMessages(prev => [...prev, ...msgs]), []);
    const patchMessage = useCallback((id: string, patch: Partial<Message>) =>
        setMessages(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m)), []);

    const stopBattle = useCallback(() => { stopRef.current = true; setIsBattling(false); setCanContinue(false); }, []);
    const continueBattle = useCallback(() => { if (continueRef.current) { setCanContinue(false); continueRef.current(); } }, []);

    const startBattle = async (question: string) => {
        stopRef.current = false;
        setIsBattling(true);
        setRoundNum(0);
        setCanContinue(false);

        // Add user message
        addMessages([{ id: `u-${Date.now()}`, sender: 'user', text: question, timestamp: new Date() }]);

        // Round 1 — all fighters answer the user's question directly
        let round = 1;
        setRoundNum(round);
        let histories: FighterHistories = {
            grok: [{ role: 'user', content: question }],
            gemini: [{ role: 'user', content: question }],
            llama: [{ role: 'user', content: question }],
        };
        let snapshot = await runRound(histories, addMessages, patchMessage);

        // Subsequent rounds — fighters react to each other
        while (!stopRef.current) {
            // After MAX_AUTO_ROUNDS, pause and wait for user to click Continue
            if (round >= MAX_AUTO_ROUNDS) {
                setIsBattling(false);
                setCanContinue(true);
                // Wait until user clicks Continue or Stop
                await new Promise<void>(res => { continueRef.current = res; });
                if (stopRef.current) break;
                setIsBattling(true);
                setCanContinue(false);
            }

            await new Promise(r => setTimeout(r, 2000));
            if (stopRef.current) break;

            round++;
            setRoundNum(round);

            // Round divider
            addMessages([{
                id: `div-${round}-${Date.now()}`,
                sender: 'divider',
                text: `Round ${round}`,
                timestamp: new Date(),
            }]);

            await new Promise(r => setTimeout(r, 400));
            if (stopRef.current) break;

            histories = nextHistories(question, snapshot);
            snapshot = await runRound(histories, addMessages, patchMessage);
        }

        setIsBattling(false);
    };

    const handleSend = () => {
        if (!input.trim() || isBattling) return;
        const q = input.trim();
        setInput('');
        startBattle(q);
    };

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-yellow-900/20" />
            <div className="absolute top-10 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <motion.header
                    initial={{ y: -80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="px-6 py-4 bg-white/5 backdrop-blur-xl border-b border-white/10 flex-shrink-0"
                >
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.1, x: -4 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onBack}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                            >
                                <ArrowLeft size={18} />
                            </motion.button>
                            <div>
                                <h1 className="font-black text-white flex items-center gap-2 text-xl"
                                    style={{ fontFamily: 'var(--font-black-ops), sans-serif' }}>
                                    <Sparkles className="text-pink-400" size={18} />
                                    MODEL MAYHEM
                                </h1>
                                <p className="text-white/40 text-xs font-semibold">
                                    {isBattling ? `⚔️ Round ${roundNum} — battle in progress` : 'Ask a question to start the battle'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {FIGHTER_KEYS.map(key => (
                                <motion.div key={key} whileHover={{ scale: 1.1, y: -3 }}
                                    className={`w-11 h-11 rounded-xl ${fighters[key].bgClass} flex items-center justify-center border border-white/20 overflow-hidden`}
                                    title={fighters[key].name}>
                                    <img src={fighters[key].logo} alt={fighters[key].name} className="w-8 h-8 object-contain" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.header>

                {/* Chat */}
                <div className="flex-1 overflow-hidden px-4 pt-4 pb-2">
                    <div className="max-w-5xl mx-auto h-full flex flex-col">
                        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
                            <AnimatePresence mode="popLayout">
                                {messages.map(msg => {
                                    // Round divider
                                    if (msg.sender === 'divider') {
                                        return (
                                            <motion.div key={msg.id}
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                className="flex items-center gap-3 py-1">
                                                <div className="flex-1 h-px bg-white/10" />
                                                <span className="text-white/30 text-xs font-black uppercase tracking-widest">
                                                    ⚔️ {msg.text}
                                                </span>
                                                <div className="flex-1 h-px bg-white/10" />
                                            </motion.div>
                                        );
                                    }

                                    const isUser = msg.sender === 'user';
                                    const fighter = !isUser ? fighters[msg.sender as FighterKey] : null;

                                    return (
                                        <motion.div key={msg.id}
                                            initial={{ opacity: 0, y: 14 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.22 }}
                                            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`flex items-end gap-2 max-w-[74%] ${isUser ? 'flex-row-reverse' : ''}`}>
                                                {/* Avatar */}
                                                <div className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden shadow-md
                                                    ${isUser ? 'bg-gray-800 border border-white/10' : fighter!.bgClass + ' border border-white/20'}`}>
                                                    {isUser
                                                        ? <User size={16} className="text-white" />
                                                        : <img src={fighter!.logo} alt={fighter!.name} className="w-6 h-6 object-contain" />}
                                                </div>

                                                {/* Bubble */}
                                                <div
                                                    className={`px-4 py-3 rounded-2xl shadow-md
                                                        ${isUser
                                                            ? 'bg-gray-800 text-white rounded-br-sm'
                                                            : 'bg-white/92 text-gray-900 rounded-bl-sm'}`}
                                                    style={{ boxShadow: !isUser ? `0 6px 20px -4px ${fighter!.color}28` : undefined }}
                                                >
                                                    {!isUser && (
                                                        <div className="flex items-center gap-1.5 mb-1">
                                                            <span className="text-xs font-black uppercase tracking-wide"
                                                                style={{ color: fighter!.color }}>{fighter!.name}</span>
                                                            <span className="text-gray-400 text-xs">·</span>
                                                            <span className="text-gray-400 text-xs">{fighter!.ai}</span>
                                                        </div>
                                                    )}
                                                    <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">
                                                        {msg.text}
                                                        {msg.streaming && (
                                                            <span className="inline-block w-1.5 h-3.5 bg-current ml-1 align-middle animate-pulse rounded-sm" />
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Controls */}
                        <div className="pt-3 space-y-2 flex-shrink-0">
                            <AnimatePresence>
                                {isBattling && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                                        className="flex justify-center"
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                                            onClick={stopBattle}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-black uppercase tracking-wider"
                                            style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', boxShadow: '0 6px 20px -4px rgba(239,68,68,0.5)' }}
                                        >
                                            <StopCircle size={16} />
                                            Stop Battle
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Input */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/15"
                                style={{ boxShadow: '0 12px 32px -8px rgba(236,72,153,0.2)' }}>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                                        disabled={isBattling}
                                        placeholder={isBattling ? 'Battle in progress...' : 'Ask anything — all three fighters will respond...'}
                                        className="flex-1 bg-white/90 rounded-xl py-3.5 px-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/40 disabled:opacity-50"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                                        onClick={handleSend}
                                        disabled={!input.trim() || isBattling}
                                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white disabled:opacity-40"
                                        style={{ background: 'linear-gradient(135deg, #ec4899, #9333ea)', boxShadow: '0 6px 20px -4px rgba(236,72,153,0.45)' }}
                                    >
                                        <Send size={18} />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
