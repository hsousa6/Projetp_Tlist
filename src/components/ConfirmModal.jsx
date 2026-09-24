import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function ConfirmModal({
  isOpen,
  taskTitle,
  onConfirm,
  onCancel,
  theme,
}) {
  const isDark = theme === 'dark';

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-sm rounded-2xl p-5 shadow-2xl border transition-all transform scale-100 ${
          isDark
            ? 'bg-[#1D1D1B] border-white/10 text-dark-textMain'
            : 'bg-[#CBE7EB] border-black/10 text-light-textMain'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5 mb-4">
          <div
            className={`p-2.5 rounded-xl flex-shrink-0 ${
              isDark ? 'bg-red-950/60 text-red-400 border border-red-800/40' : 'bg-red-100 text-red-600 border border-red-300'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold leading-snug">Confirmar exclusão</h3>
            <p
              className={`text-xs mt-1 leading-relaxed ${
                isDark ? 'text-dark-textSec' : 'text-light-textMain/80'
              }`}
            >
              Tem certeza que deseja excluir a atividade <strong className="font-semibold text-inherit">"{taskTitle}"</strong>? Esta ação não pode ser desfeita.
            </p>
          </div>

          <button
            onClick={onCancel}
            className={`p-1 rounded-lg transition-colors ${
              isDark
                ? 'text-dark-textSec hover:text-white hover:bg-white/10'
                : 'text-light-textMain/70 hover:text-black hover:bg-black/10'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-5 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 text-xs font-medium rounded-xl transition-all ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-dark-textMain border border-white/10'
                : 'bg-black/5 hover:bg-black/10 text-light-textMain border border-black/10'
            }`}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white shadow-sm transition-all"
          >
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
