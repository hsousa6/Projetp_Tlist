import React, { useState, useEffect } from 'react';
import { Trash2, Check, X } from 'lucide-react';

function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatCompletedAt(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  } catch {
    return '';
  }
}

export function TaskEditPanel({
  task,
  onSave,
  onRequestDelete,
  onClose,
  theme,
}) {
  const [title, setTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const isDark = theme === 'dark';

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setErrorMsg('');
    }
  }, [task]);

  if (!task) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('O título não pode ficar vazio.');
      return;
    }
    onSave(task.id, {
      title: title.trim(),
    });
    // Fecha o componente automaticamente após salvar
    onClose();
  };

  return (
    <div
      className={`mt-6 pt-5 rounded-2xl transition-all duration-300 animate-fadeIn ${
        isDark
          ? 'bg-transparent border-t border-white/10'
          : 'bg-light-editPanel p-5 border border-black/5 shadow-inner'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2
          className={`text-sm font-semibold tracking-wide ${
            isDark ? 'text-dark-textSec' : 'text-light-textMain'
          }`}
        >
          Edição de tarefa
        </h2>

        <button
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors ${
            isDark
              ? 'text-dark-textSec hover:text-white hover:bg-white/10'
              : 'text-light-textMain/70 hover:text-black hover:bg-black/10'
          }`}
          title="Fechar painel de edição"
          aria-label="Fechar painel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-3.5">
        {/* Title input */}
        <div>
          <label
            className={`block text-xs font-medium mb-1.5 ${
              isDark ? 'text-dark-textSec' : 'text-light-textMain'
            }`}
          >
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(capitalizeFirstLetter(e.target.value));
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="Nome da atividade"
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all border ${
              isDark
                ? 'bg-dark-input text-dark-textMain border-white/5 focus:border-[#5B8DEF]/60 focus:ring-1 focus:ring-[#5B8DEF]/40'
                : 'bg-light-input text-light-textMain border-transparent focus:border-[#85B4BA] focus:ring-1 focus:ring-[#85B4BA]'
            }`}
          />
          {errorMsg && <p className="text-xs text-red-400 mt-1">{errorMsg}</p>}
        </div>

        {/* Exibição condicional da data de conclusão */}
        {task.completedAt && (
          <p
            className={`text-xs ${
              isDark ? 'text-dark-textSec' : 'text-light-textMain/80'
            }`}
          >
            Concluído em: {formatCompletedAt(task.completedAt)}
          </p>
        )}

        {/* Action buttons: Excluir & Salvar */}
        <div className="flex items-center justify-between pt-2">
          {/* Excluir button */}
          <button
            type="button"
            onClick={() => onRequestDelete(task)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 active:scale-95 ${
              isDark
                ? 'border border-dark-delete/60 text-dark-delete hover:bg-dark-delete/10'
                : 'bg-[#FDECE8] border border-light-delete text-light-delete hover:bg-[#FCD8D1]'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Excluir</span>
          </button>

          {/* Salvar button */}
          <button
            type="submit"
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95 shadow-sm ${
              isDark
                ? 'border border-dark-save/70 bg-[#0F2238] text-dark-save hover:bg-[#152E4B]'
                : 'bg-light-save text-light-textMain hover:brightness-95 border border-[#81BCB7]'
            }`}
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Salvar</span>
          </button>
        </div>
      </form>
    </div>
  );
}
