import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskApi } from '../services/api';
import { Navbar } from '../components/Navbar';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { ErrorMessage } from '../components/ErrorMessage';
import { ListFilter, Sparkles, RefreshCw } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch all tasks for current authenticated user
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to retrieve tasks from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create Task
  const handleAddTask = async (title) => {
    try {
      setIsCreating(true);
      setErrorMessage('');
      const newTask = await taskApi.createTask(title);
      setTasks((prev) => [newTask, ...prev]);
      return true;
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create task.');
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  // Toggle Task Completion
  const handleToggleTask = async (id, newCompletedState) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompletedState } : t))
    );

    try {
      await taskApi.updateTask(id, { completed: newCompletedState });
    } catch (err) {
      // Rollback on error
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !newCompletedState } : t))
      );
      setErrorMessage(err.message || 'Failed to update task.');
    }
  };

  // Delete Task
  const handleDeleteTask = async (id) => {
    const previousTasks = [...tasks];
    // Optimistic delete
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await taskApi.deleteTask(id);
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);
      setErrorMessage(err.message || 'Failed to delete task.');
    }
  };

  // Filter tasks based on active pill
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Workspace</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Hello, {user?.email?.split('@')[0] || 'there'}!
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Stay organized, focused, and get things done today.
            </p>
          </div>

          {/* Quick Refresh Button */}
          <button
            onClick={fetchTasks}
            disabled={loading}
            className="self-start md:self-auto inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Global Error Alert */}
        {errorMessage && (
          <div className="mb-6">
            <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage('')} />
          </div>
        )}

        {/* Task Creation Section */}
        <section className="mb-8">
          <TaskForm onAddTask={handleAddTask} isCreating={isCreating} />
        </section>

        {/* Task List Section */}
        <section className="bg-white/80 backdrop-blur-xs rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-xs">
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-slate-400" />
              <h3 className="text-base font-semibold text-slate-800">Your Tasks</h3>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({tasks.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filter === 'active'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Active ({tasks.filter((t) => !t.completed).length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filter === 'completed'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Done ({tasks.filter((t) => t.completed).length})
              </button>
            </div>
          </div>

          {/* Task List Component */}
          <TaskList
            tasks={filteredTasks}
            loading={loading}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        </section>
      </main>
    </div>
  );
};
