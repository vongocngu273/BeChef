import { api, generateRecipes } from '../client/src/api/recipeApi';

describe('Client API Module: recipeApi.js', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('generateRecipes calls POST /api/generate-recipes and returns data', async () => {
    const fakeData = { recipes: [{ dish_name: 'Cháo gà' }] };
    const spy = jest.spyOn(api, 'post').mockResolvedValueOnce({ data: fakeData });

    const res = await generateRecipes({
      age_months: 8,
      feeding_method: 'Truyền thống',
      available_ingredients: ['Thịt gà'],
      custom_ingredients: []
    });

    expect(spy).toHaveBeenCalledWith('/api/generate-recipes', {
      age_months: 8,
      feeding_method: 'Truyền thống',
      available_ingredients: ['Thịt gà'],
      custom_ingredients: []
    });
    expect(res).toEqual(fakeData);
  });

  test('generateRecipes handles server error with message', async () => {
    jest.spyOn(api, 'post').mockRejectedValueOnce({
      response: {
        data: { error: 'Độ tuổi bé phải nằm trong khoảng từ 6 đến 24 tháng.' }
      }
    });

    await expect(
      generateRecipes({ age_months: 5, feeding_method: 'Truyền thống' })
    ).rejects.toThrow('Độ tuổi bé phải nằm trong khoảng từ 6 đến 24 tháng.');
  });

  test('generateRecipes handles timeout error', async () => {
    jest.spyOn(api, 'post').mockRejectedValueOnce({
      code: 'ECONNABORTED',
      message: 'timeout of 30000ms exceeded'
    });

    await expect(
      generateRecipes({ age_months: 7, feeding_method: 'Truyền thống' })
    ).rejects.toThrow(/timeout/i);
  });
});
