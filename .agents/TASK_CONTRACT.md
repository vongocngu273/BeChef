# TASK CONTRACT: RELEASE v1.1.0 - UI Refresh, Pediatric Safety Analyzer & Deployment

## 1. Goal & Scope
Upgrade BeChef UI with `Be Vietnam Pro` typography, `#36BA34` primary green branding, automatic Vietnamese ingredient capitalization, and new AI Pediatric Safety & Suitability Analyzer (`safety_analysis` block) in both Backend API and Frontend UI.

## 2. Shared Frozen API Contract (`POST /api/generate-recipes`)

### Request Payload:
```json
{
  "age_months": 8,
  "feeding_method": "Truyền thống",
  "available_ingredients": ["Thịt gà", "Bí đỏ"],
  "custom_ingredients": ["Khoai lang"]
}
```

### Response Payload:
```json
{
  "safety_analysis": {
    "overall_verdict": "string",
    "ingredient_evaluations": [
      {
        "ingredient": "string",
        "status": "SAFE" | "CAUTION" | "UNSAFE",
        "badge_text": "string",
        "medical_note": "string"
      }
    ]
  },
  "recipes": [
    {
      "dish_name": "string",
      "suitable_age_range": "string",
      "feeding_method": "string",
      "texture_description": "string",
      "yield_portion": "string",
      "prep_time_minutes": 10,
      "cook_time_minutes": 20,
      "difficulty": "Dễ",
      "available_ingredients_used": [{ "name": "string", "amount": "string" }],
      "missing_ingredients_needed": [{ "name": "string", "amount": "string" }],
      "cooking_steps": ["string"],
      "pediatrician_tip": "string"
    }
  ]
}
```

## 3. Sub-Agent Responsibilities
- **Backend Specialist**:
  - `utils/textFormatter.js`: `capitalizeIngredient(str)`.
  - `services/geminiService.js`: Update `RECIPE_SCHEMA` to include `safety_analysis`, update system prompt, update fallback recipes to include `safety_analysis`.
  - `tests/recipe.test.js`: Add schema verification and safety analysis tests.
- **Frontend Specialist**:
  - `client/index.html`: Import `Be Vietnam Pro` from Google Fonts.
  - `client/tailwind.config.js`: Set `brand-500: #36BA34`, font family `Be Vietnam Pro`.
  - `client/src/components/RecipeForm.jsx`: Auto-capitalize input chips.
  - `client/src/components/SafetyAnalysisBox.jsx`: Render the pediatric evaluation box above recipes.
  - `client/src/App.jsx`: State handling and layout integration.
  - `tests/App.test.jsx`: Assert font, capitalization, and safety analysis box rendering.
- **QA Specialist**:
  - Independent validation, 100% test pass across all suites, build check.
- **Orchestrator**:
  - Coordinate parallel subagents, integrate changes, commit and push to remote.
