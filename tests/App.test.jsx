import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from '../client/src/App';
import * as recipeApi from '../client/src/api/recipeApi';

jest.mock(
  'html-to-image',
  () => ({
    toPng: jest.fn().mockResolvedValue('data:image/png;base64,mockPngData')
  }),
  { virtual: true }
);

const mockRecipesData = {
  recipes: [
    {
      dish_name: 'Cháo gà bí đỏ thơm ngon',
      suitable_age_range: '7 tháng',
      feeding_method: 'Truyền thống',
      texture_description: 'Độ thô 1:7 mịn nhuyễn có lợn cợn nhẹ',
      yield_portion: '1 chén 150ml',
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
        'Bước 1: Nấu cháo nhừ.',
        'Bước 2: Xay nhuyễn thịt gà và bí đỏ đã hấp chín.',
        'Bước 3: Trộn đều và đun sôi lại.'
      ],
      pediatrician_tip: 'Tuyệt đối không nêm mắm muối cho bé dưới 1 tuổi.'
    },
    {
      dish_name: 'Súp bí đỏ dashi ngọt lành',
      suitable_age_range: '7 tháng',
      feeding_method: 'Kiểu Nhật',
      texture_description: 'Súp sánh mịn vừa phải',
      yield_portion: '1 chén nhỏ 100ml',
      prep_time_minutes: 5,
      cook_time_minutes: 15,
      difficulty: 'Dễ',
      available_ingredients_used: [{ name: 'Bí đỏ', amount: '40g' }],
      missing_ingredients_needed: [{ name: 'Nước dashi', amount: '80ml' }],
      cooking_steps: ['Bước 1: Hấp bí đỏ.', 'Bước 2: Rây mịn và nấu cùng dashi.'],
      pediatrician_tip: 'Nhiệt độ thức ăn lý tưởng khoảng 37-40 độ C.'
    },
    {
      dish_name: 'Thanh gà hấp mềm BLW',
      suitable_age_range: '7 tháng',
      feeding_method: 'BLW',
      texture_description: 'Thanh mềm dễ cầm nắm',
      yield_portion: '3 thanh',
      prep_time_minutes: 15,
      cook_time_minutes: 15,
      difficulty: 'Trung bình',
      available_ingredients_used: [{ name: 'Thịt gà', amount: '50g' }],
      missing_ingredients_needed: [],
      cooking_steps: ['Bước 1: Nặn thịt dạng thanh dài.', 'Bước 2: Hấp chín tới.'],
      pediatrician_tip: 'Tránh các hạt cứng hoặc thực phẩm trơn tròn nguyên quả.'
    }
  ]
};

const mockRecipesWithSafety = {
  safety_analysis: {
    overall_verdict: 'Thực đơn phù hợp và an toàn cao cho bé 7 tháng tuổi, cân đối các nhóm chất.',
    ingredient_evaluations: [
      {
        ingredient: 'thịt gà',
        status: 'SAFE',
        badge_text: 'Phù hợp / An toàn',
        medical_note: 'Nguồn đạm lành tính, ít gây dị ứng, phù hợp cho bé bắt đầu ăn dặm.'
      },
      {
        ingredient: 'bí đỏ',
        status: 'SAFE',
        badge_text: 'Phù hợp / An toàn',
        medical_note: 'Giàu vitamin A và beta-carotene, dễ tiêu hoá.'
      },
      {
        ingredient: 'mật ong',
        status: 'UNSAFE',
        badge_text: 'Cấm dùng / Nguy hiểm',
        medical_note: 'Tuyệt đối cấm dùng cho trẻ dưới 1 tuổi vì nguy cơ ngộ độc Clostridium botulinum.'
      },
      {
        ingredient: 'hải sản có vỏ',
        status: 'CAUTION',
        badge_text: 'Cần lưu ý',
        medical_note: 'Nguy cơ dị ứng cao, cần thử dị ứng 3 ngày liên tiếp.'
      }
    ]
  },
  recipes: mockRecipesData.recipes
};

