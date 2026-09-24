import { useState, useEffect } from 'react';

export function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function useTasks() {
  // Inicialização do array de tarefas ativas (limite 10)
  const [activeTasks, setActiveTasks] = useState(() => {
    try {
      const savedActive = localStorage.getItem('todo_list_active_tasks');
      if (savedActive) {
        const parsed = JSON.parse(savedActive);
        if (Array.isArray(parsed)) return parsed.slice(0, 10);
      }

      // Migração de formato antigo caso exista
      const legacy = localStorage.getItem('todo_list_tasks');
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        if (Array.isArray(parsedLegacy)) {
          return parsedLegacy.filter(t => !t.completed).slice(0, 10);
        }
      }
    } catch (e) {
      console.error('Erro ao carregar tarefas ativas:', e);
    }
    return [];
  });

  // Inicialização do array de tarefas concluídas (ilimitado)
  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const savedCompleted = localStorage.getItem('todo_list_completed_tasks');
      if (savedCompleted) {
        const parsed = JSON.parse(savedCompleted);
        if (Array.isArray(parsed)) return parsed;
      }

      // Migração de formato antigo caso exista
      const legacy = localStorage.getItem('todo_list_tasks');
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        if (Array.isArray(parsedLegacy)) {
          return parsedLegacy.filter(t => t.completed);
        }
      }
    } catch (e) {
      console.error('Erro ao carregar tarefas concluídas:', e);
    }
    return [];
  });

  // Tema
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('todo_list_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch (e) {
      console.error('Erro ao ler tema do localStorage:', e);
    }
    return 'dark';
  });

  // Sincronizar tarefas ativas com localStorage
  useEffect(() => {
    try {
      localStorage.setItem('todo_list_active_tasks', JSON.stringify(activeTasks));
    } catch (e) {
      console.error('Erro ao salvar tarefas ativas no localStorage:', e);
    }
  }, [activeTasks]);

  // Sincronizar tarefas concluídas com localStorage
  useEffect(() => {
    try {
      localStorage.setItem('todo_list_completed_tasks', JSON.stringify(completedTasks));
    } catch (e) {
      console.error('Erro ao salvar tarefas concluídas no localStorage:', e);
    }
  }, [completedTasks]);

  // Sincronizar tema
  useEffect(() => {
    try {
      localStorage.setItem('todo_list_theme', theme);
    } catch (e) {
      console.error('Erro ao salvar tema:', e);
    }

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Adicionar nova atividade (apenas no array ativo, respeitando limite de 10)
  const addTask = (title) => {
    if (activeTasks.length >= 10) {
      return { success: false, message: 'Limite máximo de 10 atividades em andamento atingido!' };
    }
    const trimmed = title.trim();
    if (!trimmed) {
      return { success: false, message: 'Digite um título para a tarefa.' };
    }
    if (trimmed.length < 3) {
      return { success: false, message: 'O título deve ter pelo menos 3 caracteres.' };
    }

    const newTask = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: capitalizeFirstLetter(trimmed),
      completed: false,
      completedAt: null,
      createdAt: Date.now(),
    };

    setActiveTasks(prev => [...prev, newTask]);
    return { success: true, task: newTask };
  };

  // Alternar conclusão
  const toggleComplete = (id) => {
    // 1. Se estiver no array de ativas -> mover para concluídas
    const activeIndex = activeTasks.findIndex(t => t.id === id);
    if (activeIndex !== -1) {
      const task = activeTasks[activeIndex];
      const completedTask = {
        ...task,
        completed: true,
        completedAt: new Date().toISOString(),
      };
      setActiveTasks(prev => prev.filter(t => t.id !== id));
      setCompletedTasks(prev => [completedTask, ...prev]);
      return { success: true, action: 'completed', task: completedTask };
    }

    // 2. Se estiver no array de concluídas -> reabrir para ativas (se limite < 10)
    const completedIndex = completedTasks.findIndex(t => t.id === id);
    if (completedIndex !== -1) {
      if (activeTasks.length >= 10) {
        return {
          success: false,
          message: 'Limite de 10 atividades em andamento atingido! Conclua ou exclua uma atividade antes de reabrir.',
        };
      }
      const task = completedTasks[completedIndex];
      const reopenedTask = {
        ...task,
        completed: false,
        completedAt: null,
      };
      setCompletedTasks(prev => prev.filter(t => t.id !== id));
      setActiveTasks(prev => [...prev, reopenedTask]);
      return { success: true, action: 'reopened', task: reopenedTask };
    }

    return { success: false, message: 'Tarefa não encontrada.' };
  };

  // Mover explicitamente para concluídas (via drag-and-drop na aba/container)
  const moveTaskToCompleted = (id, targetIndex = null) => {
    const task = activeTasks.find(t => t.id === id);
    if (!task) return;

    const completedTask = {
      ...task,
      completed: true,
      completedAt: new Date().toISOString(),
    };

    setActiveTasks(prev => prev.filter(t => t.id !== id));
    setCompletedTasks(prev => {
      const copy = [...prev];
      if (targetIndex !== null && targetIndex >= 0 && targetIndex <= copy.length) {
        copy.splice(targetIndex, 0, completedTask);
      } else {
        copy.unshift(completedTask);
      }
      return copy;
    });
  };

  // Mover explicitamente para ativas (via drag-and-drop na aba/container)
  const moveTaskToActive = (id, targetIndex = null) => {
    if (activeTasks.length >= 10) {
      return {
        success: false,
        message: 'Limite de 10 atividades em andamento atingido!',
      };
    }
    const task = completedTasks.find(t => t.id === id);
    if (!task) return { success: false };

    const reopenedTask = {
      ...task,
      completed: false,
      completedAt: null,
    };

    setCompletedTasks(prev => prev.filter(t => t.id !== id));
    setActiveTasks(prev => {
      const copy = [...prev];
      if (targetIndex !== null && targetIndex >= 0 && targetIndex <= copy.length) {
        copy.splice(targetIndex, 0, reopenedTask);
      } else {
        copy.push(reopenedTask);
      }
      return copy;
    });
    return { success: true };
  };

  // Reordenação de ativas
  const reorderActiveTasks = (startIndex, endIndex) => {
    if (startIndex === endIndex) return;
    setActiveTasks(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  // Reordenação de concluídas
  const reorderCompletedTasks = (startIndex, endIndex) => {
    if (startIndex === endIndex) return;
    setCompletedTasks(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  // Atualizar tarefa (somente permitida para tarefas ativas)
  const updateTask = (id, fields) => {
    // Se a tarefa estiver nas concluídas, não permite alteração
    const isCompleted = completedTasks.some(task => task.id === id);
    if (isCompleted) return;

    const formattedFields = { ...fields };
    if (formattedFields.title) {
      formattedFields.title = capitalizeFirstLetter(formattedFields.title);
    }

    setActiveTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...formattedFields } : task))
    );
  };

  // Excluir tarefa de qualquer array
  const deleteTask = (id) => {
    setActiveTasks(prev => prev.filter(task => task.id !== id));
    setCompletedTasks(prev => prev.filter(task => task.id !== id));
  };

  return {
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
    isAtLimit: activeTasks.length >= 10,
    activeCount: activeTasks.length,
    completedCount: completedTasks.length,
  };
}
