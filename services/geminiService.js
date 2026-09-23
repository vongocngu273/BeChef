const dotenv = require('dotenv');
dotenv.config();
const { capitalizeIngredient } = require('../utils/textFormatter');

let GoogleGenAI;
try {
  GoogleGenAI = require('@google/genai').GoogleGenAI;
} catch (e) {
  GoogleGenAI = null;
}

let GoogleGenerativeAI;
try {
  GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
} catch (e) {
  GoogleGenerativeAI = null;
}

const RECIPE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    safety_analysis: {
      type: 'OBJECT',
      properties: {
        overall_verdict: { type: 'STRING' },
        ingredient_evaluations: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              ingredient: { type: 'STRING' },
              status: { type: 'STRING' },
              badge_text: { type: 'STRING' },
              medical_note: { type: 'STRING' }
            },
            required: ['ingredient', 'status', 'badge_text', 'medical_note']
          }
        }
      },
      required: ['overall_verdict', 'ingredient_evaluations']
    },
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
  required: ['safety_analysis', 'recipes']
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
 * Evaluates pediatric safety for a single ingredient based on infant age
 */
function evaluateIngredientSafety(ingredient, ageMonths) {
  const lower = (ingredient || '').toLowerCase();
  const capitalized = capitalizeIngredient(ingredient);

  if (ageMonths < 12) {
    if (lower.includes('mật ong') || lower.includes('honey')) {
      return {
        ingredient: capitalized,
        status: 'UNSAFE',
        badge_text: 'Cấm dùng',
        medical_note: 'Mật ong chứa bào tử Clostridium botulinum có thể gây ngộ độc Botulism nguy hiểm tính mạng, liệt cơ hô hấp ở trẻ dưới 1 tuổi.'
      };
    }
    if (lower.includes('muối') || lower.includes('salt')) {
      return {
        ingredient: capitalized,
        status: 'UNSAFE',
        badge_text: 'Cấm dùng',
        medical_note: 'Thận của trẻ dưới 12 tháng chưa phát triển hoàn thiện; nêm muối gây quá tải thận nghiêm trọng và rối loạn điện giải.'
      };
    }
    if (lower.includes('nước mắm') || lower.includes('fish sauce')) {
      return {
        ingredient: capitalized,
        status: 'UNSAFE',
        badge_text: 'Cấm dùng',
        medical_note: 'Nước mắm có nồng độ muối và đạm cô đặc rất cao, gây tổn thương chức năng lọc cầu thận non nớt của trẻ dưới 1 tuổi.'
      };
    }
    if (lower.includes('đường') || lower.includes('sugar')) {
      return {
        ingredient: capitalized,
        status: 'UNSAFE',
        badge_text: 'Cấm dùng',
        medical_note: 'Đường làm hỏng men răng sữa sớm, gây rối loạn vị giác tự nhiên và tăng nguy cơ béo phì ở trẻ nhỏ.'
      };
    }
    if (
      lower.includes('bột ngọt') ||
      lower.includes('mì chính') ||
      lower.includes('msg') ||
      lower.includes('hạt nêm') ||
      lower.includes('monosodium glutamate')
    ) {
      return {
        ingredient: capitalized,
        status: 'UNSAFE',
        badge_text: 'Cấm dùng',
        medical_note: 'Chất điều vị và glutamate công nghiệp không phù hợp với hệ thần kinh và chức năng chuyển hóa của bé dưới 1 tuổi.'
      };
    }
  }

  // Safe evaluations based on common ingredients
  if (lower.includes('bí đỏ') || lower.includes('pumpkin')) {
    return {
      ingredient: capitalized,
      status: 'SAFE',
      badge_text: 'Phù hợp',
      medical_note: 'Giàu beta-carotene (tiền vitamin A) và chất xơ hòa tan, hỗ trợ thị lực và nhuận tràng cho bé.'
    };
  }
  if (lower.includes('gà') || lower.includes('chicken')) {
    return {
      ingredient: capitalized,
      status: 'SAFE',
      badge_text: 'Phù hợp',
      medical_note: 'Nguồn đạm nạc mềm, giàu kẽm sinh học và sắt dễ hấp thu, hỗ trợ hệ miễn dịch và phát triển chiều cao.'
    };
  }
  if (lower.includes('bò') || lower.includes('beef')) {
    return {
      ingredient: capitalized,
      status: 'SAFE',
      badge_text: 'Phù hợp',
      medical_note: 'Cung cấp sắt heme dồi dào giúp phòng ngừa thiếu máu thiếu sắt, cùng vitamin B12 hỗ trợ tạo máu.'
    };
  }
  if (lower.includes('cá hồi') || lower.includes('salmon')) {
    return {
      ingredient: capitalized,
      status: 'SAFE',
      badge_text: 'Phù hợp',
      medical_note: 'Nguồn omega-3 (DHA & EPA) tuyệt vời giúp hoàn thiện võng mạc và phát triển tế bào thần kinh não bộ.'
    };
  }
  if (lower.includes('khoai lang') || lower.includes('sweet potato')) {
    return {
      ingredient: capitalized,
      status: 'SAFE',
      badge_text: 'Phù hợp',
      medical_note: 'Giàu năng lượng từ carbohydrate phức hợp, vị ngọt tự nhiên dễ ăn và chất xơ phòng táo bón hiệu quả.'
    };
  }
  if (lower.includes('cà rốt') || lower.includes('carrot')) {
    return {
      ingredient: capitalized,
      status: 'SAFE',
      badge_text: 'Phù hợp',
      medical_note: 'Rất giàu vitamin A tự nhiên và chất chống oxy hóa, hỗ trợ niêm mạc ruột và mắt của bé sáng khỏe.'
    };
  }
  if (lower.includes('dầu')) {
    return {
      ingredient: capitalized,
      status: 'SAFE',
      badge_text: 'Phù hợp',
      medical_note: 'Bổ sung lipid thiết yếu giúp hấp thu các vitamin tan trong dầu (A, D, E, K) và phát triển não bộ.'
    };
  }

  // Age 12m+ special handling for mild seasonings / honey
  if (ageMonths >= 12) {
    if (lower.includes('mật ong') || lower.includes('honey')) {
      return {
        ingredient: capitalized,
        status: 'SAFE',
        badge_text: 'Phù hợp',
        medical_note: 'Hệ tiêu hóa của trẻ từ 12 tháng tuổi đã hoàn thiện để kháng khuẩn Botulism, có thể dùng mật ong với lượng vừa phải.'
      };
    }
    if (
      lower.includes('muối') ||
      lower.includes('đường') ||
      lower.includes('nước mắm') ||
      lower.includes('hạt nêm')
    ) {
      return {
        ingredient: capitalized,
        status: 'CAUTION',
        badge_text: 'Cần lưu ý',
        medical_note: 'Trẻ trên 1 tuổi có thể dùng một lượng rất nhỏ gia vị, nhưng vẫn nên hạn chế để bảo vệ thận và vị giác nguyên bản.'
      };
    }
  }

  // General safe fallback
  return {
    ingredient: capitalized,
    status: 'SAFE',
    badge_text: 'Phù hợp',
    medical_note: `Nguyên liệu an toàn, giàu vi chất tự nhiên phù hợp với hệ tiêu hóa và nhu cầu phát triển của bé ${ageMonths} tháng.`
  };
}

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
  const rawList = [...(availableIngredients || []), ...(customIngredients || [])];
  const combinedIngredients = rawList.map(capitalizeIngredient).filter(Boolean);

  const evalList = combinedIngredients.length > 0 ? combinedIngredients : ['Bí đỏ', 'Thịt gà'];
  const ingredientEvaluations = evalList.map(ing => evaluateIngredientSafety(ing, ageMonths));

  const hasUnsafe = ingredientEvaluations.some(e => e.status === 'UNSAFE');
  const hasCaution = ingredientEvaluations.some(e => e.status === 'CAUTION');

  let overallVerdict = `Tất cả nguyên liệu đều tuyệt đối an toàn và phù hợp cho hệ tiêu hóa của bé ${ageMonths} tháng tuổi.`;
  if (hasUnsafe) {
    overallVerdict = `Cảnh báo an toàn nhi khoa: Phát hiện nguyên liệu nguy hại đối với trẻ ${ageMonths} tháng tuổi. Hệ thống đã tự động loại bỏ các nguyên liệu này khỏi công thức nấu để đảm bảo an toàn tuyệt đối cho bé.`;
  } else if (hasCaution) {
    overallVerdict = `Các nguyên liệu nhìn chung phù hợp, tuy nhiên cần lưu ý liều lượng đối với các thành phần nhạy cảm cho bé ${ageMonths} tháng tuổi.`;
  }

  const safetyAnalysis = {
    overall_verdict: overallVerdict,
    ingredient_evaluations: ingredientEvaluations
  };

  // Filter out unsafe ingredients from base recipe construction
  const safeIngredients = combinedIngredients.filter(ing => {
    if (ageMonths < 12) {
      const lower = ing.toLowerCase();
      return !PROHIBITED_UNDER_12M.some(banned => lower.includes(banned));
    }
    return true;
  });

  const primaryIngr = safeIngredients[0] || 'Bí đỏ';
  const secondaryIngr =
    safeIngredients.find((ing, idx) => idx > 0 && !ing.toLowerCase().includes('dầu')) || 'Thịt gà';
  const oil = safeIngredients.find(i => i.toLowerCase().includes('dầu')) || 'Dầu óc chó';

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

  return {
    safety_analysis: safetyAnalysis,
    recipes: baseRecipes
  };
}

