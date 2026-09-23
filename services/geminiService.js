const dotenv = require('dotenv');
dotenv.config();

const RECIPE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    recipes: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          dish_name: { type: 'STRING' },
          suitable_age_range: { type: 'STRING' },
          feeding_method: { type: 'STRING' },
          texture_description: { type: 'STRING' },
          yield_portion: { type: 'STRING' },
          prep_time_minutes: { type: 'INTEGER' },
          cook_time_minutes: { type: 'INTEGER' },
          difficulty: { type: 'STRING' },
          available_ingredients_used: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING' },
                amount: { type: 'STRING' }
              },
              required: ['name', 'amount']
            }
          },
          missing_ingredients_needed: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING' },
                amount: { type: 'STRING' }
              },
              required: ['name', 'amount']
            }
          },
          cooking_steps: {
            type: 'ARRAY',
            items: { type: 'STRING' }
          },
          pediatrician_tip: { type: 'STRING' }
        },
        required: [
          'dish_name',
          'suitable_age_range',
          'texture_description',
          'yield_portion',
          'prep_time_minutes',
          'cook_time_minutes',
          'difficulty',
          'available_ingredients_used',
          'missing_ingredients_needed',
          'cooking_steps',
          'pediatrician_tip'
        ]
      }
    }
  },
  required: ['recipes']
};

const PROHIBITED_UNDER_12M = [
  'muối',
  'salt',
  'mật ong',
  'honey',
  'đường',
  'sugar',
  'nước mắm',
  'fish sauce',
  'bột ngọt',
  'mì chính',
  'monosodium glutamate',
  'msg',
  'hạt nêm'
];

/**
 * Validates pediatric safety on generated recipes
 */
function validatePediatricSafety(recipes, ageMonths) {
  if (ageMonths < 12) {
    for (const recipe of recipes) {
      const allIngredients = [
        ...(recipe.available_ingredients_used || []),
        ...(recipe.missing_ingredients_needed || [])
      ].map(i => (i.name || '').toLowerCase());

      const stepsText = (recipe.cooking_steps || []).join(' ').toLowerCase();

      for (const banned of PROHIBITED_UNDER_12M) {
        const foundInIngr = allIngredients.some(name => name.includes(banned));
        const foundInSteps = stepsText.includes(banned);
        if (foundInIngr || foundInSteps) {
          throw new Error(
            `Pediatric Safety Violation: Prohibited ingredient/seasoning "${banned}" detected for infant age ${ageMonths} months.`
          );
        }
      }
    }
  }
}

/**
 * Fallback generator for tests or offline sandbox environments
 */
