import axios from 'axios';

export const api = axios.create({
  baseURL: '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Generate 3 baby food recipes based on age, feeding method, and ingredients
 * @param {Object} payload
 * @param {number} payload.age_months
 * @param {string} payload.feeding_method
 * @param {string[]} payload.available_ingredients
 * @param {string[]} payload.custom_ingredients
 */
export async function generateRecipes(payload) {
  try {
    const response = await api.post('/api/generate-recipes', payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Hệ thống xử lý quá thời gian chờ (timeout). Vui lòng thử lại sau giây lát.');
    }
    throw new Error(error.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
  }
}

/**
 * Regenerate a single baby food recipe
 * @param {Object} payload
 * @param {number} payload.age_months
 * @param {string} payload.feeding_method
 * @param {string} [payload.meal_type]
 * @param {string} payload.current_dish_name
 * @param {string[]} payload.available_ingredients
 * @param {string[]} payload.custom_ingredients
 */
export async function regenerateSingleRecipe(payload) {
  try {
    const response = await api.post('/api/regenerate-single-recipe', payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Hệ thống xử lý quá thời gian chờ (timeout). Vui lòng thử lại sau giây lát.');
    }
    throw new Error(error.message || 'Không thể đổi món ăn dặm. Vui lòng kiểm tra kết nối mạng.');
  }
}

