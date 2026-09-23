const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

/**
 * POST /api/generate-recipes
 * Body: { age_months: int, feeding_method: string, available_ingredients: [string], custom_ingredients: [string] }
 */
router.post('/generate-recipes', async (req, res) => {
  try {
    const { age_months, feeding_method, available_ingredients, custom_ingredients } = req.body;

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

module.exports = router;