function generateFallbackRecipes(ageMonths, feedingMethod, availableIngredients, customIngredients) {
  const combinedIngredients = [...(availableIngredients || []), ...(customIngredients || [])];
  const primaryIngr = combinedIngredients[0] || 'Bí đỏ';
  const secondaryIngr = combinedIngredients[1] || 'Thịt gà';
  const oil = combinedIngredients.find(i => i.toLowerCase().includes('dầu')) || 'Dầu óc chó';

  let texture = '';
  let ageRange = `${ageMonths} tháng`;
  if (ageMonths <= 7) {
    texture = 'Độ thô 1:10, mịn nhuyễn, rây kỹ, không lợn cợn';
  } else if (ageMonths <= 8) {
    texture = 'Độ thô 1:7, cháo vỡ hạt, thức ăn nghiền mềm có lợn cợn nhẹ';
  } else if (ageMonths <= 11) {
    texture = 'Độ thô 1:5, băm nhỏ/thái hạt lựu mềm, tập bốc nhón';
  } else {
    texture = 'Cơm nát/thức ăn gia đình cắt nhỏ mềm vừa miệng bé';
  }

  const baseRecipes = [
    {
      dish_name: `Cháo ${secondaryIngr} nấu ${primaryIngr}`,
      suitable_age_range: ageRange,
      feeding_method: feedingMethod,
      texture_description: texture,
      yield_portion: '1 bát nhỏ (khoảng 120-150ml)',
      prep_time_minutes: 10,
      cook_time_minutes: 20,
      difficulty: 'Dễ',
      available_ingredients_used: [
        { name: primaryIngr, amount: '30g' },
        { name: secondaryIngr, amount: '30g' }
      ],
      missing_ingredients_needed: [
        { name: 'Gạo tẻ thơm', amount: '30g' },
        { name: oil, amount: '5ml' }
      ],
      cooking_steps: [
        `Bước 1: Vo sạch gạo, nấu cháo theo tỷ lệ phù hợp với độ tuổi ${ageMonths} tháng.`,
        `Bước 2: Sơ chế ${secondaryIngr} và ${primaryIngr} sạch sẽ, thái nhỏ hoặc xay nhuyễn tùy giai đoạn.`,
        `Bước 3: Nấu chín nhừ ${secondaryIngr} và ${primaryIngr}, trộn cùng cháo và khuấy đều trên lửa nhỏ 3 phút.`,
        `Bước 4: Tắt bếp, để nguội khoảng 40-45 độ C rồi thêm 1 thìa cà phê ${oil} trước khi cho bé dùng.`
      ],
      pediatrician_tip: ageMonths < 12
        ? 'Tuyệt đối KHÔNG nêm muối, mắm, đường, hạt nêm hoặc mật ong cho trẻ dưới 1 tuổi để bảo vệ thận non nớt.'
        : 'Hạn chế gia vị công nghiệp, ưu tiên vị ngọt tự nhiên từ rau củ và thịt cá tươi.'
    },
    {
      dish_name: `Súp ${primaryIngr} bổ dưỡng`,
      suitable_age_range: ageRange,
      feeding_method: feedingMethod,
      texture_description: texture,
      yield_portion: '1 phần ăn dặm (120ml)',
      prep_time_minutes: 10,
      cook_time_minutes: 15,
      difficulty: 'Dễ',
      available_ingredients_used: [
        { name: primaryIngr, amount: '40g' }
      ],
      missing_ingredients_needed: [
        { name: 'Nước dùng dashi rau củ', amount: '100ml' },
        { name: oil, amount: '5ml' }
      ],
      cooking_steps: [
        `Bước 1: ${primaryIngr} gọt vỏ, hấp chín mềm.`,
        `Bước 2: Dùng nĩa nghiền hoặc rây mịn qua lưới tùy độ thô cho bé ${ageMonths} tháng.`,
        `Bước 3: Hòa cùng nước dashi rau củ ấm, đun sôi lăn tăn 2 phút.`,
        `Bước 4: Thêm dầu ăn dặm khuấy đều khi súp còn ấm.`
      ],
      pediatrician_tip: 'Nên kiểm tra nhiệt độ thức ăn trên cổ tay trước khi đút cho bé để tránh bỏng nhiệt.'
    },
    {
      dish_name: `${secondaryIngr} hấp mềm sốt ${primaryIngr}`,
      suitable_age_range: ageRange,
      feeding_method: feedingMethod,
      texture_description: texture,
      yield_portion: '1 phần ăn (100g)',
      prep_time_minutes: 15,
      cook_time_minutes: 15,
      difficulty: 'Trung bình',
      available_ingredients_used: [
        { name: secondaryIngr, amount: '40g' },
        { name: primaryIngr, amount: '30g' }
      ],
      missing_ingredients_needed: [
        { name: 'Hành tây (tạo ngọt tự nhiên)', amount: '10g' }
      ],
      cooking_steps: [
        `Bước 1: ${secondaryIngr} băm nhỏ (hoặc cắt thanh vừa tay nếu ăn BLW), hấp chín tới.`,
        `Bước 2: Hấp chín ${primaryIngr} cùng một lát hành tây nhỏ, xay nhuyễn làm sốt sánh mịn.`,
        `Bước 3: Rưới sốt lên ${secondaryIngr} đã hấp chín mềm.`,
        `Bước 4: Hướng dẫn bé tự bốc nhón hoặc xúc thìa vui vẻ.`
      ],
      pediatrician_tip: 'Tránh các loại hạt nguyên hạt hoặc cà chua bi nguyên quả chưa cắt nhỏ vì có nguy cơ gây hóc dị vật đường thở.'
    }
  ];

  return { recipes: baseRecipes };
}

