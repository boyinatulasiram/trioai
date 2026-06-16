import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Code2, Bug, Zap, LayoutTemplate, RotateCcw, 
  HelpCircle, FileText, CheckSquare, Globe, Layers 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useGroqStream } from '../hooks/useGroqStream';

export default function MyStriver() {
  const [inputCode, setInputCode] = useState('');
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
    if (!inputCode.trim()) return;
    
    setActiveAction(actionType);
    setOutput('');
    
    let systemPrompt = "You are a Senior AI Code Architect.";
    let userPrompt = "";

    switch(actionType) {
      case 'generate':
        systemPrompt += " Generate high-quality, production-ready code based on the user's request. Output ONLY markdown code blocks.";
        userPrompt = `Please generate code for the following request:\n${inputCode}`;
        break;
      case 'review':
        systemPrompt += " Perform a rigorous code review. Look for edge cases, performance issues, security holes, and best practices.";
        userPrompt = `Please review this code:\n\`\`\`\n${inputCode}\n\`\`\``;
        break;
      case 'bug':
        systemPrompt += " Find and fix bugs in the provided code. Explain the issue and provide the fixed code.";
        userPrompt = `Find bugs in this code:\n\`\`\`\n${inputCode}\n\`\`\``;
        break;
      case 'complexity':
        systemPrompt += " Analyze the time and space complexity of the provided code (Big O). Provide suggestions to optimize.";
        userPrompt = `Analyze the complexity of this code:\n\`\`\`\n${inputCode}\n\`\`\``;
        break;
      case 'refactor':
        systemPrompt += " Refactor the provided code to make it more readable, modern, and maintainable. Use modern language features.";
        userPrompt = `Refactor this code:\n\`\`\`\n${inputCode}\n\`\`\``;
        break;
      case 'explain':
        systemPrompt += " Explain the provided code step-by-step in clear, plain language. Detail the logic, inputs, and outputs.";
        userPrompt = `Explain this code:\n\`\`\`\n${inputCode}\n\`\`\``;
        break;
      case 'docs':
        systemPrompt += " Generate comprehensive documentation, JSDoc/docstrings, and clear comments for the provided code.";
        userPrompt = `Generate documentation for this code:\n\`\`\`\n${inputCode}\n\`\`\``;
        break;
      case 'tests':
        systemPrompt += " Generate complete, robust unit tests for the provided code using standard testing libraries.";
        userPrompt = `Generate unit tests for this code:\n\`\`\`\n${inputCode}\n\`\`\``;
        break;
      case 'api':
        systemPrompt += " Provide high-quality REST or GraphQL API design guidance, schemas, endpoints outline, payloads structure, and response code strategies based on the request.";
        userPrompt = `Design an API or guide me on API design for:\n${inputCode}`;
        break;
      case 'system':
        systemPrompt += " Provide high-level system design architecture, components layout, database schema suggestions, scalability tips, and technologies stack recommendations based on the requirements description.";
        userPrompt = `Design a system for the following request:\n${inputCode}`;
        break;
      default:
        break;
    }

    generateStream(
      '/api/mystriver',
      systemPrompt, 
      userPrompt, 
      (chunk, full) => setOutput(full),
      (full) => {}
    );
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 gap-6 overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/15 rounded-xl text-blue-500">
          <Code2 size={24} />
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] transition-colors">MyStriver</h1>
        <div className="flex-1"></div>
        {error && <div className="text-red-500 text-sm font-medium bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">{error}</div>}
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        {/* Left: Input */}
        <div className="flex-1 flex flex-col gap-4 min-h-0 glass-panel rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Input / Request</h2>
          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Paste your code here, or describe what you want to build..."
            className="flex-1 w-full bg-white border border-[#E2E8F0] rounded-xl p-4 text-[#0F172A] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-[#94A3B8]"
            spellCheck="false"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2">
            <ActionBtn icon={<Play size={15}/>} label="Generate" onClick={() => handleAction('generate')} loading={isLoading} isSelected={activeAction === 'generate'} />
            <ActionBtn icon={<LayoutTemplate size={15}/>} label="Review" onClick={() => handleAction('review')} loading={isLoading} isSelected={activeAction === 'review'} />
            <ActionBtn icon={<Bug size={15}/>} label="Detect Bugs" onClick={() => handleAction('bug')} loading={isLoading} isSelected={activeAction === 'bug'} />
            <ActionBtn icon={<Zap size={15}/>} label="Complexity" onClick={() => handleAction('complexity')} loading={isLoading} isSelected={activeAction === 'complexity'} />
            <ActionBtn icon={<RotateCcw size={15}/>} label="Refactor" onClick={() => handleAction('refactor')} loading={isLoading} isSelected={activeAction === 'refactor'} />
            <ActionBtn icon={<HelpCircle size={15}/>} label="Explain" onClick={() => handleAction('explain')} loading={isLoading} isSelected={activeAction === 'explain'} />
            <ActionBtn icon={<FileText size={15}/>} label="Doc Gen" onClick={() => handleAction('docs')} loading={isLoading} isSelected={activeAction === 'docs'} />
            <ActionBtn icon={<CheckSquare size={15}/>} label="Unit Tests" onClick={() => handleAction('tests')} loading={isLoading} isSelected={activeAction === 'tests'} />
            <ActionBtn icon={<Globe size={15}/>} label="API Design" onClick={() => handleAction('api')} loading={isLoading} isSelected={activeAction === 'api'} />
            <ActionBtn icon={<Layers size={15}/>} label="System Design" onClick={() => handleAction('system')} loading={isLoading} isSelected={activeAction === 'system'} />
          </div>
        </div>

        {/* Right: Output */}
        <div className="flex-1 flex flex-col min-h-0 glass-panel rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-[#3B82F6] uppercase tracking-wider mb-4">AI Output</h2>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {output ? (
              <div className="prose prose-slate prose-blue max-w-none prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-200/80 text-[#475569]">
                <ReactMarkdown>{output}</ReactMarkdown>
                {isLoading && <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse"></span>}
                <div ref={outputEndRef} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[#94A3B8] font-mono text-sm">
                Waiting for architectural request...
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
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md shadow-blue-500/15 border-transparent'
          : 'bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white text-[#475569] border-[#E2E8F0] hover:border-transparent shadow-sm'
        }`}
    >
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      {label}
    </button>
  );
}
