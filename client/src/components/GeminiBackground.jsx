import React from 'react';

export const AURORA_THEMES = {
  'mam-xanh': {
    blob1: '#36BA34', // emerald green
    blob2: '#84cc16', // lime
    blob3: '#34d399', // mint
    blob4: '#fef08a', // soft lemon
  },
  'bo-sua': {
    blob1: '#D97706', // warm butter
    blob2: '#fed7aa', // soft peach
    blob3: '#f59e0b', // amber gold
    blob4: '#fef08a', // cream
  },
  'ca-rot': {
    blob1: '#EA580C', // carrot orange
    blob2: '#fb7185', // coral rose
    blob3: '#f59e0b', // honey amber
    blob4: '#fed7aa', // warm apricot
  },
  'be-may': {
    blob1: '#0284C7', // sky blue
    blob2: '#38bdf8', // cyan
    blob3: '#c084fc', // soft violet
    blob4: '#818cf8', // indigo mist
  },
};

export default function GeminiBackground({ currentTheme = 'mam-xanh' }) {
  const colors = AURORA_THEMES[currentTheme] || AURORA_THEMES['mam-xanh'];

  return (
    <div
      data-testid="gemini-background"
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      {/* Blob 1: Top-Left (18s loop) */}
      <div
        data-testid="aurora-blob-1"
        className="absolute -top-24 -left-24 w-[380px] h-[380px] sm:w-[540px] sm:h-[540px] rounded-full opacity-40 mix-blend-multiply blur-[100px] sm:blur-[120px] transition-colors duration-1000 animate-aurora-1"
        style={{ backgroundColor: colors.blob1 }}
      />

      {/* Blob 2: Top-Right (22s loop) */}
      <div
        data-testid="aurora-blob-2"
        className="absolute -top-12 -right-24 w-[400px] h-[400px] sm:w-[580px] sm:h-[580px] rounded-full opacity-35 mix-blend-multiply blur-[100px] sm:blur-[120px] transition-colors duration-1000 animate-aurora-2"
        style={{ backgroundColor: colors.blob2 }}
      />

      {/* Blob 3: Center-Bottom (20s loop) */}
      <div
        data-testid="aurora-blob-3"
        className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full opacity-30 mix-blend-multiply blur-[100px] sm:blur-[120px] transition-colors duration-1000 animate-aurora-3"
        style={{ backgroundColor: colors.blob3 }}
      />

      {/* Blob 4: Bottom-Right (25s loop) */}
      <div
        data-testid="aurora-blob-4"
        className="absolute -bottom-28 -right-16 w-[420px] h-[420px] sm:w-[600px] sm:h-[600px] rounded-full opacity-35 mix-blend-multiply blur-[100px] sm:blur-[120px] transition-colors duration-1000 animate-aurora-4"
        style={{ backgroundColor: colors.blob4 }}
      />

      {/* Subtle organic texture / dot overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
}
