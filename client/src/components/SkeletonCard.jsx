import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-100 p-6 flex flex-col justify-between animate-pulse space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="h-5 bg-brand-100 rounded-full w-24"></div>
          <div className="h-5 bg-slate-100 rounded-full w-20"></div>
        </div>
        <div className="h-7 bg-slate-200 rounded-lg w-3/4 mb-3"></div>
        <div className="h-4 bg-brand-50 rounded w-1/2"></div>
      </div>

      {/* Texture & Yield */}
      <div className="p-3 bg-brand-50/50 rounded-xl space-y-2 border border-brand-100/50">
        <div className="h-4 bg-brand-100 rounded w-5/6"></div>
        <div className="h-3 bg-brand-100/70 rounded w-2/3"></div>
      </div>

      {/* 2-column ingredients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
        <div className="bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/50 space-y-2">
          <div className="h-4 bg-emerald-200/60 rounded w-3/4"></div>
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-4/5"></div>
        </div>
        <div className="bg-amber-50/40 p-3 rounded-xl border border-amber-100/50 space-y-2">
          <div className="h-4 bg-amber-200/60 rounded w-3/4"></div>
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-4/5"></div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-slate-100 rounded w-full"></div>
        <div className="h-3 bg-slate-100 rounded w-full"></div>
        <div className="h-3 bg-slate-100 rounded w-5/6"></div>
      </div>

      {/* Pediatrician Tip */}
      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 space-y-2">
        <div className="h-3 bg-blue-200 rounded w-1/4"></div>
        <div className="h-3 bg-blue-100 rounded w-full"></div>
      </div>

      {/* Copy Button */}
      <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
    </div>
  );
}
