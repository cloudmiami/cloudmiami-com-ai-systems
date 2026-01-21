import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, ChevronRight } from 'lucide-react';
import { useChatbot } from '../hooks/useChatbot';
import clsx from 'clsx';

export default function Chatbot() {
  const { isOpen, setIsOpen, messages, isTyping, sendMessage } = useChatbot();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[90vw] max-w-[380px] h-[520px] bg-void border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-4 flex items-center gap-3 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-void flex items-center justify-center border border-white/10">
                <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="chatLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00f3ff" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                  <path d="M32 8 L52 20 L52 44 L32 56 L12 44 L12 20 Z" stroke="url(#chatLogoGrad)" strokeWidth="2" fill="none" />
                  <circle cx="32" cy="32" r="6" fill="url(#chatLogoGrad)" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Cloud Miami AI</h3>
                <p className="text-primary/80 text-xs">Usually replies instantly</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-void/50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={clsx(
                    "max-w-[85%] p-3 text-sm rounded-2xl",
                    msg.type === 'user' 
                      ? "ml-auto bg-accent text-white rounded-br-none" 
                      : "bg-white/10 text-gray-100 rounded-bl-none"
                  )}
                >
                  {msg.content}
                </div>
              ))}
              {isTyping && (
                <div className="bg-white/10 w-fit p-3 rounded-2xl rounded-bl-none flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-void border-t border-white/10">
              <ChatInput onSend={sendMessage} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-all hover:scale-105 flex items-center justify-center text-white"
        aria-label="Toggle Chat"
      >
        <AnimatePresence mode='wait'>
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <MessageCircle className="w-6 h-6 fill-current" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pulse Effect */}
        {!isOpen && <span className="absolute inset-0 rounded-full bg-white/20 animate-ping"></span>}
      </button>
    </div>
  );
}

function LeadForm({ onSubmit }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', website: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.firstName && form.email) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-xs text-center text-gray-400 mb-2">Let's get acquainted first!</p>
      <div className="grid grid-cols-2 gap-2">
        <input 
          placeholder="First Name" 
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"
          required
          value={form.firstName}
          onChange={e => setForm({...form, firstName: e.target.value})}
        />
        <input 
          placeholder="Last Name" 
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"
          required
          value={form.lastName}
          onChange={e => setForm({...form, lastName: e.target.value})}
        />
      </div>
      <input 
        type="email" 
        placeholder="Email Address" 
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"
        required
        value={form.email}
        onChange={e => setForm({...form, email: e.target.value})}
      />
      <button 
        type="submit" 
        className="w-full py-2 bg-gradient-to-r from-primary to-accent text-void rounded-lg text-sm font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2"
      >
        Start Chatting <ChevronRight size={16} />
      </button>
    </form>
  );
}

function ChatInput({ onSend }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type your message..."
        className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"
      />
      <button 
        onClick={handleSend}
        className="w-9 h-9 bg-gradient-to-r from-primary to-accent text-void rounded-full flex items-center justify-center transition-all hover:opacity-90"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
