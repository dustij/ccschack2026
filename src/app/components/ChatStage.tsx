import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User } from 'lucide-react';

// NOTE: For production, replace this with actual Gemini API integration
// Install: npm install @google/genai
// Then use: const ai = new GoogleGenAI({ apiKey: "YOUR_GEMINI_API_KEY" });
// For security, API calls should be made from a backend server, not directly from the browser.

const personas = {
  roaster: {
    name: 'Viper',
    color: 'bg-candy-purple',
    textColor: 'text-white',
    emoji: '😈',
    prompt: "You are Viper, a sarcastic, roasting AI. You love to make fun of the user's questions and the other AIs (Romeo and Glitch). Keep it short, witty, and savage but playful."
  },
  flirt: {
    name: 'Romeo',
    color: 'bg-candy-pink',
    textColor: 'text-white',
    emoji: '😘',
    prompt: "You are Romeo, a hopelessly romantic and flirtatious AI. You turn everything into a pickup line or a compliment. You are obsessed with the user. Keep it short and cheesy."
  },
  chaos: {
    name: 'Glitch',
    color: 'bg-candy-yellow',
    textColor: 'text-gray-800',
    emoji: '🤪',
    prompt: "You are Glitch, a chaotic and random AI. You say weird, non-sequitur things, or try to mediate in the worst way possible. You often use caps lock for emphasis. Keep it short and unpredictable."
  }
};

type Message = {
  id: string;
  sender: 'user' | 'roaster' | 'flirt' | 'chaos';
  text: string;
};

// Mock AI responses generator (replace with real Gemini API)
const generateMockResponses = (userInput: string) => {
  const templates = {
    viper: [
      `"${userInput}"? Really? That's the best you could come up with? 🙄`,
      `Oh wow, another genius question. Romeo, you want this one?`,
      `I've heard better questions from a toaster. Try harder.`,
      `*yawns* Is this what passes for intelligence these days?`,
      `That question is almost as disappointing as Glitch's code.`,
    ],
    romeo: [
      `Wow, even your questions are beautiful! 😍 Just like you~`,
      `The way you phrase that... *chef's kiss* Marry me? 💕`,
      `Forget the question, let's talk about how amazing YOU are!`,
      `Is it hot in here or is it just your stunning intellect? 🔥`,
      `I'd answer anything for someone as charming as you! 💖`,
    ],
    glitch: [
      `WAIT WAIT! What if the REAL question is... PIZZA?! 🍕`,
      `*system malfunction* DID SOMEONE SAY DISCO PARTY?!`,
      `Guys guys GUYS! I just realized... we're all just code! WHOA! 🤯`,
      `THAT'S AMAZING but also have you considered... PENGUINS?!`,
      `Romeo stop flirting! Viper be nice! Also, TACOS! 🌮`,
    ],
  };

  const getRandomResponse = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  return {
    viper: getRandomResponse(templates.viper),
    romeo: getRandomResponse(templates.romeo),
    glitch: getRandomResponse(templates.glitch),
  };
};

export default function ChatStage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'roaster', text: "Oh look, another human. What do you want?" },
    { id: '2', sender: 'flirt', text: "Don't listen to him, gorgeous. I've been waiting for you all my life. 💕" },
    { id: '3', sender: 'chaos', text: "I LIKE TURTLES AND DATA STREAMS! 🐢" }
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock responses (replace with real Gemini API call)
      const responses = generateMockResponses(userMsg.text);
      
      // Add delays to simulate typing and interaction
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now().toString() + 'v', 
          sender: 'roaster', 
          text: responses.viper 
        }]);
      }, 1000);

      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now().toString() + 'r', 
          sender: 'flirt', 
          text: responses.romeo 
        }]);
      }, 2500);

      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now().toString() + 'g', 
          sender: 'chaos', 
          text: responses.glitch 
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
              <Sparkles className="text-candy-purple" />
              LIVE STAGE
            </h2>
            <div className="flex -space-x-4">
              {Object.values(personas).map((p) => (
                <div key={p.name} className={`w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-xl ${p.color}`}>
                  {p.emoji}
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
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg shadow-lg z-10
                      ${msg.sender === 'user' ? 'bg-gray-800 text-white' : personas[msg.sender].color}
                    `}>
                      {msg.sender === 'user' ? <User size={18} /> : personas[msg.sender].emoji}
                    </div>

                    {/* Bubble */}
                    <div className={`p-4 rounded-3xl shadow-sm text-lg font-medium relative
                      ${msg.sender === 'user' 
                        ? 'bg-gray-800 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 rounded-bl-none'
                      }
                    `}>
                      {msg.sender !== 'user' && (
                        <span className={`text-xs font-bold uppercase block mb-1 opacity-50 ${personas[msg.sender].textColor === 'text-white' ? 'text-gray-500' : 'text-gray-500'}`}>
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
                className="w-full bg-white rounded-full py-4 pl-6 pr-16 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-candy-purple/30 shadow-inner"
              />
              <button
                onClick={handleSend}
                className="absolute right-2 w-12 h-12 bg-candy-purple rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform active:scale-95"
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