import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Sparkles, User, Globe, MessageSquare, List, 
  Sword, Rocket, Activity, HelpCircle 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useGroqStream } from '../hooks/useGroqStream';

export default function Writer() {
  const [inputText, setInputText] = useState('');
  const [output, setOutput] = useState('');
  const [activeAction, setActiveAction] = useState(null);
  const { generateStream, isLoading, error } = useGroqStream();
  const outputEndRef = useRef(null);

  const scrollToBottom = () => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [output]);

  const handleAction = (actionType) => {
    if (!inputText.trim()) return;
    
    setActiveAction(actionType);
    setOutput('');
    
    let systemPrompt = "You are a creative writing genius.";
    let userPrompt = "";

    switch(actionType) {
      case 'character':
        systemPrompt += " Generate a rich, detailed character profile (including appearance, backstory, personality traits, motivations, and conflicts) based on the user's notes.";
        userPrompt = `Generate a character profile for the following details:\n${inputText}`;
        break;
      case 'story':
        systemPrompt += " Write a compelling, immersive story draft based on the user's concept and outline. Focus on detailed descriptions, pacing, and engaging hook.";
        userPrompt = `Write a story based on this concept:\n${inputText}`;
        break;
      case 'world':
        systemPrompt += " Build an immersive fictional world, detailing its geography, societies, lore, magic/technology systems, and history based on the user's description.";
        userPrompt = `Build a world description based on:\n${inputText}`;
        break;
      case 'dialogue':
        systemPrompt += " Write a dynamic, natural dialogue scene between characters based on the context and description provided. Focus on distinct voices, subtext, and pacing.";
        userPrompt = `Generate a dialogue scene for:\n${inputText}`;
        break;
      case 'chapter':
        systemPrompt += " Write a full chapter for a novel based on the plot outline and characters provided. Keep the narrative pacing tight and end with a compelling hook.";
        userPrompt = `Write a novel chapter for:\n${inputText}`;
        break;
      case 'fantasy':
        systemPrompt += " Write a rich fantasy prose piece with detailed world-building, magical elements, and mythical atmosphere based on the user's request.";
        userPrompt = `Write fantasy fiction based on:\n${inputText}`;
        break;
      case 'scifi':
        systemPrompt += " Write a sci-fi prose piece incorporating futuristic technology, space/cyberpunk settings, and speculative concepts based on the user's request.";
        userPrompt = `Write science fiction based on:\n${inputText}`;
        break;
      case 'plot':
        systemPrompt += " Outline a complete plot with clear beats (exposition, rising action, climax, falling action, resolution) based on the user's concept.";
        userPrompt = `Outline a plot for:\n${inputText}`;
        break;
      case 'creative':
        systemPrompt += " Help write, polish, expand, or adjust the creative text provided by the user based on their specific requests.";
        userPrompt = `Polishing and assistance requested for this draft:\n${inputText}`;
        break;
      default:
        break;
    }

    generateStream(
      '/api/writer',
      systemPrompt, 
      userPrompt, 
      (chunk, full) => setOutput(full),
      (full) => {}
    );
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 gap-6 overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/15 rounded-xl text-amber-500">
          <BookOpen size={24} />
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] transition-colors">Writer</h1>
        <div className="flex-1"></div>
        {error && <div className="text-red-500 text-sm font-medium bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">{error}</div>}
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        {/* Left: Input */}
        <div className="flex-1 flex flex-col gap-4 min-h-0 glass-panel rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Concept / Outline</h2>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your outline, characters list, settings description, or write instructions..."
            className="flex-1 w-full bg-[#FCFAF7] border border-[#E8E2D9] rounded-xl p-4 text-[#5C4D3C] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-[#9C8F80]"
            spellCheck="false"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <ActionBtn icon={<User size={15}/>} label="Character Gen" onClick={() => handleAction('character')} loading={isLoading} isSelected={activeAction === 'character'} />
            <ActionBtn icon={<Sparkles size={15}/>} label="Story Gen" onClick={() => handleAction('story')} loading={isLoading} isSelected={activeAction === 'story'} />
            <ActionBtn icon={<Globe size={15}/>} label="World Builder" onClick={() => handleAction('world')} loading={isLoading} isSelected={activeAction === 'world'} />
            <ActionBtn icon={<MessageSquare size={15}/>} label="Dialogue Gen" onClick={() => handleAction('dialogue')} loading={isLoading} isSelected={activeAction === 'dialogue'} />
            <ActionBtn icon={<List size={15}/>} label="Chapter Gen" onClick={() => handleAction('chapter')} loading={isLoading} isSelected={activeAction === 'chapter'} />
            <ActionBtn icon={<Sword size={15}/>} label="Fantasy Writing" onClick={() => handleAction('fantasy')} loading={isLoading} isSelected={activeAction === 'fantasy'} />
            <ActionBtn icon={<Rocket size={15}/>} label="Sci-Fi Writing" onClick={() => handleAction('scifi')} loading={isLoading} isSelected={activeAction === 'scifi'} />
            <ActionBtn icon={<Activity size={15}/>} label="Plot Generator" onClick={() => handleAction('plot')} loading={isLoading} isSelected={activeAction === 'plot'} />
            <ActionBtn icon={<HelpCircle size={15}/>} label="Creative Asst" onClick={() => handleAction('creative')} loading={isLoading} isSelected={activeAction === 'creative'} />
          </div>
        </div>

        {/* Right: Output */}
        <div className="flex-1 flex flex-col min-h-0 glass-panel rounded-2xl p-4 bg-white">
          <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-4">AI Output</h2>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {output ? (
              <div className="prose prose-slate prose-purple max-w-none text-slate-700 leading-relaxed prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-200/80">
                <ReactMarkdown>{output}</ReactMarkdown>
                {isLoading && <span className="inline-block w-2 h-4 ml-1 bg-purple-500 animate-pulse"></span>}
                <div ref={outputEndRef} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[#9C8F80]/60 font-mono text-sm">
                Waiting for creative request...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, loading, isSelected }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed w-full transition-all duration-300 cursor-pointer border
        ${isSelected
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/15 border-transparent'
          : 'bg-[#FCFAF7] hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-600 hover:text-white text-[#5C4D3C] border-[#E8E2D9] hover:border-transparent shadow-sm'
        }`}
    >
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      {label}
    </button>
  );
}
