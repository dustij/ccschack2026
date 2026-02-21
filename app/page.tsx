'use client';

import { useState } from 'react';
import FloatingBackground from './components/FloatingBackground';
import Hero from './components/Hero';
import PersonaShowcase from './components/PersonaShowcase';
import ChatStage from './components/ChatStage';
import StatsSection from './components/StatsSection';
import ChatInterface from './components/ChatInterface';

export default function Home() {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return <ChatInterface onBack={() => setShowChat(false)} />;
  }

  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-black selection:bg-[var(--candy-pink)] selection:text-white">
      <FloatingBackground />

      <div className="relative z-10">
        <Hero onStartShow={() => setShowChat(true)} />
        <PersonaShowcase />
        <StatsSection />
        <ChatStage />

        <footer className="py-10 text-center text-gray-400 font-black uppercase tracking-widest text-sm">
          <p>© 2026 Model Mayhem · Grok vs Gemini vs Llama</p>
        </footer>
      </div>
    </main>
  );
}
