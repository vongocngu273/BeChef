# TASK CONTRACT: Interactive Cooking Checklist & Flashcard Focus Mode

## Feature Overview
- **Feature Name**: `feat/flashcard-checklist-and-focus-mode`
- **Goal**: Enable interactive task tracking during meal prep by turning cooking steps into toggleable checklists with strikethrough/dimming, and add a single-flashcard Focus/Zoom mode for distracted parents in the kitchen.

## Acceptance Criteria
1. **Interactive Checklist**:
   - Each step in "Các bước thực hiện" is clickable as a checklist item.
   - Clicking toggles the step between complete and incomplete.
   - Completed step has: `line-through`, dimmed opacity (`opacity-50 text-slate-400`), and checkmark badge.
   - Progress is preserved while navigating within the session.
2. **Flashcard Focus / Zoom Mode**:
   - Each flashcard has an intuitive button: "Phóng to / Tập trung" (Expand/Focus icon).
   - Clicking opens the card in prominent Focus Mode (expanded modal or dedicated focus view).
   - In Focus Mode, font sizes are optimized for kitchen viewing (hands-free cooking reading).
   - "Thu nhỏ / Xem tất cả 3 món" button safely returns to the 3-card grid.
   - Checklist state and clipboard copying work seamlessly inside Focus Mode.
3. **Pediatric Safety**:
   - Hard Pediatric Guardrails remain 100% intact.
   - Zero honey/salt/sugar for infants < 12 months.

## Ownership
- **Backend Specialist**: Contract verification, API sanity check.
- **Frontend Specialist**:
  - `client/src/components/RecipeCard.jsx`
  - `client/src/App.jsx`
  - `client/src/components/RecipeFocusModal.jsx` (or integrated focus view)
- **QA Specialist**:
  - `tests/App.test.jsx`
  - Regression and build verification.

## Definition of Done
- 100% automated test pass (Jest + RTL).
- Production build clean (`npm run build`).
