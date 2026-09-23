# TASK CONTRACT: RELEASE v1.2.0 - Visual Overhaul, Multi-Theme System & Smart Cooking UX

## 1. Goal & Scope
Transform BeChef into a warm, vivid, mother-and-baby web app. Introduce a multi-theme background system with ambient blobs, iconized categories, save-as-image functionality, hands-free cooking mode with speech synthesis, single recipe replacement API, and meal type categorization ("Bữa chính" / "Bữa phụ").

## 2. Core Specifications

### A. Theme System (Stored in `localStorage`)
- **Mầm Xanh Dịu Mát (Default):** Tone `#36BA34`, background `#F8FAF8`, ambient blobs `#36BA34/15`.
- **Cà Rốt Ấm Áp:** Tone `#FB923C`, background `#FFF7ED`, ambient blobs `#FDBA74/20`.
- **Bơ Sữa Ngọt Ngào:** Tone `#F59E0B`, background `#FEFCE8`, ambient blobs `#FDE047/25`.
- **Bé Mây Tươi Sáng:** Tone `#38BDF8`, background `#F0F9FF`, ambient blobs `#7DD3FC/20`.
Ambient Blobs styled with `blur-3xl` and subtle doodle/line-art pattern.

### B. Visual Polish & Mascot
- Hero Mascot + message: "Cùng mẹ chuẩn bị bữa ăn dặm đầu đời tràn đầy dinh dưỡng & yêu thương".
- Category Icons:
  - Feeding Methods: 🥣 Ăn dặm truyền thống | 🍱 Ăn dặm kiểu Nhật | 🥦 Bé tự chỉ huy (BLW)
  - Meal Type: ☀️ Bữa chính (Trưa/Tối) | 🥞 Bữa phụ (Xế chiều/Tráng miệng)
  - Ingredient chips with emojis (🥩 Thịt bò, 🐟 Cá hồi, 🦐 Tôm, 🎃 Bí đỏ, 🥕 Cà rốt, 🥑 Bơ, 🫒 Dầu oliu...).
- Card styling: `rounded-2xl`, soft borders, layered shadows, hover lift transition.

### C. Advanced UX
1. **Save as Image (`html-to-image`):** "Lưu ảnh công thức" export to PNG.
2. **Hands-Free Cook Mode (`CookModeModal.jsx`):** Fullscreen modal, 24px-28px font, step-by-step navigation, Web Speech API Vietnamese read-aloud.
3. **Regenerate Single Recipe (🔄 "Đổi món này"):** Calls `POST /api/regenerate-single-recipe` and updates only that recipe in place.

## 3. Shared Frozen API Contract

### A. `POST /api/generate-recipes`
- Request body:
```json
{
  "age_months": 8,
  "feeding_method": "Truyền thống",
  "meal_type": "Bữa chính",
  "available_ingredients": ["Cá hồi", "Bí đỏ"],
  "custom_ingredients": ["Hạt sen"]
}
```
- Response: Returns `{ safety_analysis, recipes: [...] }`.

### B. `POST /api/regenerate-single-recipe`
- Request body:
```json
{
  "age_months": 8,
  "feeding_method": "Truyền thống",
  "meal_type": "Bữa chính",
  "current_dish_name": "Cháo cá hồi bí đỏ",
  "available_ingredients": ["Cá hồi", "Bí đỏ"],
  "custom_ingredients": ["Hạt sen"]
}
```
- Response: Returns `{ recipe: { ... } }` matching the single recipe schema.

## 4. Sub-Agent Responsibilities
- **Backend Specialist:**
  - `routes/recipeRoutes.js`: Add `meal_type` validation in `POST /api/generate-recipes`. Add `POST /api/regenerate-single-recipe` endpoint.
  - `services/geminiService.js`: Enhance prompt for `meal_type` ("Bữa chính" vs "Bữa phụ"). Implement `regenerateSingleRecipe(params)` with fallback. Keep pediatric safety guardrails intact.
  - `tests/recipe.test.js`: Comprehensive tests for both endpoints and `meal_type`.
- **Frontend UX/UI Specialist:**
  - `client/src/components/ThemeSwitcher.jsx`: Theme selector with 4 themes and `localStorage`.
  - `client/src/components/CookModeModal.jsx`: Fullscreen hands-free cooking modal with Web Speech API.
  - `client/src/components/RecipeCard.jsx`: Add "Lưu ảnh công thức", "Đổi món này", and "Bắt đầu nấu".
  - `client/src/components/RecipeForm.jsx`: Add meal type selector and emojis for ingredient chips.
  - `client/src/App.jsx`: State management for themes, ambient background blobs, meal type, and single recipe replacement.
- **QA & Test Automation Specialist:**
  - Verify all 3 test suites, add integration tests for `regenerate-single-recipe` and cook mode/theme switching, ensure 100% Quality Gate pass.