/**
 * Calls Google Gemini API using gemini-3.8-flash with strict schema & guardrails
 */
async function generateBabyRecipes({ age_months, feeding_method, available_ingredients, custom_ingredients }) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Normalize & capitalize input ingredients
  const cleanAvailable = (available_ingredients || []).map(capitalizeIngredient).filter(Boolean);
  const cleanCustom = (custom_ingredients || []).map(capitalizeIngredient).filter(Boolean);

  const systemInstruction = `You are a certified pediatric nutritionist and baby food chef specializing in infant feeding from 6 to 24 months.
Generate an in-depth pediatric safety analysis (safety_analysis) and exactly 3 healthy, balanced baby food recipes matching the user's inputs.

PEDIATRIC SAFETY EVALUATION REQUIREMENTS:
1. You MUST evaluate every single provided ingredient (from both available_ingredients and custom_ingredients) for pediatric suitability for a baby at age ${age_months} months.
2. For each ingredient:
   - ingredient: Ingredient name (capitalized, in Vietnamese).
   - status: "SAFE" | "CAUTION" | "UNSAFE"
   - badge_text: Short Vietnamese badge (e.g., "Phù hợp", "Cần lưu ý", "Cấm dùng").
   - medical_note: Concise pediatric explanation of digestive suitability, nutritional benefits, or medical dangers.
3. For infant age < 12 months:
   - Any salt, honey, sugar, fish sauce, MSG (bột ngọt/mì chính), hạt nêm MUST be evaluated with status "UNSAFE" and badge_text "Cấm dùng".
   - Explain the medical risk clearly (e.g., honey causes fatal Infant Botulism; salt/fish sauce/seasonings cause renal overload and kidney damage; sugar causes dental decay and taste disturbance).
   - EXCLUDE these unsafe ingredients from all generated recipes! Never use or suggest them in dishes, ingredients, or cooking steps.
4. overall_verdict: Provide a comprehensive medical summary in Vietnamese regarding the safety and suitability of the ingredients for the baby's age.

STRICT PEDIATRIC RECIPE GUARDRAILS:
1. Infant age < 12 months: STRICTLY ZERO honey, salt, sugar, fish sauce, monosodium glutamate (MSG), hạt nêm, nước mắm. Do not recommend or include any added salt, sugar, or honey in the recipes.
2. Choking hazards: STRICTLY PROHIBIT whole nuts, whole round fruits (e.g. uncut cherry tomatoes, uncut grapes). All foods must be appropriately prepared to eliminate choking risks.
3. Texture standards strictly calibrated to age:
   - 6-7 months: 1:10 smooth puree, finely strained, completely lump-free.
   - 7-8 months: 1:7 soft mash, soft small lumps easily squashed with gums.
   - 9-11 months: 1:5 finely chopped / small dice for pincer grasp training.
   - 12-24 months: soft table food, diced bite-sized portions.
4. Language: Recipe names, ingredient names, steps, texture descriptions, pediatrician tips, and safety evaluations MUST be in Vietnamese.
5. Missing ingredients: Only list essential complementary items (e.g., gạo, dầu ăn dặm, dashi) that the parent might need to buy.`;

  const userPrompt = `Hãy tạo đánh giá an toàn dinh dưỡng và 3 món ăn dặm phù hợp với thông tin sau:
- Độ tuổi: ${age_months} tháng tuổi
- Phương pháp ăn dặm: ${feeding_method}
- Nguyên liệu sẵn có: ${cleanAvailable.join(', ') || 'Chưa chọn'}
- Nguyên liệu tùy chọn khác: ${cleanCustom.join(', ') || 'Không có'}

Tuân thủ nghiêm ngặt quy tắc an toàn nhi khoa và định dạng JSON theo đúng schema.`;

  // If no API key or dummy key is provided, use pediatric-safe fallback generator
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.startsWith('mock_')) {
    const fallback = generateFallbackRecipes(age_months, feeding_method, cleanAvailable, cleanCustom);
    validatePediatricSafety(fallback.recipes, age_months);
    return fallback;
  }

  try {
    let responseText = null;

    // First attempt using @google/genai SDK
    if (GoogleGenAI) {
      try {
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
        // Fall back to @google/generative-ai
      }
    }

    if (!responseText && GoogleGenerativeAI) {
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
    if (
      !parsed ||
      !parsed.safety_analysis ||
      !Array.isArray(parsed.recipes) ||
      parsed.recipes.length === 0
    ) {
      throw new Error('Invalid JSON structure returned by Gemini model');
    }

    validatePediatricSafety(parsed.recipes, age_months);
    return parsed;
  } catch (error) {
    console.warn('[BeChef Gemini Service Warning]:', error.message || error);
    console.warn('Activating pediatric safety fallback generator to maintain uninterrupted service.');
    const fallback = generateFallbackRecipes(age_months, feeding_method, cleanAvailable, cleanCustom);
    validatePediatricSafety(fallback.recipes, age_months);
    return fallback;
  }
}

module.exports = {
  generateBabyRecipes,
  validatePediatricSafety,
  generateFallbackRecipes,
  evaluateIngredientSafety,
  RECIPE_SCHEMA,
  PROHIBITED_UNDER_12M
};
