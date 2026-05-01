import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftEllipsisIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';
import { useSendMessageMutation } from '@store/api/chatApi';

// A simple parser for markdown-like text and actions
const parseMessage = (text, navigate, setMessages) => {
  if (!text) return null;
  // Extract actions: [ACTION: Label]
  const actionRegex = /\[ACTION:\s*([^\]]+)\]/g;
  let match;
  const actions = [];
  let cleanText = text;

  while ((match = actionRegex.exec(text)) !== null) {
    actions.push(match[1]);
    cleanText = cleanText.replace(match[0], '');
  }

  const handleAction = (action) => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('view properties') || lowerAction.includes('search')) {
      navigate('/properties');
    } else if (lowerAction.includes('contact')) {
      navigate('/contact');
    } else if (lowerAction.includes('add property')) {
      navigate('/admin/properties/create');
    } else if (lowerAction.includes('admin') || lowerAction.includes('dashboard')) {
      navigate('/dashboard');
    }
  };

  // Convert basic markdown (bold)
  const renderText = (str) => {
    return str.split(/(\*\*.*?\*\*)/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-2 text-[14px]">
      <div className="whitespace-pre-wrap">{renderText(cleanText.trim())}</div>
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-gray-100">
          {actions.map((act, idx) => (
            <button 
              key={idx}
              onClick={() => handleAction(act)}
              className="px-3 py-1.5 bg-[#7C5CFF]/10 text-[#7C5CFF] rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#7C5CFF] hover:text-white transition-colors"
            >
              {act}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);

    try {
      const userRole = user ? (user.role === 'admin' ? 'admin' : (user.role === 'agent' ? 'agent' : 'user')) : 'guest';

      const result = await sendMessage({ 
        message: userMessage,
        role: userRole,
        history: messages.slice(1) // exclude greeting
      }).unwrap();
      
      setMessages([...newMessages, { role: 'ai', text: result.data.text }]);
    } catch (err) {
      console.error('[ChatWidget] Error details:', err);
      const errMsg = err?.data?.error?.message || err?.data?.message || err?.message || 'Unknown error';
      console.error('[ChatWidget] Gemini Error:', errMsg);
      setMessages([...newMessages, { role: 'ai', text: `Error: ${errMsg}` }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[550px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-[#111111] px-6 py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#7C5CFF] rounded-full flex items-center justify-center">
                  <CpuChipIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-[15px]">RealEstate AI</h3>
                  <p className="text-[#7C5CFF] text-[11px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#7C5CFF] rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-[#7C5CFF]/10 flex items-center justify-center shrink-0">
                      <CpuChipIcon className="w-4 h-4 text-[#7C5CFF]" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === 'user' 
                      ? 'bg-[#111111] text-white rounded-br-sm' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.role === 'ai' ? parseMessage(msg.text, navigate, setMessages) : <div className="text-[14px] whitespace-pre-wrap">{msg.text}</div>}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-[#7C5CFF]/10 flex items-center justify-center shrink-0">
                    <CpuChipIcon className="w-4 h-4 text-[#7C5CFF]" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm p-4 shadow-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-[#7C5CFF] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#7C5CFF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#7C5CFF] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <form onSubmit={handleSend} className="flex gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-1 bg-gray-50 border border-transparent focus:bg-white focus:border-[#7C5CFF]/30 rounded-2xl pl-4 pr-12 py-3.5 text-[14px] font-medium outline-none transition-all"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#111111] disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center hover:bg-[#7C5CFF] transition-colors"
                >
                  <PaperAirplaneIcon className="w-5 h-5 -mt-0.5 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 px-5 bg-[#111111] hover:bg-[#7C5CFF] text-white rounded-full flex items-center justify-center gap-2 shadow-xl shadow-[#7C5CFF]/20 transition-colors relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" className="flex items-center justify-center w-full h-full" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
              <XMarkIcon className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" className="flex items-center gap-2" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
              <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
              <span className="font-bold text-[14px]">Ask AI</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
