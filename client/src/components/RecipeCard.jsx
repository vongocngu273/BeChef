import React, { useState } from 'react';
import {
  Clock,
  ChefHat,
  Check,
  Copy,
  AlertCircle,
  ShoppingBag,
  CheckCircle2,
  Maximize2,
  Minimize2
} from 'lucide-react';

export default function RecipeCard({
  recipe,
  index = 0,
  onFocus,
  isFocused = false,
  completedSteps,
  onToggleStep,
  onClose
}) {
  const [copied, setCopied] = useState(false);
  const [localCompletedSteps, setLocalCompletedSteps] = useState([]);

  if (!recipe) return null;

  const activeCompletedSteps =
    completedSteps !== undefined ? completedSteps : localCompletedSteps;

  const handleToggleStep = (stepIdx) => {
    if (onToggleStep) {
      onToggleStep(stepIdx);
    } else {
      setLocalCompletedSteps((prev) =>
        prev.includes(stepIdx)
          ? prev.filter((i) => i !== stepIdx)
          : [...prev, stepIdx]
      );
    }
  };

  const handleCopyShoppingList = async () => {
    const missing = recipe.missing_ingredients_needed || [];
    if (missing.length === 0) {
      navigator.clipboard?.writeText?.('Không cần mua thêm nguyên liệu nào!');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      return;
    }

    const textToCopy =
      `🛒 Danh sách đi chợ cho món "${recipe.dish_name}":\n` +
      missing.map((item, idx) => `${idx + 1}. ${item.name} (${item.amount})`).join('\n');

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers or test environments
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const getDifficultyColor = (diff) => {
    const d = (diff || '').toLowerCase();
    if (d.includes('dễ') || d.includes('easy'))
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (d.includes('trung'))
      return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  const totalSteps = (recipe.cooking_steps || []).length;
  const completedCount = activeCompletedSteps.length;

  return (
    <div
      data-testid={`recipe-card-${index}`}
      className={`bg-white transition-all duration-300 flex flex-col justify-between ${
        isFocused
          ? 'rounded-3xl shadow-none p-2 sm:p-4'
          : 'rounded-3xl shadow-sm hover:shadow-md border border-orange-100 overflow-hidden group'
      }`}
    >
      {/* Top Banner & Header */}
      <div className={isFocused ? 'p-4 sm:p-6 pb-2 sm:pb-3' : 'p-6 pb-4'}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-orange-100/80 text-orange-800 ${
                isFocused ? 'px-3.5 py-1.5 text-sm' : 'px-3 py-1 text-xs'
              }`}
            >
              <ChefHat
                className={`${isFocused ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-orange-600`}
              />
              {recipe.suitable_age_range || 'Phù hợp'}
            </span>
            <span
              className={`rounded-full font-semibold border ${getDifficultyColor(
                recipe.difficulty
              )} ${isFocused ? 'px-3.5 py-1.5 text-sm' : 'px-3 py-1 text-xs'}`}
            >
              {recipe.difficulty || 'Dễ'}
            </span>
          </div>

          {/* Zoom / Focus Button for card view */}
          {onFocus && !isFocused && (
            <button
              type="button"
              onClick={() => onFocus(recipe, index)}
              aria-label="Xem chi tiết / Phóng to"
              title="Xem chi tiết / Phóng to"
              data-testid={`focus-btn-${index}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 hover:text-orange-800 border border-orange-200 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Maximize2 className="w-3.5 h-3.5 text-orange-600" />
              <span>Phóng to</span>
            </button>
          )}

          {/* Minimize button inside card if focused and onClose provided */}
          {isFocused && onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Thu nhỏ / Trở lại 3 món"
              title="Thu nhỏ / Trở lại 3 món"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Minimize2 className="w-4 h-4 text-slate-600" />
              <span>Thu nhỏ / Trở lại 3 món</span>
            </button>
          )}
        </div>

        <h3
          className={`font-bold text-slate-800 group-hover:text-orange-600 transition-colors ${
            isFocused
              ? 'text-2xl sm:text-3xl tracking-tight text-slate-900'
              : 'text-xl line-clamp-2'
          }`}
        >
          {recipe.dish_name}
        </h3>

        {/* Feeding Method badge & yield */}
        <div
          className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-slate-600 ${
            isFocused ? 'text-sm' : 'text-xs'
          }`}
        >
          <span className="font-semibold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-md">
            {recipe.feeding_method || 'Ăn dặm'}
          </span>
          {recipe.yield_portion && (
            <span>
              Khẩu phần:{' '}
              <strong className="text-slate-800">{recipe.yield_portion}</strong>
            </span>
          )}
        </div>

        {/* Timings */}
        <div
          className={`flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-slate-600 ${
            isFocused ? 'text-sm' : 'text-xs'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Clock
              className={`${isFocused ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-slate-400`}
            />
            <span>
              Chuẩn bị:{' '}
              <strong className="text-slate-800">
                {recipe.prep_time_minutes ?? 10}p
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock
              className={`${isFocused ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-slate-400`}
            />
            <span>
              Nấu:{' '}
              <strong className="text-slate-800">
                {recipe.cook_time_minutes ?? 15}p
              </strong>
            </span>
          </div>
        </div>

        {/* Texture Description */}
        {recipe.texture_description && (
          <div
            className={`mt-3 bg-amber-50/70 border border-amber-100 rounded-2xl text-amber-900 leading-relaxed ${
              isFocused ? 'p-4 text-sm sm:text-base' : 'p-3 text-xs'
            }`}
          >
            <span className="font-bold block text-amber-950 mb-0.5">
              🥣 Độ thô khuyến nghị:
            </span>
            {recipe.texture_description}
          </div>
        )}
      </div>

      {/* Middle: 2-column ingredients split */}
      <div className={isFocused ? 'px-4 sm:px-6 py-2' : 'px-6 py-2'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Available ingredients */}
          <div
            className={`bg-emerald-50/50 rounded-2xl border border-emerald-100 ${
              isFocused ? 'p-4' : 'p-3.5'
            }`}
          >
            <div
              className={`flex items-center gap-1.5 font-bold text-emerald-800 mb-2 ${
                isFocused ? 'text-sm' : 'text-xs'
              }`}
            >
              <CheckCircle2
                className={`${isFocused ? 'w-4.5 h-4.5' : 'w-4 h-4'} text-emerald-600 shrink-0`}
              />
              <span>Nguyên liệu sẵn có</span>
            </div>
            <ul
              className={`space-y-1.5 text-slate-700 ${
                isFocused ? 'text-sm' : 'text-xs'
              }`}
            >
              {(recipe.available_ingredients_used || []).map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-baseline gap-2"
                >
                  <span className="font-medium text-slate-800">{item.name}</span>
                  <span className="text-slate-600 shrink-0 font-medium">
                    {item.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing ingredients */}
          <div
            className={`bg-amber-50/50 rounded-2xl border border-amber-100 ${
              isFocused ? 'p-4' : 'p-3.5'
            }`}
          >
            <div
              className={`flex items-center gap-1.5 font-bold text-amber-800 mb-2 ${
                isFocused ? 'text-sm' : 'text-xs'
              }`}
            >
              <ShoppingBag
                className={`${isFocused ? 'w-4.5 h-4.5' : 'w-4 h-4'} text-amber-600 shrink-0`}
              />
              <span>Cần mua thêm</span>
            </div>
            {(recipe.missing_ingredients_needed || []).length > 0 ? (
              <ul
                className={`space-y-1.5 text-slate-700 ${
                  isFocused ? 'text-sm' : 'text-xs'
                }`}
              >
                {recipe.missing_ingredients_needed.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-baseline gap-2"
                  >
                    <span className="font-medium text-slate-800">{item.name}</span>
                    <span className="text-slate-600 shrink-0 font-medium">
                      {item.amount}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p
                className={`text-slate-600 italic ${
                  isFocused ? 'text-sm' : 'text-xs'
                }`}
              >
                Đã đủ nguyên liệu!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Cooking Steps (Interactive Checklist) */}
      <div className={isFocused ? 'px-4 sm:px-6 py-4 sm:py-5' : 'px-6 py-3'}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h4
            className={`font-bold text-slate-800 uppercase tracking-wider ${
              isFocused ? 'text-sm' : 'text-xs'
            }`}
          >
            Các bước thực hiện:
          </h4>
          <span
            className={`font-semibold ${
              isFocused ? 'text-xs' : 'text-[11px]'
            } ${
              completedCount === totalSteps && totalSteps > 0
                ? 'text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full'
                : 'text-slate-500'
            }`}
          >
            {completedCount}/{totalSteps} hoàn thành
          </span>
        </div>

        <ol className={`space-y-2 ${isFocused ? 'space-y-3' : 'space-y-2'}`}>
          {(recipe.cooking_steps || []).map((step, idx) => {
            const isCompleted = activeCompletedSteps.includes(idx);
            const cleanStepText = step.replace(/^Bước\s*\d+:\s*/i, '');
            return (
              <li
                key={idx}
                role="checkbox"
                aria-checked={isCompleted}
                tabIndex={0}
                onClick={() => handleToggleStep(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggleStep(idx);
                  }
                }}
                data-testid={`step-item-${idx}`}
                className={`flex items-start gap-3 p-2.5 rounded-2xl cursor-pointer select-none transition-all duration-200 border ${
                  isCompleted
                    ? 'opacity-50 text-slate-400 line-through bg-slate-50/80 border-slate-200/80'
                    : 'bg-white hover:bg-orange-50/40 border-slate-100 hover:border-orange-200 text-slate-700 shadow-xs'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs transition-colors mt-0.5 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    idx + 1
                  )}
                </span>
                <span
                  className={`leading-relaxed flex-1 ${
                    isFocused
                      ? 'text-base sm:text-lg font-medium'
                      : 'text-xs sm:text-sm'
                  } ${isCompleted ? 'opacity-50 text-slate-400 line-through' : 'text-slate-700'}`}
                >
                  {cleanStepText}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Pediatrician Tip & Actions */}
      <div
        className={`mt-auto space-y-3 ${
          isFocused ? 'p-4 sm:p-6 pt-2 sm:pt-3' : 'p-6 pt-3'
        }`}
      >
        {recipe.pediatrician_tip && (
          <div
            className={`bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3 text-blue-900 leading-relaxed ${
              isFocused ? 'p-4 text-sm sm:text-base' : 'p-3 text-xs'
            }`}
          >
            <AlertCircle
              className={`${isFocused ? 'w-5 h-5' : 'w-4 h-4'} text-blue-600 shrink-0 mt-0.5`}
            />
            <div>
              <span className="font-bold block text-blue-950">
                Lời khuyên Bác sĩ Nhi khoa:
              </span>
              <p className="mt-0.5">{recipe.pediatrician_tip}</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleCopyShoppingList}
          aria-label="Sao chép danh sách đi chợ"
          className={`w-full rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99] ${
            isFocused ? 'py-3.5 px-5 text-sm sm:text-base' : 'py-2.5 px-4 text-xs'
          } ${
            copied
              ? 'bg-emerald-600 text-white shadow-emerald-200'
              : 'bg-slate-900 text-white hover:bg-orange-600'
          }`}
        >
          {copied ? (
            <>
              <Check
                className={isFocused ? 'w-5 h-5 text-white' : 'w-4 h-4 text-white'}
              />
              <span>Đã sao chép danh sách!</span>
            </>
          ) : (
            <>
              <Copy className={isFocused ? 'w-5 h-5' : 'w-4 h-4'} />
              <span>Sao chép danh sách đi chợ</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
