import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';

export const THEMES = {
  'mam-xanh': {
    id: 'mam-xanh',
    name: 'Mầm Xanh Dịu Mát',
    shortName: 'Mầm Xanh',
    emoji: '🌱',
    primary: '#36BA34',
    primaryHover: '#2ea12c',
    light: '#E8F8E8',
    border: '#A7F3D0',
    bg: '#F8FAF8',
    blob1: 'bg-[#36BA34]/15',
    blob2: 'bg-[#36BA34]/10',
    accentText: 'text-[#36BA34]',
    accentBg: 'bg-[#36BA34]',
    accentBorder: 'border-[#36BA34]',
    badgeBg: 'bg-emerald-100 text-emerald-800'
  },
  'bo-sua': {
    id: 'bo-sua',
    name: 'Bơ Sữa Ngọt Ngào',
    shortName: 'Bơ Sữa',
    emoji: '🥑',
    primary: '#D97706',
    primaryHover: '#b45309',
    light: '#FEF9C3',
    border: '#FDE68A',
    bg: '#FEFCE8',
    blob1: 'bg-[#D97706]/20',
    blob2: 'bg-[#D97706]/10',
    accentText: 'text-[#D97706]',
    accentBg: 'bg-[#D97706]',
    accentBorder: 'border-[#D97706]',
    badgeBg: 'bg-amber-100 text-amber-800'
  },
  'ca-rot': {
    id: 'ca-rot',
    name: 'Cà Rốt Ấm Áp',
    shortName: 'Cà Rốt',
    emoji: '🥕',
    primary: '#EA580C',
    primaryHover: '#c2410c',
    light: '#FFEDD5',
    border: '#FED7AA',
    bg: '#FFF7ED',
    blob1: 'bg-[#EA580C]/20',
    blob2: 'bg-[#EA580C]/10',
    accentText: 'text-[#EA580C]',
    accentBg: 'bg-[#EA580C]',
    accentBorder: 'border-[#EA580C]',
    badgeBg: 'bg-orange-100 text-orange-800'
  },
  'be-may': {
    id: 'be-may',
    name: 'Bé Mây Tươi Sáng',
    shortName: 'Bé Mây',
    emoji: '☁️',
    primary: '#0284C7',
    primaryHover: '#0369a1',
    light: '#E0F2FE',
    border: '#BAE6FD',
    bg: '#F0F9FF',
    blob1: 'bg-[#0284C7]/20',
    blob2: 'bg-[#0284C7]/10',
    accentText: 'text-[#0284C7]',
    accentBg: 'bg-[#0284C7]',
    accentBorder: 'border-[#0284C7]',
    badgeBg: 'bg-sky-100 text-sky-800'
  }
};

export default function ThemeSwitcher({ currentTheme = 'mam-xanh', onSelectTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeTheme = THEMES[currentTheme] || THEMES['mam-xanh'];

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (themeId) => {
    if (onSelectTheme) {
      onSelectTheme(themeId);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef} data-testid="theme-switcher">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Chọn chủ đề giao diện"
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 hover:bg-white text-slate-700 border border-slate-200/80 shadow-xs transition-all cursor-pointer hover:border-slate-300"
      >
        <span className="text-sm">{activeTheme.emoji}</span>
        <span className="hidden sm:inline">{activeTheme.shortName}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-52 origin-top-right rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-1.5 z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Chủ đề màu sắc BeChef
          </div>
          {Object.values(THEMES).map((theme) => {
            const isSelected = theme.id === currentTheme;
            return (
              <button
                key={theme.id}
                role="menuitem"
                data-testid={`theme-btn-${theme.id}`}
                aria-label={theme.name}
                type="button"
                onClick={() => handleSelect(theme.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-slate-100 font-bold text-slate-900'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{theme.emoji}</span>
                  <div>
                    <span className="block">{theme.name}</span>
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full mt-0.5"
                      style={{ backgroundColor: theme.primary }}
                    />
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
