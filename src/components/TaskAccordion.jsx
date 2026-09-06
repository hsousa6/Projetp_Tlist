import React, { useState } from 'react';
import { ChevronDown, CheckCircle2, ListTodo } from 'lucide-react';
import { TaskList } from './TaskList';

export function TaskAccordion({
  activeTasks,
  completedTasks,
  selectedTaskId,
  onToggleComplete,
  onOpenDetails,
  onReorderActive,
  onReorderCompleted,
  onMoveToCompleted,
  onMoveToActive,
  theme,
}) {
  // Desktop state
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed'
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [isDragOverCompletedTab, setIsDragOverCompletedTab] = useState(false);
  const [isDragOverActiveTab, setIsDragOverActiveTab] = useState(false);

  // Mobile state (duas sanfonas empilhadas)
  const [isMobileActiveOpen, setIsMobileActiveOpen] = useState(true);
  const [isMobileCompletedOpen, setIsMobileCompletedOpen] = useState(true);
  const [isDragOverMobileCompletedHeader, setIsDragOverMobileCompletedHeader] = useState(false);
  const [isDragOverMobileActiveHeader, setIsDragOverMobileActiveHeader] = useState(false);

  const isDark = theme === 'dark';

  // Helper para recuperar item arrastado
  const getDraggedPayload = (e) => {
    let payload = window.__draggedTask;
    if (!payload) {
      try {
        const raw = e.dataTransfer.getData('application/json');
        if (raw) payload = JSON.parse(raw);
      } catch (err) {}
    }
    return payload;
  };

  // Drop handlers para Desktop Tabs
  const handleDropOnCompletedTab = (e) => {
    e.preventDefault();
    setIsDragOverCompletedTab(false);
    const payload = getDraggedPayload(e);
    if (payload && payload.listType === 'active') {
      onMoveToCompleted(payload.id);
      setActiveTab('completed');
    }
  };

  const handleDropOnActiveTab = (e) => {
    e.preventDefault();
    setIsDragOverActiveTab(false);
    const payload = getDraggedPayload(e);
    if (payload && payload.listType === 'completed') {
      onMoveToActive(payload.id);
      setActiveTab('active');
    }
  };

  // Drop handlers para Mobile Headers
  const handleDropOnMobileCompleted = (e) => {
    e.preventDefault();
    setIsDragOverMobileCompletedHeader(false);
    const payload = getDraggedPayload(e);
    if (payload && payload.listType === 'active') {
      onMoveToCompleted(payload.id);
      setIsMobileCompletedOpen(true);
    }
  };

  const handleDropOnMobileActive = (e) => {
    e.preventDefault();
    setIsDragOverMobileActiveHeader(false);
    const payload = getDraggedPayload(e);
    if (payload && payload.listType === 'completed') {
      onMoveToActive(payload.id);
      setIsMobileActiveOpen(true);
    }
  };

  return (
    <div className="w-full mb-6">
      {/* ========================================================================= */}
      {/* 1. VISÃO DESKTOP / TABLET (OPÇÃO A): Duas abas no cabeçalho sanfonado     */}
      {/* ========================================================================= */}
      <div className="hidden sm:block rounded-2xl overflow-hidden transition-all duration-300">
        {/* Accordion Header com Abas */}
        <div
          className={`w-full flex items-center justify-between px-3 py-2.5 transition-all select-none ${
            isDark ? 'bg-[#1E2529] text-dark-textMain' : 'bg-light-header text-light-textMain'
          } ${isDesktopOpen ? 'rounded-t-2xl' : 'rounded-2xl'}`}
        >
          {/* Tabs Container */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/10">
            {/* Aba Atividades */}
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOverActiveTab(true);
              }}
              onDragLeave={() => setIsDragOverActiveTab(false)}
              onDrop={handleDropOnActiveTab}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'active'
                  ? isDark
                    ? 'bg-[#1C2627] text-white shadow-sm'
                    : 'bg-light-input text-[#1A2425] shadow-sm'
                  : 'text-inherit opacity-70 hover:opacity-100'
              } ${isDragOverActiveTab ? 'ring-2 ring-emerald-400 scale-105' : ''}`}
            >
              <ListTodo className="w-4 h-4" />
              <span>Atividades</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'active'
                    ? isDark
                      ? 'bg-white/10 text-white'
                      : 'bg-black/10 text-black'
                    : 'bg-black/10'
                }`}
              >
                {activeTasks.length}/10
              </span>
            </button>

            {/* Aba Concluídas (Drop target para depositar tarefas) */}
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOverCompletedTab(true);
              }}
              onDragLeave={() => setIsDragOverCompletedTab(false)}
              onDrop={handleDropOnCompletedTab}
              title="Arraste tarefas ativas para cá para concluir!"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'completed'
                  ? isDark
                    ? 'bg-[#1C2627] text-white shadow-sm'
                    : 'bg-light-input text-[#1A2425] shadow-sm'
                  : 'text-inherit opacity-70 hover:opacity-100'
              } ${isDragOverCompletedTab ? 'ring-2 ring-emerald-400 bg-emerald-500/20 scale-105' : ''}`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Concluídas</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'completed'
                    ? isDark
                      ? 'bg-white/10 text-white'
                      : 'bg-black/10 text-black'
                    : 'bg-black/10'
                }`}
              >
                {completedTasks.length}
              </span>
            </button>
          </div>

          {/* Botão de Expandir / Recolher Accordion */}
          <button
            type="button"
            onClick={() => setIsDesktopOpen(prev => !prev)}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
            title={isDesktopOpen ? 'Recolher sanfona' : 'Expandir sanfona'}
            aria-label="Expandir ou recolher"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                isDesktopOpen ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </button>
        </div>

        {/* Conteúdo da Aba Ativa */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isDesktopOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div
            className={`p-2.5 rounded-b-2xl border-t ${
              isDark ? 'bg-[#181F22] border-white/5' : 'bg-[#ABCFD4] border-black/5'
            }`}
          >
            {activeTab === 'active' ? (
              <TaskList
                tasks={activeTasks}
                listType="active"
                selectedTaskId={selectedTaskId}
                onToggleComplete={onToggleComplete}
                onOpenDetails={onOpenDetails}
                onReorder={onReorderActive}
                onCrossDrop={(id, targetIdx) => onMoveToActive(id, targetIdx)}
                emptyMessage="Nenhuma atividade em andamento. Digite acima para adicionar (máximo 10)!"
                theme={theme}
              />
            ) : (
              <TaskList
                tasks={completedTasks}
                listType="completed"
                selectedTaskId={selectedTaskId}
                onToggleComplete={onToggleComplete}
                onOpenDetails={onOpenDetails}
                onReorder={onReorderCompleted}
                onCrossDrop={(id, targetIdx) => onMoveToCompleted(id, targetIdx)}
                emptyMessage="Nenhuma atividade concluída ainda. Conclua ou arraste tarefas para cá!"
                theme={theme}
              />
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. VISÃO MOBILE (OPÇÃO B): Duas sanfonas empilhadas                       */}
      {/* ========================================================================= */}
      <div className="block sm:hidden space-y-3">
        {/* Sanfona 1: Atividades (Limite 10) */}
        <div className="rounded-2xl overflow-hidden transition-all">
          <div
            onClick={() => setIsMobileActiveOpen(prev => !prev)}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOverMobileActiveHeader(true);
            }}
            onDragLeave={() => setIsDragOverMobileActiveHeader(false)}
            onDrop={handleDropOnMobileActive}
            className={`w-full flex items-center justify-between px-4 py-3 cursor-pointer select-none transition-all ${
              isDark ? 'bg-[#1E2529] text-dark-textMain' : 'bg-light-header text-light-textMain'
            } ${isMobileActiveOpen ? 'rounded-t-2xl' : 'rounded-2xl'} ${
              isDragOverMobileActiveHeader ? 'ring-2 ring-emerald-400' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <ListTodo className="w-4 h-4" />
              <span className="font-semibold text-sm">Atividades</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black/15">
                {activeTasks.length}/10
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isMobileActiveOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isMobileActiveOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <div
              className={`p-2 rounded-b-2xl border-t ${
                isDark ? 'bg-[#181F22] border-white/5' : 'bg-[#ABCFD4] border-black/5'
              }`}
            >
              <TaskList
                tasks={activeTasks}
                listType="active"
                selectedTaskId={selectedTaskId}
                onToggleComplete={onToggleComplete}
                onOpenDetails={onOpenDetails}
                onReorder={onReorderActive}
                onCrossDrop={(id, targetIdx) => onMoveToActive(id, targetIdx)}
                emptyMessage="Nenhuma atividade em andamento (limite de 10)."
                theme={theme}
              />
            </div>
          </div>
        </div>

        {/* Sanfona 2: Concluídas (Ilimitado) */}
        <div className="rounded-2xl overflow-hidden transition-all">
          <div
            onClick={() => setIsMobileCompletedOpen(prev => !prev)}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOverMobileCompletedHeader(true);
            }}
            onDragLeave={() => setIsDragOverMobileCompletedHeader(false)}
            onDrop={handleDropOnMobileCompleted}
            title="Arraste atividades para cá para concluir"
            className={`w-full flex items-center justify-between px-4 py-3 cursor-pointer select-none transition-all ${
              isDark ? 'bg-[#1A2226] text-dark-textMain' : 'bg-[#92BAC0] text-light-textMain'
            } ${isMobileCompletedOpen ? 'rounded-t-2xl' : 'rounded-2xl'} ${
              isDragOverMobileCompletedHeader ? 'ring-2 ring-emerald-400 bg-emerald-500/20' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-sm">Concluídas</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black/15">
                {completedTasks.length}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isMobileCompletedOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isMobileCompletedOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <div
              className={`p-2 rounded-b-2xl border-t ${
                isDark ? 'bg-[#151D20] border-white/5' : 'bg-[#9FBEC3] border-black/5'
              }`}
            >
              <TaskList
                tasks={completedTasks}
                listType="completed"
                selectedTaskId={selectedTaskId}
                onToggleComplete={onToggleComplete}
                onOpenDetails={onOpenDetails}
                onReorder={onReorderCompleted}
                onCrossDrop={(id, targetIdx) => onMoveToCompleted(id, targetIdx)}
                emptyMessage="Nenhuma atividade concluída ainda."
                theme={theme}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
