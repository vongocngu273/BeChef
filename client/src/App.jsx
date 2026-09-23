import React, { useState } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeCard from './components/RecipeCard';
import RecipeFocusModal from './components/RecipeFocusModal';
import SkeletonCard from './components/SkeletonCard';
import ErrorAlert from './components/ErrorAlert';
import SafetyAnalysisBox from './components/SafetyAnalysisBox';
import { generateRecipes } from './api/recipeApi';
import { ChefHat, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';

export default function App() {
  const [recipes, setRecipes] = useState(null);
  const [safetyAnalysis, setSafetyAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastPayload, setLastPayload] = useState(null);
  const [focusedRecipeIndex, setFocusedRecipeIndex] = useState(null);
  const [completedStepsMap, setCompletedStepsMap] = useState({});

  const handleToggleStep = (recipeIndex, stepIndex) => {
    setCompletedStepsMap((prev) => {
      const currentSteps = prev[recipeIndex] || [];
      const updated = currentSteps.includes(stepIndex)
        ? currentSteps.filter((s) => s !== stepIndex)
        : [...currentSteps, stepIndex];
      return { ...prev, [recipeIndex]: updated };
    });
  };

  const handleGenerate = async (payload) => {
    setLoading(true);
    setError(null);
    setLastPayload(payload);
    setFocusedRecipeIndex(null);
    setCompletedStepsMap({});

    try {
      const data = await generateRecipes(payload);
      if (data && Array.isArray(data.recipes)) {
        setRecipes(data.recipes);
        setSafetyAnalysis(data.safety_analysis || null);
      } else {
        throw new Error('Dữ liệu công thức trả về không đúng định dạng chuẩn.');
      }
    } catch (err) {
      setError(err.message || 'Không thể lấy gợi ý món ăn dặm. Vui lòng thử lại.');
      setRecipes(null);
      setSafetyAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastPayload) {
      handleGenerate(lastPayload);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-brand-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight flex items-center gap-1.5">
                <span>BeChef</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
                  AI Ăn Dặm
                </span>
              </h1>
              <p className="text-[11px] text-slate-600 hidden sm:block">
                Gợi ý 3 món ăn dặm chuẩn quy tắc dinh dưỡng nhi khoa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-brand-800 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-200">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span className="hidden md:inline">Chuẩn Y Khoa Nhi (6-24 Tháng)</span>
            <span className="md:hidden">Chuẩn Y Khoa</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Hero Section */}
        <section className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hôm nay nấu gì cho bé yêu ăn dặm?
          </h2>
          <p className="text-sm text-slate-600">
            Chỉ cần chọn độ tuổi và nguyên liệu sẵn có, Trí tuệ nhân tạo sẽ thiết kế 3 thực đơn an toàn, đúng độ thô và cân bằng vi chất.
          </p>
        </section>

        {/* Form Section */}
        <section className="max-w-2xl mx-auto">
          <RecipeForm onSubmit={handleGenerate} isLoading={loading} />
        </section>

        {/* Error Boundary / Notification */}
        {error && (
          <section className="max-w-4xl mx-auto">
            <ErrorAlert message={error} onRetry={handleRetry} />
          </section>
        )}

        {/* Results Section */}
        <section className="space-y-6">
          {loading && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-500 animate-spin" />
                  <span>Đang tạo 3 thực đơn dinh dưỡng chuẩn độ tuổi...</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
          )}

          {!loading && recipes && recipes.length > 0 && (
            <div className="space-y-6">
              {safetyAnalysis && (
                <SafetyAnalysisBox safetyAnalysis={safetyAnalysis} />
              )}

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    3 Thực Đơn Gợi Ý Dành Riêng Cho Bé
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Đã kiểm duyệt nghiêm ngặt quy chuẩn an toàn nhi khoa (không gia vị có hại, độ thô phù hợp)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe, index) => (
                  <RecipeCard
                    key={index}
                    recipe={recipe}
                    index={index}
                    completedSteps={completedStepsMap[index] || []}
                    onToggleStep={(stepIdx) => handleToggleStep(index, stepIdx)}
                    onFocus={() => setFocusedRecipeIndex(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Focus Mode Modal */}
      {focusedRecipeIndex !== null && recipes && recipes[focusedRecipeIndex] && (
        <RecipeFocusModal
          recipe={recipes[focusedRecipeIndex]}
          index={focusedRecipeIndex}
          completedSteps={completedStepsMap[focusedRecipeIndex] || []}
          onToggleStep={(stepIdx) => handleToggleStep(focusedRecipeIndex, stepIdx)}
          onClose={() => setFocusedRecipeIndex(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-brand-100 bg-white/60 py-6 mt-12 text-center text-xs text-slate-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p>© 2026 BeChef • Tác giả: <strong className="text-slate-800 font-semibold">Ngự Võ</strong></p>
            <p className="text-[11px] text-slate-500 mt-0.5">Gợi ý thực đơn ăn dặm chuẩn dinh dưỡng y khoa nhi</p>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <span>Đồng hành cùng sức khỏe bé yêu</span>
            <HeartHandshake className="w-4 h-4 text-rose-500 inline" />
          </div>
        </div>
      </footer>
    </div>
  );
}
