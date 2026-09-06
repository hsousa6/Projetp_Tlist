import React, { useState } from 'react';
import { GripVertical, Check, FileText } from 'lucide-react';

export function TaskItem({
  task,
  index,
  listType = 'active',
  isSelected,
  onToggleComplete,
  onOpenDetails,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  theme,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const isDark = theme === 'dark';

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, index, listType);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index, task, listType)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e);
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={onDragEnd}
      className={`group relative flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-200 select-none ${
        isDragOver ? 'scale-[1.02] ring-2 ring-blue-400/60' : ''
      } ${
        isDark
          ? task.completed
            ? 'bg-dark-completed text-dark-textSec'
            : isSelected
            ? 'bg-[#1C2627] ring-1 ring-[#5B8DEF]/50 text-dark-textMain'
            : 'bg-dark-input hover:bg-[#202C2E] text-dark-textMain'
          : task.completed
          ? 'bg-light-completed text-light-textMain/80'
          : isSelected
          ? 'bg-light-input border-l-4 border-light-checkGreen text-light-textMain shadow-sm'
          : 'bg-light-input hover:bg-[#D8EEF8] text-light-textMain'
      }`}
    >
      {/* Left side: Grip Handle + Checkbox + Title */}
      <div
        className="flex items-center gap-3 flex-1 min-w-0"
        onClick={() => onToggleComplete(task.id)}
      >
        {/* Drag handle */}
        <div
          className={`cursor-grab active:cursor-grabbing p-0.5 rounded transition-opacity ${
            isDark
              ? 'text-dark-textSec group-hover:text-white/80'
              : 'text-[#64747B] group-hover:text-black/80'
          }`}
          title="Arraste para reordenar ou mover"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4 opacity-70 group-hover:opacity-100" />
        </div>

        {/* Circular Checkbox */}
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
            task.completed
              ? isDark
                ? 'bg-[#16A34A] text-white shadow-sm'
                : 'bg-light-checkGreen text-[#1A2425] shadow-sm'
              : isDark
              ? 'border-2 border-dark-textSec/60 hover:border-dark-textSec'
              : 'border-2 border-[#64747B]/60 hover:border-[#425255]'
          }`}
          title={task.completed ? 'Reabrir atividade' : 'Concluir atividade'}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>

        {/* Task Title */}
        <span
          className={`text-sm font-medium truncate transition-all duration-200 ${
            task.completed ? 'line-through opacity-70' : ''
          }`}
        >
          {task.title}
        </span>
      </div>

      {/* Right side: File/Document Icon to open Details */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenDetails(task);
        }}
        title="Ver detalhes da tarefa"
        className={`p-1.5 rounded-lg transition-all duration-150 ml-2 flex-shrink-0 ${
          isDark
            ? 'text-[#5A6D82] hover:text-[#5B8DEF] hover:bg-white/5'
            : 'text-light-fileIcon hover:text-black hover:bg-black/5'
        }`}
        aria-label="Abrir detalhes e edição"
      >
        <FileText className="w-4 h-4" />
      </button>
    </div>
  );
}
