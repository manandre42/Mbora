import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getGeminiChatResponse } from '../services/geminiService';
import { X, Send, Sparkles } from 'lucide-react';

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportChat: React.FC<SupportChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Boas! Sou o assistente Mbora. Precisas de ajuda com alguma viagem ou pagamento?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const historyText = messages.map(m => `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.text}`);
    const brandPrompt = `Tu és o assistente do 'Mbora', um app de táxi angolano jovem e dinâmico. Usa gíria angolana leve mas respeitosa. Responde curto. ${historyText.join('\n')} Usuário: ${userMsg.text}`;
    
    const responseText = await getGeminiChatResponse(historyText, userMsg.text);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white sm:max-w-md sm:right-0 sm:left-auto sm:border-l shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-gray-900 p-4 flex items-center justify-between text-white shadow-md relative overflow-hidden">
        {/* Background shine */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm border border-white/5">
             <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
             <h2 className="font-bold text-lg leading-tight">Suporte Mbora</h2>
             <p className="text-xs text-gray-400">Estamos online</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-violet-600 text-white rounded-br-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1.5 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Como podemos ajudar?"
          className="flex-1 bg-gray-100 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-gray-900 text-white p-3.5 rounded-full hover:bg-black disabled:opacity-50 transition-all shadow-lg active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SupportChat;