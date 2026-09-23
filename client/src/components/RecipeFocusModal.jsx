import React, { useEffect } from 'react';
import { Minimize2, X, Sparkles } from 'lucide-react';
import RecipeCard from './RecipeCard';

export default function RecipeFocusModal({
  recipe,
  index = 0,
  completedSteps,
  onToggleStep,
  onClose
}) {
  if (!recipe) return null;

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock scroll on background body
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chế độ tập trung nấu bếp"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-brand-100">
        {/* Sticky Modal Header */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-brand-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800">
                Chế độ Nấu Bếp (Tập trung)
              </h2>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Phông chữ lớn, danh sách bước nấu trực quan dễ theo dõi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Thu nhỏ / Trở lại 3 món"
            title="Thu nhỏ / Trở lại 3 món"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Minimize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Thu nhỏ / Trở lại 3 món</span>
            <span className="sm:hidden">Thu nhỏ</span>
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Scrollable Focus View Body */}
        <div className="overflow-y-auto flex-1 p-2 sm:p-4 bg-brand-50/10">
          <RecipeCard
            recipe={recipe}
            index={index}
            isFocused={true}
            completedSteps={completedSteps}
            onToggleStep={onToggleStep}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
