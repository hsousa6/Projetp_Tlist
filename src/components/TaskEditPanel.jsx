import React, { useState, useEffect, useRef } from 'react';
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
  const inputRef = useRef(null);
  const isDark = theme === 'dark';

  // Fechar com a tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && task) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [task, onClose]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setErrorMsg('');
      // Focar automaticamente no input de título apenas se a tarefa não estiver concluída
      if (!task.completed) {
        const timer = setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.select();
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [task]);

  if (!task) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (task.completed) return;
    if (!title.trim()) {
      setErrorMsg('O título não pode ficar vazio.');
      return;
    }
    if (title.trim().length < 3) {
      setErrorMsg('O título deve ter pelo menos 3 caracteres.');
      return;
    }
    onSave(task.id, {
      title: title.trim(),
    });
    // Fecha o modal automaticamente após salvar
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-edit-task-title"
    >
      <div
        className={`w-full max-w-sm sm:max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl border transition-all transform scale-100 ${
          isDark
            ? 'bg-[#1D1D1B] border-white/10 text-dark-textMain'
            : 'bg-[#CBE7EB] border-black/10 text-light-textMain'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2
              id="modal-edit-task-title"
              className={`text-base font-semibold tracking-wide ${
                isDark ? 'text-dark-textMain' : 'text-light-textMain'
              }`}
            >
              {task.completed ? 'Detalhes da tarefa' : 'Edição de tarefa'}
            </h2>
            {task.completed && (
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                Concluída
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-dark-textSec hover:text-white hover:bg-white/10'
                : 'text-light-textMain/70 hover:text-black hover:bg-black/10'
            }`}
            title="Fechar modal"
            aria-label="Fechar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Title input */}
          <div>
            <label
              htmlFor="edit-task-title-input"
              className={`block text-xs font-medium mb-1.5 ${
                isDark ? 'text-dark-textSec' : 'text-light-textMain'
              }`}
            >
              Título
            </label>
            <input
              id="edit-task-title-input"
              ref={inputRef}
              type="text"
              value={title}
              maxLength={75}
              disabled={task.completed}
              readOnly={task.completed}
              onChange={(e) => {
                if (task.completed) return;
                setTitle(capitalizeFirstLetter(e.target.value));
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Nome da atividade"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all border ${
                task.completed
                  ? isDark
                    ? 'bg-dark-input/50 text-dark-textSec border-white/5 cursor-not-allowed opacity-80'
                    : 'bg-light-input/50 text-light-textMain/70 border-black/5 cursor-not-allowed opacity-80'
                  : isDark
                  ? 'bg-dark-input text-dark-textMain border-white/5 focus:border-[#5B8DEF]/60 focus:ring-1 focus:ring-[#5B8DEF]/40'
                  : 'bg-light-input text-light-textMain border-transparent focus:border-[#85B4BA] focus:ring-1 focus:ring-[#85B4BA]'
              }`}
            />
            {!task.completed && (
              <span
                className={`text-[11px] mt-1 block text-right ${
                  title.length >= 75
                    ? 'text-red-400'
                    : title.length >= 60
                    ? 'text-amber-400'
                    : isDark ? 'text-dark-textSec' : 'text-light-textSec/70'
                }`}
              >
                {title.length}/75
              </span>
            )}
            {errorMsg && <p className="text-xs text-red-400 mt-1">{errorMsg}</p>}
            {task.completed && (
              <p
                className={`text-xs mt-1.5 ${
                  isDark ? 'text-dark-textSec' : 'text-light-textMain/70'
                }`}
              >
                Tarefas concluídas não podem ser editadas.
              </p>
            )}
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

          {/* Action buttons: Excluir & Salvar/Fechar */}
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

            {/* Salvar ou Fechar button */}
            {task.completed ? (
              <button
                type="button"
                onClick={onClose}
                className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 active:scale-95 ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/15 text-dark-textMain'
                    : 'bg-black/10 hover:bg-black/15 text-light-textMain'
                }`}
              >
                Fechar
              </button>
            ) : (
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
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
