import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

export const TaskForm = ({ onAddTask, isCreating }) => {
  const [title, setTitle] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setValidationError('Please enter a task title.');
      return;
    }

    if (trimmedTitle.length > 255) {
      setValidationError('Task title cannot exceed 255 characters.');
      return;
    }

    setValidationError('');
    const success = await onAddTask(trimmedTitle);
    if (success) {
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all duration-200">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (validationError) setValidationError('');
          }}
          placeholder="What would you like to accomplish today?"
          disabled={isCreating}
          maxLength={255}
          className="flex-1 px-4 py-3 bg-transparent text-slate-800 placeholder-slate-400 text-sm md:text-base focus:outline-hidden disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isCreating || !title.trim()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium text-sm rounded-xl transition-all duration-150 shadow-sm shadow-emerald-600/20 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Task</span>
            </>
          )}
        </button>
      </div>

      {validationError && (
        <p className="mt-2 text-xs font-medium text-red-600 px-2">{validationError}</p>
      )}
    </form>
  );
};
