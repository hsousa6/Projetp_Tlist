import React from 'react';
import { Sun, Moon } from 'lucide-react';

export function Header({ theme, toggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight transition-colors duration-200 ${
            isDark ? 'text-dark-textMain' : 'text-light-textMain'
          }`}
        >
          Tarefas diárias
        </h1>
        <p
          className={`text-sm mt-1 transition-colors duration-200 ${
            isDark ? 'text-dark-textSec' : 'text-[#425255]'
          }`}
        >
          Organize seu dia arrastando e concluindo
        </p>
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        title={isDark ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
        className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm ${
          isDark
            ? 'bg-[#252523] text-yellow-400 hover:bg-[#30302D] border border-white/10'
            : 'bg-[#A8D4DA] text-slate-800 hover:bg-[#96C7CE] border border-black/10'
        }`}
        aria-label="Alternar tema"
      >
        {isDark ? (
          <Sun className="w-5 h-5 transition-transform hover:rotate-45" />
        ) : (
          <Moon className="w-5 h-5 transition-transform hover:-rotate-12" />
        )}
      </button>
    </div>
  );
}
