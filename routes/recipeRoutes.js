const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

/**
 * POST /api/generate-recipes
 * Body: { age_months: int, feeding_method: string, meal_type?: string, available_ingredients: [string], custom_ingredients: [string] }
 */
router.post('/generate-recipes', async (req, res) => {
  try {
    const { age_months, feeding_method, meal_type, available_ingredients, custom_ingredients } = req.body;

    // Validation: age_months is required, must be integer, between 6 and 24
    if (age_months === undefined || age_months === null || typeof age_months !== 'number' || isNaN(age_months)) {
      return res.status(400).json({
        error: 'Độ tuổi (age_months) là bắt buộc và phải là số nguyên hợp lệ.'
      });
    }

    if (!Number.isInteger(age_months)) {
      return res.status(400).json({
        error: 'Độ tuổi (age_months) phải là số nguyên.'
      });
    }

    if (age_months < 6 || age_months > 24) {
      return res.status(400).json({
        error: 'Độ tuổi bé phải nằm trong khoảng từ 6 đến 24 tháng.'
      });
    }

    // Validation: feeding_method
    if (!feeding_method || typeof feeding_method !== 'string' || feeding_method.trim() === '') {
      return res.status(400).json({
        error: 'Phương pháp ăn dặm (feeding_method) là bắt buộc.'
      });
    }

    // Validation: meal_type (optional, default "Bữa chính")
    let cleanMealType = 'Bữa chính';
    if (meal_type !== undefined && meal_type !== null) {
      if (typeof meal_type !== 'string') {
        return res.status(400).json({
          error: 'Loại bữa ăn (meal_type) phải là chuỗi ký tự.'
        });
      }
      const trimmedMeal = meal_type.trim();
      if (trimmedMeal !== '') {
        if (trimmedMeal !== 'Bữa chính' && trimmedMeal !== 'Bữa phụ') {
          return res.status(400).json({
            error: 'Loại bữa ăn (meal_type) chỉ có thể là "Bữa chính" hoặc "Bữa phụ".'
          });
        }
        cleanMealType = trimmedMeal;
      }
    }

    // Validation: available_ingredients
    if (available_ingredients !== undefined && !Array.isArray(available_ingredients)) {
      return res.status(400).json({
        error: 'Danh sách nguyên liệu sẵn có (available_ingredients) phải là một mảng.'
      });
    }

    // Validation: custom_ingredients
    if (custom_ingredients !== undefined && !Array.isArray(custom_ingredients)) {
      return res.status(400).json({
        error: 'Danh sách nguyên liệu tùy chọn (custom_ingredients) phải là một mảng.'
      });
    }

    const cleanAvailable = Array.isArray(available_ingredients)
      ? available_ingredients.map(i => String(i).trim()).filter(Boolean)
      : [];

    const cleanCustom = Array.isArray(custom_ingredients)
      ? custom_ingredients.map(i => String(i).trim()).filter(Boolean)
      : [];

    const result = await geminiService.generateBabyRecipes({
      age_months,
      feeding_method: feeding_method.trim(),
      meal_type: cleanMealType,
      available_ingredients: cleanAvailable,
      custom_ingredients: cleanCustom
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error generating recipes:', error);
    return res.status(500).json({
      error: error.message || 'Đã xảy ra lỗi khi tạo công thức nấu ăn.'
    });
  }
});

/**
 * POST /api/regenerate-single-recipe
 * Body: { age_months: int, feeding_method: string, meal_type?: string, current_dish_name: string, available_ingredients?: [string], custom_ingredients?: [string] }
 */
router.post('/regenerate-single-recipe', async (req, res) => {
  try {
    const {
      age_months,
      feeding_method,
      meal_type,
      current_dish_name,
      available_ingredients,
      custom_ingredients
    } = req.body;

    // Validation: age_months is required, must be integer, between 6 and 24
    if (age_months === undefined || age_months === null || typeof age_months !== 'number' || isNaN(age_months)) {
      return res.status(400).json({
        error: 'Độ tuổi (age_months) là bắt buộc và phải là số nguyên hợp lệ.'
      });
    }

    if (!Number.isInteger(age_months)) {
      return res.status(400).json({
        error: 'Độ tuổi (age_months) phải là số nguyên.'
      });
    }

    if (age_months < 6 || age_months > 24) {
      return res.status(400).json({
        error: 'Độ tuổi bé phải nằm trong khoảng từ 6 đến 24 tháng.'
      });
    }

    // Validation: feeding_method
    if (!feeding_method || typeof feeding_method !== 'string' || feeding_method.trim() === '') {
      return res.status(400).json({
        error: 'Phương pháp ăn dặm (feeding_method) là bắt buộc.'
      });
    }

    // Validation: current_dish_name
    if (!current_dish_name || typeof current_dish_name !== 'string' || current_dish_name.trim() === '') {
      return res.status(400).json({
        error: 'Tên món ăn hiện tại (current_dish_name) là bắt buộc.'
      });
    }

    // Validation: meal_type (optional, default "Bữa chính")
    let cleanMealType = 'Bữa chính';
    if (meal_type !== undefined && meal_type !== null) {
      if (typeof meal_type !== 'string') {
        return res.status(400).json({
          error: 'Loại bữa ăn (meal_type) phải là chuỗi ký tự.'
        });
      }
      const trimmedMeal = meal_type.trim();
      if (trimmedMeal !== '') {
        if (trimmedMeal !== 'Bữa chính' && trimmedMeal !== 'Bữa phụ') {
          return res.status(400).json({
            error: 'Loại bữa ăn (meal_type) chỉ có thể là "Bữa chính" hoặc "Bữa phụ".'
          });
        }
        cleanMealType = trimmedMeal;
      }
    }

    // Validation: available_ingredients
    if (available_ingredients !== undefined && !Array.isArray(available_ingredients)) {
      return res.status(400).json({
        error: 'Danh sách nguyên liệu sẵn có (available_ingredients) phải là một mảng.'
      });
    }

    // Validation: custom_ingredients
    if (custom_ingredients !== undefined && !Array.isArray(custom_ingredients)) {
      return res.status(400).json({
        error: 'Danh sách nguyên liệu tùy chọn (custom_ingredients) phải là một mảng.'
      });
    }

    const cleanAvailable = Array.isArray(available_ingredients)
      ? available_ingredients.map(i => String(i).trim()).filter(Boolean)
      : [];

    const cleanCustom = Array.isArray(custom_ingredients)
      ? custom_ingredients.map(i => String(i).trim()).filter(Boolean)
      : [];

    const singleRecipe = await geminiService.regenerateSingleRecipe({
      age_months,
      feeding_method: feeding_method.trim(),
      meal_type: cleanMealType,
      current_dish_name: current_dish_name.trim(),
      available_ingredients: cleanAvailable,
      custom_ingredients: cleanCustom
    });

    return res.status(200).json({
      recipe: singleRecipe && singleRecipe.recipe ? singleRecipe.recipe : singleRecipe
    });
  } catch (error) {
    console.error('Error regenerating single recipe:', error);
    return res.status(500).json({
      error: error.message || 'Đã xảy ra lỗi khi tạo lại công thức nấu ăn.'
    });
  }
});

module.exports = router;
