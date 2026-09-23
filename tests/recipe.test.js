const request = require('supertest');
const app = require('../server');
const geminiService = require('../services/geminiService');

describe('Backend API: POST /api/generate-recipes', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('Payload Boundary Validations', () => {
    test('should reject request when age_months is missing (400)', async () => {
      const res = await request(app)
        .post('/api/generate-recipes')
        .send({
          feeding_method: 'Truyền thống',
          available_ingredients: ['Bí đỏ']
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/age_months/i);
    });

    test('should reject request when age_months < 6 (400)', async () => {
      const res = await request(app)
        .post('/api/generate-recipes')
        .send({
          age_months: 5,
          feeding_method: 'Truyền thống',
          available_ingredients: ['Bí đỏ']
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('6 đến 24 tháng');
    });

    test('should reject request when age_months > 24 (400)', async () => {
      const res = await request(app)
        .post('/api/generate-recipes')
        .send({
          age_months: 25,
          feeding_method: 'BLW',
          available_ingredients: ['Thịt bò']
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('6 đến 24 tháng');
    });

    test('should reject request when feeding_method is empty (400)', async () => {
      const res = await request(app)
        .post('/api/generate-recipes')
        .send({
          age_months: 8,
          feeding_method: '',
          available_ingredients: ['Thịt gà']
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/feeding_method/i);
    });

    test('should reject request when available_ingredients is not an array (400)', async () => {
      const res = await request(app)
        .post('/api/generate-recipes')
        .send({
          age_months: 8,
          feeding_method: 'Kiểu Nhật',
          available_ingredients: 'Bí đỏ'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('mảng');
    });
  });

  describe('Schema Integrity & Mock Gemini Response', () => {
    test('should return 3 valid recipes matching the strict schema', async () => {
      const mockRecipes = {
        recipes: [
          {
            dish_name: 'Cháo gà bí đỏ mềm mịn',
            suitable_age_range: '7 tháng',
            feeding_method: 'Truyền thống',
            texture_description: 'Độ thô 1:7 mịn nhuyễn có lợn cợn nhỏ',
            yield_portion: '1 chén 120ml',
            prep_time_minutes: 10,
            cook_time_minutes: 20,
            difficulty: 'Dễ',
            available_ingredients_used: [
              { name: 'Thịt gà', amount: '30g' },
              { name: 'Bí đỏ', amount: '30g' }
            ],
            missing_ingredients_needed: [
              { name: 'Gạo tẻ', amount: '30g' },
              { name: 'Dầu óc chó', amount: '5ml' }
            ],
            cooking_steps: [
              'Bước 1: Nấu cháo nhừ theo tỷ lệ 1:7.',
              'Bước 2: Thịt gà băm nhỏ, hấp chín mềm.',
              'Bước 3: Bí đỏ nghiền nhuyễn rồi trộn đều vào cháo.',
              'Bước 4: Tắt bếp, thêm 5ml dầu ăn dặm khi còn ấm.'
            ],
            pediatrician_tip: 'Tuyệt đối không nêm mắm muối hoặc mật ong cho trẻ dưới 1 tuổi.'
          },
          {
            dish_name: 'Súp bí đỏ dashi ấm bụng',
            suitable_age_range: '7 tháng',
            feeding_method: 'Kiểu Nhật',
            texture_description: 'Súp sánh mịn',
            yield_portion: '1 chén nhỏ',
            prep_time_minutes: 5,
            cook_time_minutes: 15,
            difficulty: 'Dễ',
            available_ingredients_used: [{ name: 'Bí đỏ', amount: '40g' }],
            missing_ingredients_needed: [{ name: 'Nước dashi', amount: '80ml' }],
            cooking_steps: [
              'Bước 1: Hấp chín bí đỏ.',
              'Bước 2: Nghiền mịn và nấu cùng nước dashi 3 phút.'
            ],
            pediatrician_tip: 'Nếm thử độ ấm trên mu bàn tay trước khi cho bé ăn.'
          },
          {
            dish_name: 'Thịt gà hấp rau củ thanh nhẹ',
            suitable_age_range: '7 tháng',
            feeding_method: 'BLW',
            texture_description: 'Thanh mềm dễ cầm nắm',
            yield_portion: '3 thanh',
            prep_time_minutes: 10,
            cook_time_minutes: 15,
            difficulty: 'Trung bình',
            available_ingredients_used: [{ name: 'Thịt gà', amount: '50g' }],
            missing_ingredients_needed: [],
            cooking_steps: [
              'Bước 1: Tạo hình thịt gà dạng thanh ngón tay.',
              'Bước 2: Hấp chín mềm ẩm.'
            ],
            pediatrician_tip: 'Cắt thanh dài bằng ngón tay trỏ để bé dễ cầm không bị trơn tuột.'
          }
        ]
      };

      jest.spyOn(geminiService, 'generateBabyRecipes').mockResolvedValueOnce(mockRecipes);

      const res = await request(app)
        .post('/api/generate-recipes')
        .send({
          age_months: 7,
          feeding_method: 'Truyền thống',
          available_ingredients: ['Thịt gà', 'Bí đỏ']
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('recipes');
      expect(res.body.recipes).toHaveLength(3);

      const r = res.body.recipes[0];
      expect(r).toHaveProperty('dish_name');
      expect(r).toHaveProperty('suitable_age_range');
      expect(r).toHaveProperty('texture_description');
      expect(r).toHaveProperty('yield_portion');
      expect(r).toHaveProperty('prep_time_minutes');
      expect(r).toHaveProperty('cook_time_minutes');
      expect(r).toHaveProperty('difficulty');
      expect(r).toHaveProperty('available_ingredients_used');
      expect(r).toHaveProperty('missing_ingredients_needed');
      expect(r).toHaveProperty('cooking_steps');
      expect(r).toHaveProperty('pediatrician_tip');
    });
  });

  describe('Pediatric Safety Rules Verification', () => {
    test('should trigger safety violation if salt is added for infant under 12 months', () => {
      const unsafeRecipes = [
        {
          dish_name: 'Cháo thịt bò',
          suitable_age_range: '8 tháng',
          feeding_method: 'Truyền thống',
          texture_description: 'Nghiền mịn',
          yield_portion: '1 bát',
          prep_time_minutes: 10,
          cook_time_minutes: 20,
          difficulty: 'Dễ',
          available_ingredients_used: [{ name: 'Thịt bò', amount: '30g' }],
          missing_ingredients_needed: [{ name: 'Muối tinh', amount: '1g' }],
          cooking_steps: ['Nấu chín cháo'],
          pediatrician_tip: 'Nên cho ăn ấm'
        }
      ];

      expect(() => {
        geminiService.validatePediatricSafety(unsafeRecipes, 8);
      }).toThrow(/Pediatric Safety Violation.*muối/i);
    });

    test('should trigger safety violation if honey is added for infant under 12 months', () => {
      const unsafeRecipes = [
        {
          dish_name: 'Súp khoai lang',
          suitable_age_range: '9 tháng',
          feeding_method: 'Truyền thống',
          texture_description: 'Mịn',
          yield_portion: '1 bát',
          prep_time_minutes: 10,
          cook_time_minutes: 15,
          difficulty: 'Dễ',
          available_ingredients_used: [{ name: 'Khoai lang', amount: '50g' }],
          missing_ingredients_needed: [],
          cooking_steps: ['Hấp khoai', 'Thêm một thìa mật ong cho thơm'],
          pediatrician_tip: 'Cho bé ăn lúc còn ấm'
        }
      ];

      expect(() => {
        geminiService.validatePediatricSafety(unsafeRecipes, 9);
      }).toThrow(/Pediatric Safety Violation.*mật ong/i);
    });

    test('should trigger safety violation if fish sauce / msg is present for age < 12m', () => {
      const unsafeRecipes = [
        {
          dish_name: 'Cháo cá hồi',
          suitable_age_range: '10 tháng',
          feeding_method: 'Truyền thống',
          texture_description: 'Nghiền nhuyễn',
          yield_portion: '1 bát',
          prep_time_minutes: 10,
          cook_time_minutes: 20,
          difficulty: 'Dễ',
          available_ingredients_used: [{ name: 'Cá hồi', amount: '30g' }],
          missing_ingredients_needed: [{ name: 'Nước mắm trẻ em', amount: '2ml' }],
          cooking_steps: ['Nấu chín cháo'],
          pediatrician_tip: 'Thơm ngon'
        }
      ];

      expect(() => {
        geminiService.validatePediatricSafety(unsafeRecipes, 10);
      }).toThrow(/Pediatric Safety Violation.*nước mắm/i);
    });

    test('should pass safety verification when recipe contains ZERO salt/honey/sugar for age < 12m', () => {
      const safeRecipes = [
        {
          dish_name: 'Cháo cá hồi bí đỏ',
          suitable_age_range: '8 tháng',
          feeding_method: 'Truyền thống',
          texture_description: 'Độ thô 1:7 lợn cợn nhẹ',
          yield_portion: '1 bát nhỏ',
          prep_time_minutes: 10,
          cook_time_minutes: 20,
          difficulty: 'Dễ',
          available_ingredients_used: [
            { name: 'Cá hồi', amount: '30g' },
            { name: 'Bí đỏ', amount: '30g' }
          ],
          missing_ingredients_needed: [
            { name: 'Dầu cá hồi', amount: '5ml' }
          ],
          cooking_steps: ['Hấp chín cá hồi', 'Nấu nhừ bí đỏ cùng cháo'],
          pediatrician_tip: 'Không nêm gia vị cho trẻ dưới 1 tuổi.'
        }
      ];

      expect(() => {
        geminiService.validatePediatricSafety(safeRecipes, 8);
      }).not.toThrow();
    });
  });

  describe('Fallback Generator Reliability', () => {
    test('generateFallbackRecipes should return 3 safe recipes for age 6 months', () => {
      const result = geminiService.generateFallbackRecipes(6, 'Truyền thống', ['Bí đỏ', 'Thịt gà'], []);
      expect(result.recipes).toHaveLength(3);
      expect(result.recipes[0].texture_description).toContain('1:10');
      expect(() => geminiService.validatePediatricSafety(result.recipes, 6)).not.toThrow();
    });

    test('generateFallbackRecipes should return 3 safe recipes for age 18 months', () => {
      const result = geminiService.generateFallbackRecipes(18, 'BLW', ['Thịt bò'], []);
      expect(result.recipes).toHaveLength(3);
      expect(result.recipes[0].texture_description).toContain('Cơm nát');
    });
  });
});
