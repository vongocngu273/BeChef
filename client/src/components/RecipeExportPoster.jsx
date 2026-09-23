import React, { forwardRef } from 'react';
import { Clock, ChefHat, CheckCircle2, ShoppingBag, AlertCircle, ShieldCheck } from 'lucide-react';

const RecipeExportPoster = forwardRef(({ recipe }, ref) => {
  if (!recipe) return null;

  return (
    <div
      ref={ref}
      data-testid="recipe-export-poster"
      className="bg-white p-7 rounded-3xl border border-brand-200 shadow-lg font-sans text-slate-800 space-y-4 w-[600px]"
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Header */}
      <div className="border-b border-brand-100 pb-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center text-2xl shadow-sm">
              👶🍳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-slate-900 tracking-tight">BeChef</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
                  AI Ăn Dặm
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Thực đơn dinh dưỡng chuẩn Y khoa Nhi</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800">
              {recipe.suitable_age_range || 'Ăn dặm'}
            </span>
            {recipe.difficulty && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {recipe.difficulty}
              </span>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 leading-snug">
            {recipe.dish_name}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1.5">
            {recipe.feeding_method && (
              <span className="font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-md">
                {recipe.feeding_method}
              </span>
            )}
            {recipe.yield_portion && (
              <span>
                Khẩu phần: <strong className="text-slate-800">{recipe.yield_portion}</strong>
              </span>
            )}
            <div className="flex items-center gap-1.5 ml-auto text-slate-500">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              <span>Chuẩn bị: <strong className="text-slate-700">{recipe.prep_time_minutes ?? 10}p</strong></span>
              <span className="mx-1">•</span>
              <span>Nấu: <strong className="text-slate-700">{recipe.cook_time_minutes ?? 15}p</strong></span>
            </div>
          </div>
        </div>

        {recipe.texture_description && (
          <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-2xl text-xs text-amber-900 leading-relaxed">
            <span className="font-bold block text-amber-950 mb-0.5">🥣 Độ thô khuyến nghị:</span>
            {recipe.texture_description}
          </div>
        )}
      </div>

      {/* Body: 2-column ingredients summary */}
      <div className="grid grid-cols-2 gap-3">
        {/* Sẵn có */}
        <div className="bg-emerald-50/60 rounded-2xl border border-emerald-100 p-3.5">
          <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Nguyên liệu sẵn có</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {(recipe.available_ingredients_used || []).map((item, idx) => (
              <li key={idx} className="flex justify-between items-baseline gap-2">
                <span className="font-medium text-slate-800">{item.name}</span>
                <span className="text-slate-500 font-medium">{item.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cần mua */}
        <div className="bg-amber-50/60 rounded-2xl border border-amber-100 p-3.5">
          <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800 mb-2">
            <ShoppingBag className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Cần mua thêm</span>
          </div>
          {(recipe.missing_ingredients_needed || []).length > 0 ? (
            <ul className="space-y-1.5 text-xs text-slate-700">
              {recipe.missing_ingredients_needed.map((item, idx) => (
                <li key={idx} className="flex justify-between items-baseline gap-2">
                  <span className="font-medium text-slate-800">{item.name}</span>
                  <span className="text-slate-500 font-medium">{item.amount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">Đã đủ nguyên liệu!</p>
          )}
        </div>
      </div>

      {/* Numbered Step-by-Step Guide */}
      <div className="space-y-2">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
          Các bước thực hiện:
        </h4>
        <div className="space-y-2">
          {(recipe.cooking_steps || []).map((step, idx) => {
            const cleanStepText = step.replace(/^Bước\s*\d+:\s*/i, '');
            return (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs text-slate-700 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="flex-1">{cleanStepText}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pediatrician Tip Callout */}
      {recipe.pediatrician_tip && (
        <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-2xl flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-blue-950">Lời khuyên Bác sĩ Nhi khoa:</span>
            <p className="mt-0.5">{recipe.pediatrician_tip}</p>
          </div>
        </div>
      )}

      {/* Footer Watermark */}
      <div className="pt-3 border-t border-brand-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Thực đơn dinh dưỡng BeChef - Chuẩn Y Khoa Nhi • Tác giả: <strong className="text-slate-700">Ngự Võ</strong></span>
        <div className="flex items-center gap-1 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
          <span>Bé khỏe mẹ an tâm</span>
        </div>
      </div>
    </div>
  );
});

RecipeExportPoster.displayName = 'RecipeExportPoster';

export default RecipeExportPoster;
