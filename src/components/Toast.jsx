import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export function Toast({ toast, onClose, theme }) {
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle max-w-sm">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md transition-all ${
          isSuccess
            ? isDark
              ? 'bg-[#15271F]/90 border-emerald-500/40 text-emerald-200'
              : 'bg-[#D6F4E6]/95 border-emerald-400 text-emerald-900'
            : isDark
            ? 'bg-[#291717]/90 border-rose-500/40 text-rose-200'
            : 'bg-[#FEE5E5]/95 border-rose-300 text-rose-900'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
        )}

        <div className="text-xs font-medium pr-2">{toast.message}</div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity ml-auto"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
