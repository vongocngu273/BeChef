import React, { useState } from 'react';
import { Sparkles, Plus, X, Baby, UtensilsCrossed, ShieldAlert, Sun, Coffee } from 'lucide-react';

const FEEDING_METHODS = [
  {
    id: 'Truyền thống',
    icon: '🥣',
    label: 'Ăn dặm truyền thống',
    desc: 'Cháo xay nhuyễn/nấu nhừ kết hợp rau củ thịt cá'
  },
  {
    id: 'Kiểu Nhật',
    icon: '🍱',
    label: 'Ăn dặm kiểu Nhật',
    desc: 'Ăn riêng từng món, tăng độ thô theo tuần chuẩn Nhật'
  },
  {
    id: 'BLW',
    icon: '🥦',
    label: 'BLW (Tự chỉ huy)',
    desc: 'Bé tự bốc thức ăn mềm dạng thanh/miếng'
  }
];

const MEAL_TYPES = [
  {
    id: 'Bữa chính',
    icon: '☀️',
    label: 'Bữa chính (Trưa/Tối)',
    desc: 'Cân đối đủ 4 nhóm chất chính'
  },
  {
    id: 'Bữa phụ',
    icon: '🥞',
    label: 'Bữa phụ (Xế chiều/Tráng miệng)',
    desc: 'Thanh nhẹ, bánh hấp, sinh tố, súp tráng miệng'
  }
];

const INGREDIENT_CATEGORIES = {
  protein: {
    title: 'Đạm (Thịt, cá, tôm, trứng, đậu)',
    items: [
      { name: 'Thịt gà', emoji: '🍗' },
      { name: 'Thịt bò', emoji: '🥩' },
      { name: 'Thịt heo', emoji: '🥩' },
      { name: 'Cá hồi', emoji: '🐟' },
      { name: 'Tôm', emoji: '🦐' },
      { name: 'Trứng gà', emoji: '🥚' },
      { name: 'Đậu hũ', emoji: '🧊' }
    ]
  },
  veggie: {
    title: 'Rau củ & Quả',
    items: [
      { name: 'Bí đỏ', emoji: '🎃' },
      { name: 'Cà rốt', emoji: '🥕' },
      { name: 'Khoai tây', emoji: '🥔' },
      { name: 'Khoai lang', emoji: '🍠' },
      { name: 'Bông cải xanh', emoji: '🥦' },
      { name: 'Bắp ngọt', emoji: '🌽' },
      { name: 'Cải bó xôi', emoji: '🌿' },
      { name: 'Mồng tơi', emoji: '🌿' },
      { name: 'Bơ', emoji: '🥑' }
    ]
  },
  fruit_grain: {
    title: 'Trái cây & Tinh bột',
    items: [
      { name: 'Chuối chín', emoji: '🍌' },
      { name: 'Táo đỏ', emoji: '🍎' },
      { name: 'Quả lê', emoji: '🍐' },
      { name: 'Gạo tẻ', emoji: '🍚' },
      { name: 'Yến mạch', emoji: '🥣' }
    ]
  },
  oil_milk: {
    title: 'Dầu ăn dặm & Sữa',
    items: [
      { name: 'Dầu óc chó', emoji: '🌰' },
      { name: 'Dầu oliu', emoji: '🫒' },
      { name: 'Dầu mè', emoji: '🫒' },
      { name: 'Dầu cá hồi', emoji: '🐟' },
      { name: 'Sữa mẹ/CT', emoji: '🥛' }
    ]
  }
};

