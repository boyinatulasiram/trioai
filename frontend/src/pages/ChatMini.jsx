import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Plus, Trash2, Edit3, Check, X, Send, Bot, User 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useGroqStream } from '../hooks/useGroqStream';

export default function ChatMini() {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('trio_chats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: '1',
        title: 'Welcome to ChatMini',
        messages: [
          { role: 'system', content: 'You are ChatMini, a helpful, friendly, and intelligent general AI assistant.' },
          { role: 'assistant', content: 'Hello! I am ChatMini, your general AI productivity assistant. Ask me anything, or try one of the suggestions below!' }
        ]
      }
    ];
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    return chats[0]?.id || '';
  });

  const [input, setInput] = useState('');
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  
  const { generateStream, isLoading, error } = useGroqStream();
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync to Local Storage
  useEffect(() => {
    localStorage.setItem('trio_chats', JSON.stringify(chats));
  }, [chats]);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isLoading]);

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newChat = {
      id: newId,
      title: `New Chat`,
      messages: [
        { role: 'system', content: 'You are ChatMini, a helpful, friendly, and intelligent general AI assistant.' }
      ]
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newId);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleDeleteChat = (id, e) => {
    e.stopPropagation();
    const updated = chats.filter(c => c.id !== id);
    setChats(updated);
    if (activeChatId === id) {
      setActiveChatId(updated[0]?.id || '');
    }
  };

  const handleStartRename = (chat, e) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveRename = (id) => {
    if (editTitle.trim()) {
      setChats(prev => prev.map(c => c.id === id ? { ...c, title: editTitle } : c));
    }
    setEditingChatId(null);
  };

  const handleCancelRename = () => {
    setEditingChatId(null);
  };

  const handleSend = async (messageText) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    if (!messageText) {
      setInput('');
    }

    // Ensure we have a valid active chat
    let currentChatId = activeChatId;
    let currentChat = activeChat;
    
    if (!currentChat) {
      const newId = Date.now().toString();
      currentChat = {
        id: newId,
        title: text.slice(0, 25) + (text.length > 25 ? '...' : ''),
        messages: [
          { role: 'system', content: 'You are ChatMini, a helpful, friendly, and intelligent general AI assistant.' }
        ]
      };
      currentChatId = newId;
      setActiveChatId(newId);
    }

    const isDefaultTitle = currentChat.title === 'New Chat';
    const newTitle = isDefaultTitle ? (text.slice(0, 22) + (text.length > 22 ? '...' : '')) : currentChat.title;
    
    // Messages payload
    const userMessage = { role: 'user', content: text };
    const assistantPlaceholder = { role: 'assistant', content: '' };
    const newMessages = [...currentChat.messages, userMessage];

    // Single atomic state update to prevent duplication
    setChats(prev => {
      if (!prev.some(c => c.id === currentChatId)) {
        return [{
          ...currentChat,
          title: newTitle,
          messages: [...newMessages, assistantPlaceholder]
        }, ...prev];
      }
      return prev.map(c => c.id === currentChatId ? {
        ...c,
        title: newTitle,
        messages: [...newMessages, assistantPlaceholder]
      } : c);
    });

    const historyToSend = newMessages;

    generateStream(
      '/api/chatmini',
      null, // Not used since we pass full history array
      historyToSend,
      (chunk, full) => {
        setChats(prev => prev.map(c => {
          if (c.id === currentChatId) {
            const msgs = [...c.messages];
            if (msgs.length > 0) {
              msgs[msgs.length - 1] = { role: 'assistant', content: full };
            }
            return { ...c, messages: msgs };
          }
          return c;
        }));
      },
      (full) => {
        // Complete callback
      }
    );
  };

  const suggestions = [
    { label: "💡 General Q&A", text: "Can you explain the difference between REST and GraphQL APIs?" },
    { label: "📝 Summarization", text: "Summarize the key principles of clean code and DRY design." },
    { label: "🎓 Learning Assistant", text: "Teach me how closures work in JavaScript using a simple analogy." },
    { label: "💼 Productivity", text: "Help me draft a polite email requesting an extension on a project deadline." },
    { label: "🧠 Reasoning", text: "Solve this step-by-step: If a train leaves Chicago at 60mph and another leaves New York at 80mph, how do we calculate where they meet?" },
    { label: "🚀 Brainstorming", text: "Brainstorm 5 unique startup ideas that leverage local backend AI processing." }
  ];

  const userMessagesOnly = activeChat?.messages.filter(m => m.role !== 'system') || [];

  return (
    <div className="h-full flex p-4 md:p-6 gap-6 overflow-hidden bg-[#F8FAFC] transition-colors">
      {/* Sidebar: Chat History */}
      <div className="w-64 md:flex flex-col gap-4 border-r border-[#E2E8F0] bg-[#F8FAFC] p-4 hidden">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer text-sm"
        >
          <Plus size={16} />
          New Chat
        </button>

        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 custom-scrollbar">
          {chats.map(chat => {
            const isActive = chat.id === activeChatId;
            const isEditing = chat.id === editingChatId;

            return (
              <div
                key={chat.id}
                onClick={() => !isEditing && setActiveChatId(chat.id)}
                className={`group flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all border ${
                  isActive 
                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 font-semibold' 
                    : 'border-transparent text-[#475569] hover:bg-slate-100 hover:text-[#0F172A]'
                }`}
              >
                <MessageSquare size={16} className={isActive ? 'text-blue-500' : 'text-slate-400'} />
                
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleSaveRename(chat.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(chat.id);
                      if (e.key === 'Escape') handleCancelRename();
                    }}
                    autoFocus
                    className="flex-1 bg-white border border-[#E2E8F0] rounded px-1.5 py-0.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="flex-1 truncate text-xs">{chat.title}</span>
                )}

                {!isEditing && (
                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                    <button
                      onClick={(e) => handleStartRename(chat, e)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col bg-white border border-[#E2E8F0] md:rounded-2xl overflow-hidden shadow-sm">
        {/* Mobile Header indicator */}
        <div className="flex items-center gap-3 p-4 border-b border-[#E2E8F0] md:hidden">
          <button
            onClick={handleNewChat}
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            <Plus size={16} />
          </button>
          <span className="text-sm font-semibold text-[#0F172A] truncate flex-1">
            {activeChat?.title || 'ChatMini'}
          </span>
        </div>

        {/* Message Panel */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar flex flex-col bg-white">
          {userMessagesOnly.length > 0 ? (
            userMessagesOnly.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex gap-3 max-w-[85%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                    isUser 
                      ? 'bg-blue-50 border-blue-200 text-blue-500' 
                      : 'bg-purple-50 border-purple-200 text-purple-500'
                  }`}>
                    {isUser ? <User size={14} /> : <Bot size={14} />}
                  </div>

                  <div className={`px-4 py-2.5 rounded-2xl ${
                    isUser 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/10' 
                      : 'bg-white text-[#0F172A] rounded-tl-none border border-[#E2E8F0] shadow-md shadow-slate-100/50'
                  }`}>
                    {isUser ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-200/80">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            // Empty State suggestions
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="p-3 bg-purple-50 rounded-2xl text-purple-500 border border-purple-100 mb-4 shadow-sm">
                <Bot size={32} />
              </div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-2">ChatMini general assistant</h2>
              <p className="text-sm text-[#475569] max-w-md mb-8">
                Start a conversation by typing your request or choosing one of the productivity suggestions below.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sug.text)}
                    className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-blue-500/20 text-left text-xs text-[#475569] hover:text-blue-600 transition-all shadow-sm cursor-pointer"
                  >
                    <div className="font-semibold mb-1 text-[#0F172A]">{sug.label}</div>
                    <div className="truncate text-slate-400">{sug.text}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {isLoading && activeChat?.messages[activeChat.messages.length - 1]?.content === '' && (
            <div className="flex gap-3 max-w-[85%] self-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border shrink-0 bg-purple-50 border-purple-200 text-purple-500">
                <Bot size={14} />
              </div>
              <div className="bg-white text-[#0F172A] rounded-2xl rounded-tl-none px-4 py-2.5 border border-[#E2E8F0] shadow-md shadow-slate-100/50 flex items-center">
                <span className="inline-block w-2 h-4 bg-purple-500 animate-pulse"></span>
              </div>
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-50 text-red-500 text-sm font-medium border border-red-100 rounded-xl max-w-fit mx-auto">
              {error}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]/90 backdrop-blur-md flex gap-3 items-center">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message here... (Enter to send, Shift+Enter for newline)"
            className="flex-1 bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none max-h-32 custom-scrollbar transition-all shadow-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shadow-blue-500/10 shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
