import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="flex items-start justify-between gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm shadow-sm transition-all duration-200">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <span className="font-medium">{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 transition-colors p-0.5 rounded-lg hover:bg-red-100"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
