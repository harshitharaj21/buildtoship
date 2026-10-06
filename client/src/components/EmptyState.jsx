import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const EmptyState = ({ message = 'No tasks yet. Add a task above to get started!' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white/70 backdrop-blur-sm rounded-2xl border border-dashed border-slate-300 shadow-sm my-4">
      <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-3 shadow-inner">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">All caught up!</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm">{message}</p>
    </div>
  );
};
