// components/GeminiAssistant.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { UserRole } from '../types';

interface GeminiAssistantProps {
  role: UserRole;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ role }) => {
  const isPatient = role === UserRole.PATIENT;
  const isAdmin = role === UserRole.ADMIN;
  
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { 
      role: 'ai', 
      text: isPatient 
        ? "Hello! I am your personal health companion. I can help explain medical terms or suggest wellness tips. How can I help you feel better today?"
        : isAdmin
        ? "Greetings, Administrator. I am your system analyst. I can provide hospital performance summaries or clarify administrative policies."
        : "Welcome, Doctor. I am your clinical research assistant. I can summarize patient histories or provide pharmacological data."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Corrected: Use process.env.API_KEY directly as per guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const safetyProtocols = `
        CORE RULES:
        1. Always state you are an AI assistant.
        2. ${isPatient ? "MANDATORY: You are NOT a doctor. DO NOT diagnose or prescribe. ALWAYS suggest consulting their MediNest provider for clinical concerns. Tone: Empathetic, simple." : ""}
        3. ${role === UserRole.DOCTOR ? "Tone: Professional, technical. Use medical terminology. You may provide clinical references and pharmacological data." : ""}
        4. ${isAdmin ? "Tone: Analytical. Focus on system efficiency, staff metrics, and hospital policy." : ""}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `MediNest Integrated AI. Access Level: ${role}. ${safetyProtocols}`,
        }
      });

      // Corrected: response.text is a property, not a method.
      const aiText = response.text || "I apologize, I am currently unable to process that request.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      setMessages(prev => [...prev, { role: 'ai', text: "Connectivity Error: Failed to reach the MediNest Neural Engine." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 animate-in slide-in-from-bottom-8 duration-700">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-800 p-8 rounded-3xl text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/20 rounded-xl backdrop-blur-md border border-white/10">
              <Sparkles size={24} className="text-indigo-300 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">MediNest <span className="text-indigo-400">Intelligence</span></h2>
          </div>
          <p className="text-indigo-100 text-sm opacity-80 max-w-md">Secure, role-aware AI processing. Current authorization: {role} Level.</p>
        </div>
        <Bot size={120} className="absolute -right-4 -bottom-4 text-white/5 rotate-12" />
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col min-h-0 shadow-lg shadow-slate-200/50">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`h-10 w-10 rounded-2xl shrink-0 flex items-center justify-center border shadow-sm ${
                  m.role === 'user' ? 'bg-indigo-600 border-indigo-700' : 'bg-slate-50 border-slate-100'
                }`}>
                  {m.role === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-indigo-600" />}
                </div>
                <div className={`p-5 rounded-3xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                    : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in slide-in-from-left-2">
              <div className="flex gap-4 items-center">
                <div className="h-10 w-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <Bot size={20} className="text-indigo-600" />
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3 ml-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encrypted Session</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-2.5 flex items-center gap-3 shadow-xl shadow-slate-200/40 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your secure query..."
              className="flex-1 px-4 py-2 text-sm focus:outline-none bg-transparent"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100 active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};