export default function RecipeForm({ onSubmit, isLoading }) {
  const [ageMonths, setAgeMonths] = useState(7);
  const [feedingMethod, setFeedingMethod] = useState('Truyền thống');
  const [mealType, setMealType] = useState('Bữa chính');
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
    if (trimmed) {
      const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      if (!customIngredients.includes(formatted)) {
        setCustomIngredients([...customIngredients, formatted]);
      }
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
      meal_type: mealType,
      available_ingredients: selectedIngredients,
      custom_ingredients: customIngredients
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-brand-100 space-y-6"
    >
      {/* Mascot Hero Banner */}
      <div className="bg-gradient-to-r from-amber-50/80 via-brand-50/60 to-orange-50/80 border border-brand-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-xs">
        <div className="relative shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-brand-400 to-amber-300 flex items-center justify-center text-3xl shadow-sm border border-white">
            👶🍳
          </div>
          <span className="absolute -bottom-1 -right-1 text-sm bg-white rounded-full p-0.5 shadow-xs">✨</span>
        </div>
        <div className="space-y-0.5">
          <h3 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug">
            Cùng mẹ chuẩn bị bữa ăn dặm đầu đời tràn đầy dinh dưỡng & yêu thương
          </h3>
          <p className="text-xs text-slate-600">
            BeChef đồng hành thiết kế thực đơn khoa học, độ thô chuẩn lứa tuổi và an toàn tuyệt đối.
          </p>
        </div>
      </div>

      {/* 1. Month Selection: Slider & Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="age-input" className="text-[15px] sm:text-base font-bold text-slate-800 flex items-center gap-2">
            <Baby className="w-5 h-5 text-brand-500" />
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
              className="w-16 px-2.5 py-1 text-center font-bold text-brand-700 bg-brand-50 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-[15px]"
            />
            <span className="text-xs sm:text-sm font-semibold text-slate-500">tháng</span>
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
          className="w-full h-2.5 bg-brand-100 rounded-lg appearance-none cursor-pointer accent-[#36BA34]"
        />

        <div className="flex justify-between text-xs text-slate-600 mt-1.5 font-medium">
          <span>6 tháng</span>
          <span>9 tháng</span>
          <span>12 tháng</span>
          <span>18 tháng</span>
          <span>24 tháng</span>
        </div>

        {/* Pediatric Texture & Seasoning Notice */}
        <div className="mt-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs sm:text-[13px] text-amber-900 flex items-start gap-2.5 leading-relaxed">
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
              <p className="text-[12px] text-rose-700 font-medium">
                * Khuyến nghị y khoa: Tuyệt đối KHÔNG dùng mật ong, muối, đường, mắm, bột ngọt/mì chính cho trẻ dưới 1 tuổi.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Feeding Method Selector */}
      <div>
        <label className="text-[15px] sm:text-base font-bold text-slate-800 flex items-center gap-2 mb-2.5">
          <UtensilsCrossed className="w-5 h-5 text-brand-500" />
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
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/70 ring-2 ring-brand-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-brand-200 hover:bg-brand-50/30'
                }`}
              >
                <div className="font-bold text-[15px] text-slate-800 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span>{method.icon}</span>
                    <span>{method.label}</span>
                  </span>
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#36BA34]"></span>}
                </div>
                <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">{method.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Meal Type Selector */}
      <div>
        <label className="text-[15px] sm:text-base font-bold text-slate-800 flex items-center gap-2 mb-2.5">
          <Sun className="w-5 h-5 text-amber-500" />
          <span>Phân loại bữa ăn:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MEAL_TYPES.map((type) => {
            const isSelected = mealType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setMealType(type.id)}
                aria-pressed={isSelected}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/70 ring-2 ring-brand-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-brand-200 hover:bg-brand-50/30'
                }`}
              >
                <div className="font-bold text-[15px] text-slate-800 mb-0.5 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{type.icon}</span>
                    <span>{type.label}</span>
                  </span>
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#36BA34]"></span>}
                </div>
                <p className="text-xs text-slate-500 ml-7">{type.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Ingredient Multi-Select Categorized with Emojis */}
      <div className="space-y-4">
        <label className="text-[15px] sm:text-base font-bold text-slate-800 block">
          Nguyên liệu mẹ sẵn có trong tủ lạnh:
        </label>

        {Object.entries(INGREDIENT_CATEGORIES).map(([catKey, category]) => (
          <div key={catKey} className="space-y-2">
            <span className="text-[13px] font-semibold text-slate-600 block">
              {category.title}
            </span>
            <div className="flex flex-wrap gap-2">
              {category.items.map((ingr) => {
                const isSelected = selectedIngredients.includes(ingr.name);
                return (
                  <button
                    key={ingr.name}
                    type="button"
                    onClick={() => toggleIngredient(ingr.name)}
                    className={`px-3 py-1.5 rounded-xl text-[14px] sm:text-[15px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-brand-100 hover:text-brand-800'
                    }`}
                  >
                    <span>{ingr.emoji} {ingr.name}</span>
                    {isSelected && <span className="text-xs leading-none font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 5. Custom Ingredients Tag-input */}
      <div>
        <label htmlFor="custom-ingredient-input" className="text-xs sm:text-sm font-semibold text-slate-600 block mb-1.5">
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
            className="flex-1 px-3.5 py-2.5 text-[15px] leading-normal bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="px-4 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 text-[15px] font-semibold rounded-xl border border-brand-200 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm</span>
          </button>
        </div>

        {customIngredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            {customIngredients.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[15px] bg-brand-100 text-brand-800 font-medium"
              >
                <span>🥗</span>
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeCustomIngredient(item)}
                  className="hover:text-rose-600 focus:outline-none cursor-pointer"
                  aria-label={`Xoá ${item}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 6. Submit CTA button */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg text-white flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all cursor-pointer ${
            isLoading
              ? 'bg-brand-400 cursor-not-allowed opacity-90'
              : 'bg-brand-500 hover:bg-brand-600 active:scale-[0.99]'
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
