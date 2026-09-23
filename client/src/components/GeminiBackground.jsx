import React from 'react';

export const AURORA_THEMES = {
  'mam-xanh': {
    blob1: '#36BA34', // xanh lá mầm chính
    blob2: '#84cc16', // xanh cốm lime
    blob3: '#34d399', // ngọc lục bảo pastel
    blob4: '#fef08a', // vàng nắng ấm
  },
  'bo-sua': {
    blob1: '#D97706', // vàng bơ ấm
    blob2: '#fed7aa', // cam đào sữa
    blob3: '#f59e0b', // hổ phách ấm
    blob4: '#fef08a', // kem sữa nhạt
  },
  'ca-rot': {
    blob1: '#EA580C', // cam cà rốt
    blob2: '#ffedd5', // cam pastel mềm
    blob3: '#fb923c', // cam đào tươi
    blob4: '#fef08a', // vàng nhạt
  },
  'be-may': {
    blob1: '#0284C7', // xanh mây trời
    blob2: '#e0f2fe', // xanh thiên thanh sữa
    blob3: '#38bdf8', // xanh lam nhạt
    blob4: '#fef08a', // ánh nắng nhẹ
  },
};

export default function GeminiBackground({ currentTheme = 'mam-xanh' }) {
  const colors = AURORA_THEMES[currentTheme] || AURORA_THEMES['mam-xanh'];

  return (
    <div
      data-testid="gemini-background"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* Blob 1: Top-Left Aura (Rotate & Translate3d 18s) */}
      <div
        data-testid="aurora-blob-1"
        className="absolute -top-28 -left-28 w-[550px] h-[550px] rounded-full opacity-45 mix-blend-multiply blur-[120px] transition-colors duration-1000 animate-aurora-1"
        style={{ backgroundColor: colors.blob1 }}
      />

      {/* Blob 2: Top-Right / Center Aura (Rotate & Translate3d 22s) */}
      <div
        data-testid="aurora-blob-2"
        className="absolute top-1/4 -right-28 w-[550px] h-[550px] rounded-full opacity-40 mix-blend-multiply blur-[120px] transition-colors duration-1000 animate-aurora-2"
        style={{ backgroundColor: colors.blob2 }}
      />

      {/* Blob 3: Bottom-Left / Center Aura (Rotate & Translate3d 20s) */}
      <div
        data-testid="aurora-blob-3"
        className="absolute -bottom-28 left-1/4 w-[550px] h-[550px] rounded-full opacity-45 mix-blend-multiply blur-[120px] transition-colors duration-1000 animate-aurora-3"
        style={{ backgroundColor: colors.blob3 }}
      />

      {/* Blob 4: Bottom-Right Subtle Glow (Rotate & Translate3d 25s) */}
      <div
        data-testid="aurora-blob-4"
        className="absolute -bottom-20 -right-20 w-[480px] h-[480px] rounded-full opacity-35 mix-blend-multiply blur-[110px] transition-colors duration-1000 animate-aurora-4"
        style={{ backgroundColor: colors.blob4 }}
      />

      {/* Subtle organic noise texture / dot mesh */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
}
