import React from 'react';
import { motion } from 'framer-motion';
import { Code2, MessageSquare, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const cards = [
    {
      title: "MyStriver",
      desc: "Code. Review. Improve.",
      icon: <Code2 className="w-8 h-8 text-blue-500" />,
      link: "/code",
      bg: "from-blue-500/5 to-transparent",
      border: "hover:border-blue-500/30"
    },
    {
      title: "ChatMini",
      desc: "Think. Learn. Explore.",
      icon: <MessageSquare className="w-8 h-8 text-purple-500" />,
      link: "/prompt",
      bg: "from-purple-500/5 to-transparent",
      border: "hover:border-purple-500/30"
    },
    {
      title: "Writer",
      desc: "Create Stories. Build Worlds.",
      icon: <BookOpen className="w-8 h-8 text-cyan-500" />,
      link: "/story",
      bg: "from-cyan-500/5 to-transparent",
      border: "hover:border-cyan-500/30"
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10 mb-20"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-500 tracking-tighter mb-6">
          TRiO AI
        </h1>
        <p className="text-xl md:text-3xl text-[#475569] font-light tracking-wide">
          Think. Build. Create.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl z-10">
        {cards.map((card, i) => (
          <Link key={i} to={card.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`glass-panel p-8 h-full rounded-3xl cursor-pointer transition-colors border border-white/80 bg-gradient-to-b ${card.bg} ${card.border}`}
            >
              <div className="p-4 bg-slate-50 rounded-2xl w-fit mb-6 border border-slate-200/50">
                {card.icon}
              </div>
              <h3 className="text-2xl font-semibold text-[#0F172A] mb-3">{card.title}</h3>
              <p className="text-[#475569] leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
