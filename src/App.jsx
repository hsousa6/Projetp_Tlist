import React, { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { Header } from './components/Header';
import { TaskInput } from './components/TaskInput';
import { TaskAccordion } from './components/TaskAccordion';
import { TaskEditPanel } from './components/TaskEditPanel';
import { ConfirmModal } from './components/ConfirmModal';
import { Toast } from './components/Toast';

export function App() {
  const {
    activeTasks,
    completedTasks,
    theme,
    toggleTheme,
    addTask,
    toggleComplete,
    moveTaskToCompleted,
    moveTaskToActive,
    reorderActiveTasks,
    reorderCompletedTasks,
    updateTask,
    deleteTask,
    isAtLimit,
    activeCount,
    completedCount,
  } = useTasks();

  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const isDark = theme === 'dark';

  // Localizar a tarefa atualmente em edição em qualquer um dos dois arrays
  const currentEditingTask =
    activeTasks.find((t) => t.id === selectedTaskId) ||
    completedTasks.find((t) => t.id === selectedTaskId) ||
    null;

  const handleOpenDetails = (task) => {
    setSelectedTaskId(task.id);
  };

  const handleCloseDetails = () => {
    setSelectedTaskId(null);
  };

  const handleSaveTaskDetails = (taskId, fields) => {
    const isCompleted = completedTasks.some((t) => t.id === taskId);
    if (isCompleted) {
      setToast({
        type: 'error',
        message: 'Não é possível editar uma atividade concluída.',
      });
      return;
    }
    updateTask(taskId, fields);
    setSelectedTaskId(null);
    setToast({
      type: 'success',
      message: 'Atividade atualizada com sucesso!',
    });
  };

  const handleRequestDelete = (task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      if (selectedTaskId === taskToDelete.id) {
        setSelectedTaskId(null);
      }
      setToast({
        type: 'error',
        message: `Atividade "${taskToDelete.title}" excluída com sucesso!`,
      });
      setTaskToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
  };

  const handleAddTask = (title) => {
    const result = addTask(title);
    if (result.success) {
      setToast({
        type: 'success',
        message: 'Nova atividade adicionada com sucesso!',
      });
    } else {
      setToast({
        type: 'error',
        message: result.message,
      });
    }
    return result;
  };

  const handleToggleComplete = (id) => {
    const res = toggleComplete(id);
    if (!res.success && res.message) {
      setToast({
        type: 'error',
        message: res.message,
      });
    } else if (res.action === 'completed') {
      setToast({
        type: 'success',
        message: 'Atividade concluída com sucesso!',
      });
    } else if (res.action === 'reopened') {
      setToast({
        type: 'success',
        message: 'Atividade reaberta em andamento!',
      });
    }
  };

  const handleMoveToCompleted = (id, targetIdx = null) => {
    moveTaskToCompleted(id, targetIdx);
    setToast({
      type: 'success',
      message: 'Atividade movida para Concluídas!',
    });
  };

  const handleMoveToActive = (id, targetIdx = null) => {
    const res = moveTaskToActive(id, targetIdx);
    if (!res.success && res.message) {
      setToast({
        type: 'error',
        message: res.message,
      });
    } else {
      setToast({
        type: 'success',
        message: 'Atividade movida para Atividades em andamento!',
      });
    }
  };

  return (
    <main
      className={`min-h-screen w-full flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 ${
        isDark
          ? 'bg-dark-bg text-dark-textMain'
          : 'bg-gradient-to-br from-[#B9D8EC] via-[#C9E5F4] to-[#BFE2E4] text-light-textMain'
      }`}
    >
      {/* Central Phone/Card Container inspired by mockups */}
      <div
        className={`w-full max-w-[440px] sm:max-w-[480px] rounded-[32px] p-5 sm:p-6 transition-all duration-300 shadow-2xl relative ${
          isDark
            ? 'bg-dark-card border border-white/10 shadow-card-dark'
            : 'bg-light-card border border-white/40 shadow-card-light'
        }`}
      >
        {/* Top Header com Alternador de Tema */}
        <Header theme={theme} toggleTheme={toggleTheme} />

        {/* Campo de Input para Adicionar Tarefas */}
        <TaskInput
          onAddTask={handleAddTask}
          isAtLimit={isAtLimit}
          taskCount={activeCount}
          theme={theme}
        />

        {/* Container Responsivo com Suporte a Abas (Desktop) e Sanfonas Empilhadas (Mobile) */}
        <TaskAccordion
          activeTasks={activeTasks}
          completedTasks={completedTasks}
          selectedTaskId={selectedTaskId}
          onToggleComplete={handleToggleComplete}
          onOpenDetails={handleOpenDetails}
          onReorderActive={reorderActiveTasks}
          onReorderCompleted={reorderCompletedTasks}
          onMoveToCompleted={handleMoveToCompleted}
          onMoveToActive={handleMoveToActive}
          theme={theme}
        />
      </div>

      {/* Modal de Edição de Tarefa */}
      {currentEditingTask && (
        <TaskEditPanel
          task={currentEditingTask}
          onSave={handleSaveTaskDetails}
          onRequestDelete={handleRequestDelete}
          onClose={handleCloseDetails}
          theme={theme}
        />
      )}

      {/* Modal de Confirmação para Exclusão */}
      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        taskTitle={taskToDelete?.title || ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        theme={theme}
      />

      {/* Feedback Visual Toast */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
        theme={theme}
      />
    </main>
  );
}

export default App;
