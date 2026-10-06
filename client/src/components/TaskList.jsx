import React from 'react';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';
import { LoadingSpinner } from './LoadingSpinner';

export const TaskList = ({ tasks, loading, onToggle, onDelete }) => {
  if (loading) {
    return <LoadingSpinner text="Retrieving your tasks..." className="my-8" />;
  }

  if (!tasks || tasks.length === 0) {
    return <EmptyState />;
  }

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const percentComplete = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="w-full space-y-4">
      {/* Progress & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs text-slate-500 font-medium">
        <span>
          {completedCount} of {totalCount} task{totalCount === 1 ? '' : 's'} completed ({percentComplete}%)
        </span>

        {/* Mini progress track */}
        <div className="w-full sm:w-36 h-2 bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Task Item Stack */}
      <div className="space-y-2.5">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};
