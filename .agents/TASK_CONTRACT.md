# TASK CONTRACT: Brand Standards & Author Attribution ("Ngự Võ")

## Feature Overview
- **Feature Name**: `feat/brand-standards-author-ngu-vo`
- **Goal**: Implement proper brand identity standards and credit the author **Ngự Võ** across client UI, HTML metadata, API service information, package manifests, and project documentation.

## Acceptance Criteria
1. **Author Credit in UI**:
   - `client/src/App.jsx` footer displays clearly: `© 2026 BeChef • Tác giả: Ngự Võ`.
   - Responsive and elegant typography matching brand palette.
2. **Metadata & Manifests**:
   - `client/index.html` includes `<meta name="author" content="Ngự Võ">` and proper SEO meta description.
   - `package.json` and `client/package.json` specify `"author": "Ngự Võ"`.
3. **Backend API**:
   - `GET /api/health` endpoint includes `author: "Ngự Võ"`.
4. **Project Documentation**:
   - `README.md` credits author "Ngự Võ" in header and contact/feedback section.

## Ownership
- **Backend Specialist**: `server.js`, `package.json`.
- **Frontend Specialist**: `client/index.html`, `client/package.json`, `client/src/App.jsx`.
- **QA Specialist**: Regression test suite & build check.
