import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';

const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function TaskInput({ onAddTask, isAtLimit, taskCount, theme }) {
  const [title, setTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const isDark = theme === 'dark';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAtLimit) {
      setErrorMsg('Limite máximo de 10 tarefas atingido!');
      return;
    }
    const result = onAddTask(title);
    if (result.success) {
      setTitle('');
      setErrorMsg('');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="mb-5">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(capitalizeFirstLetter(e.target.value));
              if (errorMsg) setErrorMsg('');
            }}
            disabled={isAtLimit}
            placeholder={isAtLimit ? 'Limite de 10 tarefas atingido' : 'Adicionar nova tarefa'}
            className={`w-full px-4 py-3 text-sm rounded-xl outline-none transition-all duration-200 border ${
              isDark
                ? 'bg-dark-input text-dark-textMain placeholder-dark-textSec border-white/5 focus:border-[#5B8DEF]/60 focus:ring-1 focus:ring-[#5B8DEF]/40'
                : 'bg-light-input text-light-textMain placeholder-light-textSec border-transparent focus:border-[#85B4BA] focus:ring-1 focus:ring-[#85B4BA]'
            } ${isAtLimit ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
        </div>

        <button
          type="submit"
          disabled={isAtLimit || !title.trim()}
          title="Adicionar tarefa"
          className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center font-bold shadow-sm ${
            isDark
              ? 'bg-dark-btnPlus text-dark-btnPlusText hover:brightness-95 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
              : 'bg-light-btnPlus text-light-textMain hover:brightness-95 border border-[#9CC9CF] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
          aria-label="Adicionar tarefa"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </form>

      {/* Warning when limit is reached */}
      {isAtLimit && (
        <div
          className={`flex items-center gap-1.5 mt-2 text-xs px-3 py-1.5 rounded-lg ${
            isDark ? 'bg-amber-950/40 text-amber-300 border border-amber-800/30' : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Você atingiu o limite máximo de 10 tarefas. Conclua ou exclua tarefas para adicionar novas.</span>
        </div>
      )}

      {errorMsg && !isAtLimit && (
        <p className="text-xs text-red-400 mt-1.5 px-1">{errorMsg}</p>
      )}
    </div>
  );
}