describe('Frontend UI: App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    window.speechSynthesis = {
      speak: jest.fn(),
      cancel: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn()
    };
    window.SpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
      text,
      lang: 'vi-VN'
    }));
  });

  test('renders form controls with Vietnamese UI labels, segmented tabs, and ingredient categories', () => {
    render(<App />);

    expect(screen.getAllByText(/BeChef/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Độ tuổi của bé \(tháng\):/i)).toBeInTheDocument();
    expect(screen.getByText(/Phương pháp ăn dặm:/i)).toBeInTheDocument();
    expect(screen.getByText(/Truyền thống/i)).toBeInTheDocument();
    expect(screen.getByText(/Kiểu Nhật/i)).toBeInTheDocument();
    expect(screen.getByText(/BLW/i)).toBeInTheDocument();
    expect(screen.getByText(/Bữa chính/i)).toBeInTheDocument();
    expect(screen.getByText(/Bữa phụ/i)).toBeInTheDocument();
    expect(screen.getByText(/Nguyên liệu mẹ sẵn có trong tủ lạnh:/i)).toBeInTheDocument();

    // Verify Tab bar categories are rendered
    expect(screen.getByText('Đạm')).toBeInTheDocument();
    expect(screen.getByText('Rau củ')).toBeInTheDocument();
    expect(screen.getByText('Trái cây & Tinh bột')).toBeInTheDocument();
    expect(screen.getByText('Dầu & Sữa')).toBeInTheDocument();

    expect(screen.getByText(/Gợi ý món ăn ngay/i)).toBeInTheDocument();
  });

  test('allows changing age, feeding method, and custom ingredients', () => {
    render(<App />);

    const ageInput = screen.getByLabelText(/Độ tuổi của bé/i);
    fireEvent.change(ageInput, { target: { value: '9' } });
    expect(ageInput.value).toBe('9');

    // Switch method to BLW pill toggle
    const blwButton = screen.getByText('BLW (Tự chỉ huy)');
    fireEvent.click(blwButton);

    // Add custom ingredient
    const customInput = screen.getByPlaceholderText(/Ví dụ: Khoai lang/i);
    const addButton = screen.getByRole('button', { name: /Thêm/i });

    fireEvent.change(customInput, { target: { value: 'Khoai tây' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Khoai tây')).toBeInTheDocument();
  });

  test('auto-capitalizes first letter of custom ingredients (e.g. "khoai lang" -> "Khoai lang")', () => {
    render(<App />);

    const customInput = screen.getByPlaceholderText(/Ví dụ: Khoai lang/i);
    const addButton = screen.getByRole('button', { name: /Thêm/i });

    fireEvent.change(customInput, { target: { value: 'khoai lang' } });
    fireEvent.click(addButton);

    // Assert capitalized chip is displayed and lowercase is not
    expect(screen.getByText('Khoai lang')).toBeInTheDocument();
    expect(screen.queryByText('khoai lang')).not.toBeInTheDocument();
  });

  test('Ingredient Categorized Tabs: shows counter badges, toggles active tab, and filters visible chips', () => {
    render(<App />);

    // Initially active tab is protein ('Đạm'). Default ingredients: Thịt gà (protein), Bí đỏ (veggie), Dầu óc chó (oil_milk)
    // Protein tab should show badge (1)
    const proteinTab = screen.getByRole('tab', { name: /Đạm/i });
    expect(proteinTab).toHaveTextContent('(1)');

    // Veggie tab should show badge (1)
    const veggieTab = screen.getByRole('tab', { name: /Rau củ/i });
    expect(veggieTab).toHaveTextContent('(1)');

    // In protein tab, "Thịt gà" chip is visible, but "Bí đỏ" chip is NOT in the chips list
    expect(screen.getByText(/Thịt gà/i)).toBeInTheDocument();
    expect(screen.queryByText(/Bí đỏ/i)).not.toBeInTheDocument();

    // Switch to Veggie tab
    fireEvent.click(veggieTab);

    // Now "Bí đỏ" is visible, "Thịt gà" is NOT visible
    expect(screen.getByText(/Bí đỏ/i)).toBeInTheDocument();
    expect(screen.queryByText(/Thịt gà/i)).not.toBeInTheDocument();

    // Select "Cà rốt" in veggie tab
    const carrotChip = screen.getByText(/Cà rốt/i);
    fireEvent.click(carrotChip);

    // Veggie counter badge should update to (2)
    expect(veggieTab).toHaveTextContent('(2)');
  });

  test('renders SafetyAnalysisBox with overall verdict, status badges, and pediatric medical notes', async () => {
    jest.spyOn(recipeApi, 'generateRecipes').mockResolvedValueOnce(mockRecipesWithSafety);

    render(<App />);

    const submitButton = screen.getByRole('button', { name: /Gợi ý món ăn ngay/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Báo cáo thẩm định an toàn dinh dưỡng')).toBeInTheDocument();
    });

    const safetyBox = screen.getByTestId('safety-analysis-box');

    // Check overall verdict
    expect(
      within(safetyBox).getByText(/Thực đơn phù hợp và an toàn cao cho bé 7 tháng tuổi/i)
    ).toBeInTheDocument();

    // Check capitalized ingredient names inside safetyBox
    expect(within(safetyBox).getByText('Thịt gà')).toBeInTheDocument();
    expect(within(safetyBox).getByText('Bí đỏ')).toBeInTheDocument();
    expect(within(safetyBox).getByText('Mật ong')).toBeInTheDocument();
    expect(within(safetyBox).getByText('Hải sản có vỏ')).toBeInTheDocument();

    // Check status badges inside safetyBox
    expect(within(safetyBox).getAllByText('Phù hợp / An toàn').length).toBe(2);
    expect(within(safetyBox).getByText('Cấm dùng / Nguy hiểm')).toBeInTheDocument();
    expect(within(safetyBox).getByText('Cần lưu ý')).toBeInTheDocument();

    // Check pediatric medical notes inside safetyBox
    expect(
      within(safetyBox).getByText(/Nguồn đạm lành tính, ít gây dị ứng/i)
    ).toBeInTheDocument();
    expect(
      within(safetyBox).getByText(/Tuyệt đối cấm dùng cho trẻ dưới 1 tuổi vì nguy cơ ngộ độc/i)
    ).toBeInTheDocument();
    expect(
      within(safetyBox).getByText(/Nguy cơ dị ứng cao, cần thử dị ứng 3 ngày liên tiếp/i)
    ).toBeInTheDocument();
  });

  test('submits form, shows loading state, renders 3 recipe flashcards and off-screen export posters', async () => {
    const generateSpy = jest
      .spyOn(recipeApi, 'generateRecipes')
      .mockResolvedValueOnce(mockRecipesData);

    render(<App />);

    const submitButton = screen.getByRole('button', { name: /Gợi ý món ăn ngay/i });
    fireEvent.click(submitButton);

    // Assert API called
    expect(generateSpy).toHaveBeenCalledTimes(1);

    // Assert recipes rendered in cards
    await waitFor(() => {
      expect(screen.getAllByText('Cháo gà bí đỏ thơm ngon').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Súp bí đỏ dashi ngọt lành').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Thanh gà hấp mềm BLW').length).toBeGreaterThan(0);
    });

    // Assert 2-column ingredients split
    expect(screen.getAllByText('Nguyên liệu sẵn có').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cần mua thêm').length).toBeGreaterThan(0);

    // Assert pediatrician tip
    expect(
      screen.getAllByText(/Tuyệt đối không nêm mắm muối cho bé dưới 1 tuổi/i).length
    ).toBeGreaterThan(0);

    // Assert 3 pristine keepsake posters exist off-screen without interactive buttons
    const posters = screen.getAllByTestId('recipe-export-poster');
    expect(posters.length).toBe(3);
    posters.forEach((poster) => {
      expect(within(poster).queryByRole('button')).not.toBeInTheDocument();
      expect(within(poster).getByText(/Thực đơn dinh dưỡng BeChef - Chuẩn Y Khoa Nhi/i)).toBeInTheDocument();
      expect(within(poster).getByText(/Ngự Võ/i)).toBeInTheDocument();
    });
  });

  test('copies shopping list to clipboard when clicking "Sao chép danh sách đi chợ"', async () => {
    jest.spyOn(recipeApi, 'generateRecipes').mockResolvedValueOnce(mockRecipesData);

    render(<App />);

    const submitButton = screen.getByRole('button', { name: /Gợi ý món ăn ngay/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('Cháo gà bí đỏ thơm ngon').length).toBeGreaterThan(0);
    });

    const copyButtons = screen.getAllByLabelText('Sao chép danh sách đi chợ');
    expect(copyButtons.length).toBe(3);

    fireEvent.click(copyButtons[0]);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('Danh sách đi chợ cho món "Cháo gà bí đỏ thơm ngon"')
      );
      expect(screen.getByText('Đã sao chép danh sách!')).toBeInTheDocument();
    });
  });

  test('handles API error and displays ErrorAlert boundary with retry', async () => {
    const errorSpy = jest
      .spyOn(recipeApi, 'generateRecipes')
      .mockRejectedValueOnce(new Error('Hệ thống xử lý quá thời gian chờ (timeout).'));

    render(<App />);

    const submitButton = screen.getByRole('button', { name: /Gợi ý món ăn ngay/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(
        screen.getByText(/Hệ thống xử lý quá thời gian chờ/i)
      ).toBeInTheDocument();
    });

    // Test retry
    errorSpy.mockResolvedValueOnce(mockRecipesData);
    const retryButton = screen.getByRole('button', { name: /Thử lại/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getAllByText('Cháo gà bí đỏ thơm ngon').length).toBeGreaterThan(0);
    });
  });

  test('toggles cooking checklist steps with strikethrough, dimming, and check icon', async () => {
    jest.spyOn(recipeApi, 'generateRecipes').mockResolvedValueOnce(mockRecipesData);

    render(<App />);

    const submitButton = screen.getByRole('button', { name: /Gợi ý món ăn ngay/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('Cháo gà bí đỏ thơm ngon').length).toBeGreaterThan(0);
    });

    // Step item 0 on card 0
    const stepItem = screen.getAllByTestId('step-item-0')[0];

    // Initially not completed
    expect(stepItem).not.toHaveClass('line-through');
    expect(stepItem).not.toHaveClass('opacity-50');

    // Click to complete
    fireEvent.click(stepItem);

    // Completed: has line-through, opacity-50, and text-slate-400
    expect(stepItem).toHaveClass('line-through');
    expect(stepItem).toHaveClass('opacity-50');
    expect(stepItem).toHaveClass('text-slate-400');

    // Click again to un-complete
    fireEvent.click(stepItem);
    expect(stepItem).not.toHaveClass('line-through');
    expect(stepItem).not.toHaveClass('opacity-50');
  });

  test('opens Focus/Zoom mode modal, interacts with checklist, and returns to 3-card grid', async () => {
    jest.spyOn(recipeApi, 'generateRecipes').mockResolvedValueOnce(mockRecipesData);

    render(<App />);

    const submitButton = screen.getByRole('button', { name: /Gợi ý món ăn ngay/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('Cháo gà bí đỏ thơm ngon').length).toBeGreaterThan(0);
    });

    // Click Zoom button on card 0
    const zoomButtons = screen.getAllByLabelText('Xem chi tiết / Phóng to');
    expect(zoomButtons.length).toBe(3);
    fireEvent.click(zoomButtons[0]);

    // Modal dialog is opened
    const modalDialog = screen.getByRole('dialog');
    expect(modalDialog).toBeInTheDocument();
    expect(screen.getByText('Chế độ Nấu Bếp (Tập trung)')).toBeInTheDocument();

    // Check step 1 inside modal
    const modalStepItem = within(modalDialog).getByTestId('step-item-0');
    fireEvent.click(modalStepItem);

    expect(modalStepItem).toHaveClass('line-through');
    expect(modalStepItem).toHaveClass('opacity-50');

    // Close modal via "Thu nhỏ / Trở lại 3 món"
    const minimizeBtn = screen.getAllByLabelText('Thu nhỏ / Trở lại 3 món')[0];
    fireEvent.click(minimizeBtn);

    // Modal closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // In 3-card grid, step 0 is still preserved as completed!
    const gridStepItem = screen.getAllByTestId('step-item-0')[0];
    expect(gridStepItem).toHaveClass('line-through');
    expect(gridStepItem).toHaveClass('opacity-50');
  });

  test('ThemeSwitcher: switches theme, updates localStorage, and applies data-theme attribute on root and html', () => {
    render(<App />);

    const themeSwitcher = screen.getByTestId('theme-switcher');
    expect(themeSwitcher).toBeInTheDocument();

    // Check initial data-theme
    expect(document.documentElement.getAttribute('data-theme')).toBe('mam-xanh');

    const toggleButton = screen.getByLabelText('Chọn chủ đề giao diện');
    expect(toggleButton).toBeInTheDocument();

    // Open theme dropdown
    fireEvent.click(toggleButton);

    // Select 'Cà Rốt Ấm Áp'
    const carrotOption = screen.getByRole('menuitem', { name: /Cà Rốt Ấm Áp/i });
    fireEvent.click(carrotOption);

    // Assert localStorage updated
    expect(localStorage.getItem('bechef-theme')).toBe('ca-rot');
    expect(document.documentElement.getAttribute('data-theme')).toBe('ca-rot');
    expect(screen.getByText('Cà Rốt')).toBeInTheDocument();
  });

  test('MealType: allows selecting meal type and includes meal_type in generateRecipes payload', async () => {
    const generateSpy = jest
      .spyOn(recipeApi, 'generateRecipes')
      .mockResolvedValueOnce(mockRecipesData);

    render(<App />);

    // Click "Bữa phụ" pill toggle
    const snackOption = screen.getByText(/Bữa phụ/i);
    fireEvent.click(snackOption);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Gợi ý món ăn ngay/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(generateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          meal_type: 'Bữa phụ'
        })
      );
    });
  });

  test('CookModeModal: opens fullscreen hands-free cooking mode, navigates steps, and plays speech synthesis', async () => {
    jest.spyOn(recipeApi, 'generateRecipes').mockResolvedValueOnce(mockRecipesData);

    render(<App />);

    const submitButton = screen.getByRole('button', { name: /Gợi ý món ăn ngay/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('Cháo gà bí đỏ thơm ngon').length).toBeGreaterThan(0);
    });

    // Click "Bắt đầu nấu" on first recipe card
    const cookModeButtons = screen.getAllByRole('button', { name: /Bắt đầu nấu/i });
    expect(cookModeButtons.length).toBe(3);
    fireEvent.click(cookModeButtons[0]);

    // Expect CookModeModal dialog to open
    const cookDialog = screen.getByRole('dialog', { name: /Chế độ nấu bếp rảnh tay/i });
    expect(cookDialog).toBeInTheDocument();
    expect(within(cookDialog).getByText(/Chế độ Nấu Rảnh Tay/i)).toBeInTheDocument();
    expect(within(cookDialog).getByText('Bước 1 / 3')).toBeInTheDocument();
    expect(within(cookDialog).getByText('Nấu cháo nhừ.')).toBeInTheDocument();

    // Click "Đọc bước này"
    const voiceButton = screen.getByRole('button', { name: /Đọc hướng dẫn giọng nói/i });
    fireEvent.click(voiceButton);
    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);

    // Navigate to next step
    const nextButton = screen.getByRole('button', { name: /Bước tiếp theo/i });
    fireEvent.click(nextButton);
    expect(within(cookDialog).getByText('Bước 2 / 3')).toBeInTheDocument();
    expect(within(cookDialog).getByText(/Xay nhuyễn thịt gà và bí đỏ đã hấp chín/i)).toBeInTheDocument();

    // Close modal
    const exitButton = screen.getByRole('button', { name: /Thoát chế độ nấu/i });
    fireEvent.click(exitButton);
    expect(screen.queryByRole('dialog', { name: /Chế độ nấu bếp rảnh tay/i })).not.toBeInTheDocument();
  });

  test('RegenerateSingleRecipe: replaces only 1 specific recipe card in place when clicking "Đổi món này"', async () => {
    jest.spyOn(recipeApi, 'generateRecipes').mockResolvedValueOnce(mockRecipesData);

    const mockReplacement = {
      recipe: {
        dish_name: 'Cháo bắp ngọt thịt heo mềm tan',
        suitable_age_range: '7 tháng',
        feeding_method: 'Truyền thống',
        texture_description: 'Độ thô mịn sánh 1:7',
        yield_portion: '1 chén 150ml',
        prep_time_minutes: 10,
        cook_time_minutes: 20,
        difficulty: 'Dễ',
        available_ingredients_used: [{ name: 'Bắp ngọt', amount: '30g' }],
        missing_ingredients_needed: [{ name: 'Thịt heo', amount: '30g' }],
        cooking_steps: ['Bước 1: Hấp bắp ngọt.', 'Bước 2: Xay mịn nấu cùng cháo.'],
        pediatrician_tip: 'Tập nhai mềm từ từ.'
      }
    };

    const regenSpy = jest
      .spyOn(recipeApi, 'regenerateSingleRecipe')
      .mockResolvedValueOnce(mockReplacement);

    render(<App />);

    const submitButton = screen.getByRole('button', { name: /Gợi ý món ăn ngay/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('Cháo gà bí đỏ thơm ngon').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Súp bí đỏ dashi ngọt lành').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Thanh gà hấp mềm BLW').length).toBeGreaterThan(0);
    });

    // Click "Đổi món này" on card 0
    const regenButtons = screen.getAllByRole('button', { name: /Đổi món này/i });
    expect(regenButtons.length).toBe(3);
    fireEvent.click(regenButtons[0]);

    expect(regenSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        current_dish_name: 'Cháo gà bí đỏ thơm ngon'
      })
    );

    // After replacement, card 0 has new dish, cards 1 and 2 are preserved
    await waitFor(() => {
      expect(screen.getAllByText('Cháo bắp ngọt thịt heo mềm tan').length).toBeGreaterThan(0);
      expect(screen.queryByText('Cháo gà bí đỏ thơm ngon')).not.toBeInTheDocument();
      expect(screen.getAllByText('Súp bí đỏ dashi ngọt lành').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Thanh gà hấp mềm BLW').length).toBeGreaterThan(0);
    });
  });

  test('SaveAsImage: exports pristine keepsake recipe poster as PNG using html-to-image without action buttons', async () => {
    jest.spyOn(recipeApi, 'generateRecipes').mockResolvedValueOnce(mockRecipesData);
    const htmlToImage = require('html-to-image');
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<App />);

    const submitButton = screen.getByRole('button', { name: /Gợi ý món ăn ngay/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('Cháo gà bí đỏ thơm ngon').length).toBeGreaterThan(0);
    });

    const exportButtons = screen.getAllByRole('button', { name: /Lưu ảnh công thức/i });
    expect(exportButtons.length).toBe(3);

    fireEvent.click(exportButtons[0]);

    await waitFor(() => {
      expect(htmlToImage.toPng).toHaveBeenCalled();
    });

    // Verify toPng was called with the poster element
    const passedElement = htmlToImage.toPng.mock.calls[0][0];
    expect(passedElement).toHaveAttribute('data-testid', 'recipe-export-poster');
    // Verify poster has watermark and no action buttons
    expect(within(passedElement).queryByRole('button')).not.toBeInTheDocument();
    expect(within(passedElement).getByText(/Chuẩn Y Khoa Nhi • Tác giả:/i)).toBeInTheDocument();

    clickSpy.mockRestore();
  });
});
