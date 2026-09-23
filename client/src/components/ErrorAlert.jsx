import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorAlert({ message, onRetry }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-800 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-semibold text-rose-900 text-sm">Có lỗi xảy ra</h4>
          <p className="text-sm text-rose-700 mt-0.5 leading-relaxed">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-white border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Thử lại
        </button>
      )}
    </div>
  );
}
