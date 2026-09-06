import React, { useState } from 'react';
import { TaskItem } from './TaskItem';

export function TaskList({
  tasks,
  listType = 'active',
  selectedTaskId,
  onToggleComplete,
  onOpenDetails,
  onReorder,
  onCrossDrop,
  emptyMessage,
  theme,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const isDark = theme === 'dark';

  const handleDragStart = (e, index, task, sourceListType) => {
    setDraggedIndex(index);
    const dragPayload = { id: task.id, listType: sourceListType, index };
    e.dataTransfer.setData('application/json', JSON.stringify(dragPayload));
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    window.__draggedTask = dragPayload;
    e.currentTarget.classList.add('dragging');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    let payload = window.__draggedTask;
    if (!payload) {
      try {
        const raw = e.dataTransfer.getData('application/json');
        if (raw) payload = JSON.parse(raw);
      } catch (err) {}
    }

    if (payload) {
      // Se veio da mesma lista -> reordenação
      if (payload.listType === listType) {
        if (draggedIndex !== null && draggedIndex !== targetIndex) {
          onReorder(draggedIndex, targetIndex);
        }
      } else {
        // Veio da lista oposta -> transferir para esta lista no targetIndex
        if (onCrossDrop) {
          onCrossDrop(payload.id, targetIndex);
        }
      }
    }

    setDraggedIndex(null);
    window.__draggedTask = null;
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    setDraggedIndex(null);
    window.__draggedTask = null;
  };

  // Suporte para soltar no espaço vazio da lista
  const handleEmptyListDrop = (e) => {
    e.preventDefault();
    let payload = window.__draggedTask;
    if (!payload) {
      try {
        const raw = e.dataTransfer.getData('application/json');
        if (raw) payload = JSON.parse(raw);
      } catch (err) {}
    }
    if (payload && payload.listType !== listType && onCrossDrop) {
      onCrossDrop(payload.id, tasks.length);
    }
    setDraggedIndex(null);
    window.__draggedTask = null;
  };

  if (tasks.length === 0) {
    return (
      <div
        onDragOver={handleDragOver}
        onDrop={handleEmptyListDrop}
        className={`py-8 px-4 text-center text-xs rounded-xl border border-dashed transition-colors ${
          isDark
            ? 'border-white/10 text-dark-textSec hover:border-white/20'
            : 'border-black/10 text-light-textSec hover:border-black/20'
        }`}
      >
        {emptyMessage || (listType === 'active'
          ? 'Nenhuma atividade em andamento. Digite acima para adicionar!'
          : 'Nenhuma atividade concluída ainda. Arraste ou marque tarefas para cá!')}
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={(e) => {
        // Se soltar após o último item
        if (e.target === e.currentTarget) {
          handleEmptyListDrop(e);
        }
      }}
      className="space-y-2 min-h-[40px]"
    >
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          listType={listType}
          isSelected={task.id === selectedTaskId}
          onToggleComplete={onToggleComplete}
          onOpenDetails={onOpenDetails}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          theme={theme}
        />
      ))}
    </div>
  );
}
