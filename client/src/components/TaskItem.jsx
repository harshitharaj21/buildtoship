import React, { useState } from 'react';
import { Check, Trash2, Loader2, Calendar } from 'lucide-react';

export const TaskItem = ({ task, onToggle, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    if (isUpdating || isDeleting) return;
    setIsUpdating(true);
    try {
      await onToggle(task.id, !task.completed);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (isUpdating || isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format creation date
  const formattedDate = new Date(task.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      className={`group flex items-center justify-between gap-3.5 p-4 rounded-xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/80 border-slate-200 opacity-80'
          : 'bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-md hover:shadow-slate-100'
      }`}
    >
      {/* Left: Custom Checkbox & Task Title */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isUpdating || isDeleting}
          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-150 shrink-0 cursor-pointer ${
            task.completed
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-slate-300 hover:border-emerald-500 bg-white'
          }`}
          aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
        >
          {isUpdating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
          ) : task.completed ? (
            <Check className="w-4 h-4 stroke-[3]" />
          ) : null}
        </button>

        <div className="flex flex-col min-w-0">
          <span
            onClick={handleToggle}
            className={`text-sm md:text-base font-medium transition-all duration-150 cursor-pointer select-none truncate ${
              task.completed
                ? 'line-through text-slate-400 font-normal'
                : 'text-slate-800 group-hover:text-slate-900'
            }`}
          >
            {task.title}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isUpdating || isDeleting}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50"
          title="Delete task"
          aria-label="Delete task"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
