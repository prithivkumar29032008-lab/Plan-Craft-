import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import { getAiChatResponse } from '../services/geminiService';

interface TeamChatProps {
  currentUser: string;
}

export const TeamChat: React.FC<TeamChatProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Neurotech AI',
      content: 'Hello team! I am here to assist with project coordination. Mention @AI to ask me anything.',
      timestamp: new Date(),
      isAi: true
    },
    {
        id: '2',
        sender: 'Sarah Designer',
        content: 'Hey everyone, just uploaded the new mockups to the project drive.',
        timestamp: new Date(),
        isAi: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: crypto.randomUUID(),
      sender: currentUser,
      content: inputValue,
      timestamp: new Date(),
      isAi: false
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');

    // Check for AI invocation
    if (inputValue.toLowerCase().includes('@ai')) {
      setIsAiTyping(true);
      
      // Construct history for context
      const history = messages.map(m => ({
        role: m.isAi ? 'model' : 'user',
        parts: [{ text: `${m.sender}: ${m.content}` }]
      }));
      // Add current message
      history.push({ role: 'user', parts: [{ text: `${currentUser}: ${inputValue}` }] });

      const responseText = await getAiChatResponse(history, inputValue);

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        sender: 'Neurotech AI',
        content: responseText,
        timestamp: new Date(),
        isAi: true
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setIsAiTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden m-4 md:m-6">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
        <div>
           <h3 className="font-bold text-slate-800">Team General</h3>
           <p className="text-xs text-slate-500">5 members • 1 AI Assistant</p>
        </div>
        <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
                <img key={i} className="w-8 h-8 rounded-full border-2 border-white" src={`https://picsum.photos/50/50?random=${i}`} alt="member"/>
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isMe = msg.sender === currentUser;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
               {!isMe && (
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.isAi ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200'}`}>
                       {msg.isAi ? <Bot size={18} /> : <UserIcon size={18} className="text-slate-500"/>}
                   </div>
               )}
               <div className={`max-w-[80%] md:max-w-[60%] p-3 rounded-2xl ${
                   isMe 
                   ? 'bg-indigo-600 text-white rounded-br-none' 
                   : msg.isAi 
                     ? 'bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-bl-none'
                     : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
               }`}>
                  {!isMe && <p className="text-[10px] opacity-70 mb-1 font-bold">{msg.sender}</p>}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
               </div>
            </div>
          );
        })}
        {isAiTyping && (
             <div className="flex justify-start items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Bot size={18} />
                </div>
                <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-2xl rounded-bl-none flex items-center gap-3">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                    </div>
                    <span className="text-sm text-indigo-600 font-medium">Neurotech AI is typing...</span>
                </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-400"
            placeholder="Type a message or @AI for help..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};