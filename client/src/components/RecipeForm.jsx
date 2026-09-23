import React, { useState } from 'react';
import { Sparkles, Plus, X, Baby, UtensilsCrossed, ShieldAlert } from 'lucide-react';

const FEEDING_METHODS = [
  { id: 'Truyền thống', label: 'Truyền thống', desc: 'Cháo xay nhuyễn/nấu nhừ kết hợp' },
  { id: 'Kiểu Nhật', label: 'Kiểu Nhật', desc: 'Ăn riêng từng món, tăng độ thô theo tuần' },
  { id: 'BLW', label: 'BLW (Tự chỉ huy)', desc: 'Bé tự bốc thức ăn mềm dạng thanh/miếng' }
];

const INGREDIENT_CATEGORIES = {
  protein: {
    title: 'Đạm (Thịt, cá, trứng, đậu)',
    items: ['Thịt heo', 'Thịt bò', 'Thịt gà', 'Cá hồi', 'Tôm', 'Đậu hũ']
  },
  veggie: {
    title: 'Rau củ',
    items: ['Bí đỏ', 'Cà rốt', 'Cải bó xôi', 'Mồng tơi']
  },
  oil: {
    title: 'Dầu ăn dặm',
    items: ['Dầu óc chó', 'Dầu mè', 'Dầu cá hồi']
  }
};

export default function RecipeForm({ onSubmit, isLoading }) {
  const [ageMonths, setAgeMonths] = useState(7);
  const [feedingMethod, setFeedingMethod] = useState('Truyền thống');
  const [selectedIngredients, setSelectedIngredients] = useState([
    'Thịt gà',
    'Bí đỏ',
    'Dầu óc chó'
  ]);
  const [customInput, setCustomInput] = useState('');
  const [customIngredients, setCustomIngredients] = useState([]);

  const toggleIngredient = (name) => {
    if (selectedIngredients.includes(name)) {
      setSelectedIngredients(selectedIngredients.filter((item) => item !== name));
    } else {
      setSelectedIngredients([...selectedIngredients, name]);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (trimmed && !customIngredients.includes(trimmed)) {
      setCustomIngredients([...customIngredients, trimmed]);
      setCustomInput('');
    }
  };

  const removeCustomIngredient = (name) => {
    setCustomIngredients(customIngredients.filter((item) => item !== name));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      age_months: Number(ageMonths),
      feeding_method: feedingMethod,
      available_ingredients: selectedIngredients,
      custom_ingredients: customIngredients
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100 space-y-6"
    >
      {/* 1. Month Selection: Slider & Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="age-input" className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Baby className="w-4 h-4 text-orange-600" />
            <span>Độ tuổi của bé (tháng):</span>
          </label>
          <div className="flex items-center gap-1">
            <input
              id="age-input"
              type="number"
              min="6"
              max="24"
              value={ageMonths}
              onChange={(e) => setAgeMonths(Math.max(6, Math.min(24, Number(e.target.value) || 6)))}
              className="w-16 px-2.5 py-1 text-center font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="text-xs font-semibold text-slate-500">tháng</span>
          </div>
        </div>

        <input
          type="range"
          min="6"
          max="24"
          step="1"
          aria-label="Thanh trượt chọn tháng tuổi của bé"
          value={ageMonths}
          onChange={(e) => setAgeMonths(Number(e.target.value))}
          className="w-full h-2.5 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
        />

        <div className="flex justify-between text-[11px] text-slate-600 mt-1 font-medium">
          <span>6 tháng</span>
          <span>9 tháng</span>
          <span>12 tháng</span>
          <span>18 tháng</span>
          <span>24 tháng</span>
        </div>

        {/* Pediatric Texture & Seasoning Notice */}
        <div className="mt-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">
              Giai đoạn {ageMonths} tháng:{' '}
              <span className="font-normal text-amber-800">
                {ageMonths <= 7
                  ? 'Độ thô 1:10 (mịn nhuyễn, rây kỹ qua lưới)'
                  : ageMonths <= 8
                  ? 'Độ thô 1:7 (nghiền bằng nĩa, lợn cợn mềm)'
                  : ageMonths <= 11
                  ? 'Độ thô 1:5 (thái hạt lựu mềm, tập bốc nhón)'
                  : 'Cơm nát & thức ăn gia đình cắt nhỏ vừa miệng'}
              </span>
            </p>
            {ageMonths < 12 && (
              <p className="text-[11px] text-rose-700 font-medium">
                * Khuyến nghị y khoa: Tuyệt đối KHÔNG dùng mật ong, muối, đường, mắm, bột ngọt/mì chính cho trẻ dưới 1 tuổi.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Method Selector */}
      <div>
        <label className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2.5">
          <UtensilsCrossed className="w-4 h-4 text-orange-600" />
          <span>Phương pháp ăn dặm:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FEEDING_METHODS.map((method) => {
            const isSelected = feedingMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setFeedingMethod(method.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/30'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm text-slate-800 mb-0.5 flex items-center justify-between">
                  <span>{method.label}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-orange-600"></span>}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{method.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Ingredient Multi-Select Categorized */}
      <div className="space-y-4">
        <label className="text-sm font-bold text-slate-800 block">
          Nguyên liệu mẹ sẵn có trong tủ lạnh:
        </label>

        {Object.entries(INGREDIENT_CATEGORIES).map(([catKey, category]) => (
          <div key={catKey} className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">
              {category.title}
            </span>
            <div className="flex flex-wrap gap-2">
              {category.items.map((ingr) => {
                const isSelected = selectedIngredients.includes(ingr);
                return (
                  <button
                    key={ingr}
                    type="button"
                    onClick={() => toggleIngredient(ingr)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-orange-100 hover:text-orange-800'
                    }`}
                  >
                    <span>{ingr}</span>
                    {isSelected && <span className="text-[10px] leading-none font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Custom Ingredients Tag-input */}
      <div>
        <label htmlFor="custom-ingredient-input" className="text-xs font-semibold text-slate-500 block mb-1.5">
          Nguyên liệu khác của bạn (nhập và bấm Thêm):
        </label>
        <div className="flex gap-2">
          <input
            id="custom-ingredient-input"
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustom(e);
              }
            }}
            placeholder="Ví dụ: Khoai lang, cá chép, cải ngọt..."
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="px-4 py-2 bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm</span>
          </button>
        </div>

        {customIngredients.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {customIngredients.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-orange-100 text-orange-800 font-medium"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeCustomIngredient(item)}
                  className="hover:text-rose-600 focus:outline-none cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 5. Submit CTA button */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer ${
            isLoading
              ? 'bg-orange-400 cursor-not-allowed opacity-90'
              : 'bg-orange-600 hover:bg-orange-500 active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span>Đang xây dựng thực đơn dinh dưỡng...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Gợi ý món ăn ngay</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
