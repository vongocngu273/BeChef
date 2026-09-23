import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

const STATUS_CONFIG = {
  SAFE: {
    defaultBadge: 'Phù hợp / An toàn',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600'
  },
  CAUTION: {
    defaultBadge: 'Cần lưu ý',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: AlertTriangle,
    iconColor: 'text-amber-600'
  },
  UNSAFE: {
    defaultBadge: 'Cấm dùng / Nguy hiểm',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: XCircle,
    iconColor: 'text-rose-600'
  }
};

const capitalize = (str) => {
  if (!str) return '';
  const trimmed = str.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

export default function SafetyAnalysisBox({ safetyAnalysis, analysis }) {
  const data = safetyAnalysis || analysis;

  if (!data) return null;

  const overallVerdict = data.overall_verdict || data.overallVerdict;
  const evaluations = data.ingredient_evaluations || data.ingredientEvaluations || [];

  if (!overallVerdict && evaluations.length === 0) return null;

  return (
    <div
      data-testid="safety-analysis-box"
      className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-brand-100 space-y-5 transition-all"
    >
      {/* Title & Section Header */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200/60">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
            Báo cáo thẩm định an toàn dinh dưỡng
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Thẩm định bởi AI dinh dưỡng nhi khoa theo hướng dẫn của Viện Dinh Dưỡng Quốc Gia
          </p>
        </div>
      </div>

      {/* Overall Verdict Banner */}
      {overallVerdict && (
        <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200/80 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-brand-800 uppercase tracking-wider">
              Kết luận tổng quan
            </h4>
            <p className="text-[15px] sm:text-base text-slate-700 leading-relaxed font-medium">
              {overallVerdict}
            </p>
          </div>
        </div>
      )}

      {/* Ingredient Evaluations Grid / List */}
      {evaluations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Chi tiết đánh giá từng nguyên liệu:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {evaluations.map((item, idx) => {
              const statusKey = String(item.status || 'SAFE').toUpperCase();
              const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG.SAFE;
              const StatusIcon = config.icon;
              const badgeText =
                item.badge_text &&
                !['SAFE', 'CAUTION', 'UNSAFE'].includes(item.badge_text.toUpperCase())
                  ? item.badge_text
                  : config.defaultBadge;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/70 hover:border-brand-200 transition-colors flex flex-col justify-between space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[15px] text-slate-800 flex items-center gap-1.5">
                      <StatusIcon className={`w-4 h-4 ${config.iconColor} shrink-0`} />
                      <span>{capitalize(item.ingredient)}</span>
                    </span>
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-full border ${config.badgeClass}`}
                    >
                      {badgeText}
                    </span>
                  </div>

                  {item.medical_note && (
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                      {item.medical_note}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
