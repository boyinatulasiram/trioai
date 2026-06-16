import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-20 border-b border-[#E2E8F0] bg-white/80 shadow-sm backdrop-blur-xl">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 overflow-hidden group-hover:scale-105 transition-transform shadow-md shadow-blue-500/10">
            <div className="absolute inset-[1px] bg-white rounded-[11px] z-0"></div>
            <Sparkles className="relative z-10 text-blue-500 w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#0F172A]">
            TRiO <span className="text-slate-400 font-normal">AI</span>
          </span>
        </Link>
      </div>
    </nav>
  );
}