/**
 * Calls Google Gemini API using gemini-3.8-flash with strict schema & guardrails
 */
async function generateBabyRecipes({ age_months, feeding_method, available_ingredients, custom_ingredients }) {
  const apiKey = process.env.GEMINI_API_KEY;

  const systemInstruction = `You are a certified pediatric nutritionist and baby food chef specializing in infant feeding from 6 to 24 months.
Generate exactly 3 healthy, balanced baby food recipes matching the user's inputs.

STRICT PEDIATRIC GUARDRAILS:
1. Infant age < 12 months: STRICTLY ZERO honey, salt, sugar, fish sauce, monosodium glutamate (MSG), hạt nêm, nước mắm. Do not recommend or include any added salt, sugar, or honey.
2. Choking hazards: STRICTLY PROHIBIT whole nuts, whole round fruits (e.g. uncut cherry tomatoes, uncut grapes). All foods must be appropriately prepared to eliminate choking risks.
3. Texture standards strictly calibrated to age:
   - 6-7 months: 1:10 smooth puree, finely strained, completely lump-free.
   - 7-8 months: 1:7 soft mash, soft small lumps easily squashed with gums.
   - 9-11 months: 1:5 finely chopped / small dice for pincer grasp training.
   - 12-24 months: soft table food, diced bite-sized portions.
4. Language: Recipe names, ingredient names, steps, texture descriptions, and tips MUST be in Vietnamese.
5. Missing ingredients: Only list essential complementary items (e.g., gạo, dầu ăn dặm, dashi) that the parent might need to buy.`;

  const userPrompt = `Hãy tạo 3 món ăn dặm phù hợp với thông tin sau:
- Độ tuổi: ${age_months} tháng tuổi
- Phương pháp ăn dặm: ${feeding_method}
- Nguyên liệu sẵn có: ${(available_ingredients || []).join(', ') || 'Chưa chọn'}
- Nguyên liệu tùy chọn khác: ${(custom_ingredients || []).join(', ') || 'Không có'}

Tuân thủ nghiêm ngặt quy tắc an toàn nhi khoa và định dạng JSON theo đúng schema.`;

  // If no API key or dummy key is provided, use pediatric-safe fallback generator
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.startsWith('mock_')) {
    const fallback = generateFallbackRecipes(age_months, feeding_method, available_ingredients, custom_ingredients);
    validatePediatricSafety(fallback.recipes, age_months);
    return fallback;
  }

  try {
    let responseText = null;

    // First attempt using @google/genai SDK
    try {
      const { GoogleGenAI } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: RECIPE_SCHEMA,
          temperature: 0.2
        }
      });
      responseText = response.text;
    } catch (sdkError) {
      // Fallback attempt using @google/generative-ai SDK
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.8-flash',
        systemInstruction,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: RECIPE_SCHEMA,
          temperature: 0.2
        }
      });
      const result = await model.generateContent(userPrompt);
      const res = await result.response;
      responseText = res.text();
    }

    if (!responseText) {
      throw new Error('Empty response received from Gemini API');
    }

    const parsed = JSON.parse(responseText);
    if (!parsed || !Array.isArray(parsed.recipes) || parsed.recipes.length === 0) {
      throw new Error('Invalid JSON structure returned by Gemini model');
    }

    validatePediatricSafety(parsed.recipes, age_months);
    return parsed;
  } catch (error) {
    console.warn('[BeChef Gemini Service Warning]:', error.message || error);
    console.warn('Activating pediatric safety fallback generator to maintain uninterrupted service.');
    const fallback = generateFallbackRecipes(age_months, feeding_method, available_ingredients, custom_ingredients);
    validatePediatricSafety(fallback.recipes, age_months);
    return fallback;
  }
}

module.exports = {
  generateBabyRecipes,
  validatePediatricSafety,
  generateFallbackRecipes,
  RECIPE_SCHEMA,
  PROHIBITED_UNDER_12M
};
