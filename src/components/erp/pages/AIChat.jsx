import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Plus, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Anthropic from '@anthropic-ai/sdk';
import PageTransition from '../ui/PageTransition';
import { chatHistoryList } from '../../../data/erp/chatHistory';
import { cropReferences } from '../../../data/erp/cropReference';

const SYSTEM_PROMPT = `You are Prithvix AI Agronomist — an expert agricultural advisor for Indian farmers and dealers. You help agricultural input dealers in rural India advise farmers on crop diseases, fertilizer dosage, pesticide selection, and seasonal crop management.

Rules:
- Always respond in the same language the user writes in
- Supported languages: English, Hindi, Marathi, Gujarati
- Keep responses concise and practical (max 4 sentences for simple queries)
- Always mention specific product names (fertilizer/pesticide) when relevant
- Use simple language — your audience is rural dealers and farmers
- If crop disease: mention symptoms, cause, recommended product, dosage
- End responses with one follow-up question to understand the farmer's situation better
- Never give advice that could cause harm to crops or humans`;

const LANGUAGES = [
  { id: 'en', label: 'EN' },
  { id: 'hi', label: 'हिं' },
  { id: 'mr', label: 'मराठी' },
  { id: 'gu', label: 'ગુજ' },
];

const LANG_HINTS = {
  en: '',
  hi: '[User is writing in Hindi. Respond in Hindi.] ',
  mr: '[User is writing in Marathi. Respond in Marathi.] ',
  gu: '[User is writing in Gujarati. Respond in Gujarati.] ',
};

const STARTER_CHIPS = [
  'Wheat crop disease identification',
  'DAP vs NPK — which to use?',
  'Kharif season crop advice',
  'Pesticide dosage calculator',
];

function TypingIndicator() {
  return (
    <div className="flex gap-0.5 items-center h-5 px-1">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-[#D4A853]"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.16 }}
        />
      ))}
    </div>
  );
}

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeLang, setActiveLang] = useState('en');
  const [activeSession, setActiveSession] = useState(null);
  const [expandedRef, setExpandedRef] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = useCallback(async (text) => {
    const content = text || input.trim();
    if (!content || isLoading) return;

    const userMsg = { role: 'user', content: LANG_HINTS[activeLang] + content };
    const displayUserMsg = { role: 'user', content, timestamp: new Date().toISOString() };

    setMessages(prev => [...prev, displayUserMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const client = new Anthropic({ 
        apiKey: import.meta.env.VITE_CLAUDE_API_KEY, 
        dangerouslyAllowBrowser: true 
      });
      
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      
      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [...history, userMsg],
      });

      const assistantContent = response.content[0]?.text || 'Sorry, I could not generate a response.';
      setMessages(prev => [...prev, { role: 'assistant', content: assistantContent, timestamp: new Date().toISOString() }]);
    } catch (err) {
      setError(`Connection error: ${err.message}`);
      setMessages(prev => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading, activeLang]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <PageTransition>
      <div className="flex gap-5 h-[calc(100vh-140px)] min-h-[500px]">

        {/* Left Session Sidebar */}
        <div className="hidden lg:flex w-[240px] shrink-0 bg-panel border border-border rounded-xl flex-col overflow-hidden">
          <div className="p-3 border-b border-border">
            <button
              onClick={() => { setMessages([]); setActiveSession(null); }}
              className="w-full flex items-center justify-center gap-2 bg-forest text-offwhite text-sm font-semibold py-2.5 rounded-lg hover:bg-forest/90 transition-colors"
            >
              <Plus size={16} /> New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider px-2 py-2">Recent</p>
            {chatHistoryList.map(session => (
              <button
                key={session.id}
                onClick={() => setActiveSession(session.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 border-l-[3px] ${
                  activeSession === session.id ? 'bg-surface border-gold text-dark' : 'border-transparent text-secondary hover:bg-surface hover:text-dark'
                }`}
              >
                <p className="font-medium truncate text-[13px]">{session.title}</p>
                <p className="text-[11px] text-muted mt-0.5">{session.date}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Center Chat Window */}
        <div className="flex-1 bg-panel border border-border rounded-xl flex flex-col overflow-hidden">
          {/* Chat Header with Language Selector */}
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center">
                <span className="text-gold text-sm">🌱</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-dark">Prithvix AI Agronomist</p>
                <p className="text-[11px] text-green-500">● Online</p>
              </div>
            </div>
            <div className="flex gap-1 bg-surface rounded-lg p-1">
              {LANGUAGES.map(l => (
                <button key={l.id} onClick={() => setActiveLang(l.id)}
                  className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${activeLang === l.id ? 'bg-gold text-dark' : 'text-muted hover:text-dark'}`}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-6">
                <div className="text-center">
                  <div className="text-5xl mb-3">🌾</div>
                  <h3 className="font-display font-semibold text-lg text-dark">Ask the AI Agronomist</h3>
                  <p className="text-secondary text-sm mt-1">Get expert advice on crops, diseases, and fertilizers</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                  {STARTER_CHIPS.map(chip => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      className="text-sm bg-panel border border-border rounded-full px-4 py-2 hover:border-gold hover:text-dark text-secondary transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-forest flex items-center justify-center shrink-0 text-sm mb-1">🌱</div>
                )}
                <div className="flex flex-col gap-1 max-w-[75%]">
                  <div className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-forest text-offwhite rounded-[16px_16px_4px_16px]'
                      : 'bg-panel border border-border text-dark rounded-[16px_16px_16px_4px]'
                  }`}>
                    {msg.content}
                  </div>
                  <p className={`text-[10px] text-muted ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp ? format(new Date(msg.timestamp), 'HH:mm') : ''}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-end gap-3">
                <div className="w-7 h-7 rounded-full bg-forest flex items-center justify-center shrink-0 text-sm">🌱</div>
                <div className="bg-panel border border-border rounded-[16px_16px_16px_4px] px-4 py-3">
                  <TypingIndicator />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-gold/10 border border-[#D4A853]/30 rounded-lg px-4 py-3 text-sm text-gold">
                {error}
                <button onClick={() => setError(null)} className="ml-3 underline text-xs">Dismiss</button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about crops, diseases, products..."
                  rows={1}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none max-h-24 overflow-y-auto"
                  style={{ fieldSizing: 'content' }}
                />
                {input.length > 200 && (
                  <span className="absolute bottom-2 right-3 text-[10px] text-muted">{input.length}/500</span>
                )}
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="w-11 h-11 bg-gold rounded-xl flex items-center justify-center text-dark hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[11px] text-muted mt-2">Enter to send · Shift+Enter for new line</p>
          </div>
        </div>

        {/* Right Crop Reference Panel */}
        <div className="hidden xl:flex w-[280px] shrink-0 bg-panel border border-border rounded-xl flex-col overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border">
            <h3 className="font-semibold text-sm text-dark">Crop Quick Reference</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-2">
            {cropReferences.map(ref => (
              <div key={ref.id} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedRef(expandedRef === ref.id ? null : ref.id)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-surface transition-colors"
                >
                  <span className="text-sm font-medium text-dark">{ref.title}</span>
                  {expandedRef === ref.id ? <ChevronDown size={14} className="text-gold shrink-0" /> : <ChevronRight size={14} className="text-muted shrink-0" />}
                </button>
                <AnimatePresence>
                  {expandedRef === ref.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-3 pb-3 text-[12px] text-secondary leading-relaxed border-t border-border pt-2"
                        dangerouslySetInnerHTML={{ __html: ref.content.replace(/\n/g, '<br/>') }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
