import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  X,
  ChefHat,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Settings2
} from 'lucide-react';

export default function CookModeModal({
  recipe,
  onClose,
  completedSteps = [],
  onToggleStep
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [showAudioSettings, setShowAudioSettings] = useState(false);

  // Audio configuration state
  const [selectedVoiceEngine, setSelectedVoiceEngine] = useState('vi-VN-HoaiMyNeural');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(100);
  const [availableVoices, setAvailableVoices] = useState([]);

  const steps = recipe?.cooking_steps || [];
  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex] || '';
  const cleanStepText = currentStep.replace(/^Bước\s*\d+:\s*/i, '');
  const isCurrentStepDone = completedSteps.includes(currentStepIndex);

  // Load and listen to speech synthesis voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.getVoices) {
        const voices = window.speechSynthesis.getVoices() || [];
        setAvailableVoices(voices);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Stop speech when closing or unmounting
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop voice playback cleanly
  const stopVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingVoice(false);
  };

  // Find best matched voice in browser
  const getSelectedVoice = () => {
    if (!availableVoices || availableVoices.length === 0) return null;

    if (selectedVoiceEngine === 'vi-VN-HoaiMyNeural') {
      const match = availableVoices.find(
        (v) =>
          v.name.includes('HoaiMy') ||
          v.voiceURI?.includes('HoaiMy') ||
          v.name.includes('Hoài My')
      );
      if (match) return match;
    }

    if (selectedVoiceEngine === 'vi-VN-NamMinhNeural') {
      const match = availableVoices.find(
        (v) =>
          v.name.includes('NamMinh') ||
          v.voiceURI?.includes('NamMinh') ||
          v.name.includes('Nam Minh')
      );
      if (match) return match;
    }

    // Fallback: any voice for Vietnamese
    const viVoice = availableVoices.find(
      (v) => v.lang === 'vi-VN' || v.lang?.toLowerCase().startsWith('vi')
    );
    return viVoice || null;
  };

  const handleToggleVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (isPlayingVoice) {
      stopVoice();
    } else {
      stopVoice();
      const textToRead = `Bước ${currentStepIndex + 1}. ${cleanStepText}`;
      const utterance = new window.SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'vi-VN';
      utterance.rate = Number(speed);
      utterance.pitch = Number(pitch);
      utterance.volume = Number(volume) / 100;

      const matchedVoice = getSelectedVoice();
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => setIsPlayingVoice(false);
      utterance.onerror = () => setIsPlayingVoice(false);
      setIsPlayingVoice(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePrev = () => {
    stopVoice();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    stopVoice();
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleToggleCurrentStep = () => {
    if (onToggleStep) {
      onToggleStep(currentStepIndex);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chế độ nấu bếp rảnh tay"
      className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 md:p-12 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800">
                Chế độ Nấu Rảnh Tay
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {recipe.suitable_age_range} • {recipe.feeding_method}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5 line-clamp-1">
              {recipe.dish_name}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Audio Wave Equalizer Animation (Lively 5 bouncing bars) */}
          {isPlayingVoice && (
            <div
              data-testid="audio-wave-animation"
              className="flex items-center gap-1 h-6 px-1.5"
              aria-label="Đang phát âm thanh"
            >
              <span className="w-1 bg-emerald-500 rounded-full animate-eq-1" />
              <span className="w-1 bg-brand-500 rounded-full animate-eq-2" />
              <span className="w-1 bg-amber-500 rounded-full animate-eq-3" />
              <span className="w-1 bg-brand-500 rounded-full animate-eq-4" />
              <span className="w-1 bg-emerald-500 rounded-full animate-eq-5" />
            </div>
          )}

          {/* Speech Synthesis Voice Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            aria-label={isPlayingVoice ? 'Dừng đọc hướng dẫn' : 'Đọc hướng dẫn giọng nói'}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-95 ${
              isPlayingVoice
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-brand-500 text-white hover:bg-brand-600'
            }`}
          >
            {isPlayingVoice ? (
              <>
                <VolumeX className="w-4 h-4 animate-pulse" />
                <span>Dừng đọc</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Đọc bước này</span>
              </>
            )}
          </button>

          {/* Audio Settings Toggle Button (⚙️ / 🎚️) */}
          <button
            type="button"
            onClick={() => setShowAudioSettings((prev) => !prev)}
            aria-label="Cài đặt âm thanh"
            aria-expanded={showAudioSettings}
            className={`p-2 sm:px-3 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer border flex items-center gap-1.5 ${
              showAudioSettings
                ? 'bg-brand-100 text-brand-800 border-brand-300 shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4 text-slate-700" />
            <span className="hidden md:inline">Giọng đọc</span>
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Thoát chế độ nấu"
            className="p-2 sm:px-3.5 sm:py-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
            <span className="hidden sm:inline">Thoát</span>
          </button>
        </div>

        {/* Audio Settings Popover Panel */}
        {showAudioSettings && (
          <div
            data-testid="audio-settings-panel"
            className="absolute top-16 right-0 sm:right-4 z-50 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                <Settings2 className="w-4 h-4 text-brand-500" />
                <span>Cài đặt giọng đọc (Edge TTS)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAudioSettings(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
                aria-label="Đóng bảng cài đặt âm thanh"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Voice Engine selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Bộ giọng tiếng Việt:
              </label>
              <select
                value={selectedVoiceEngine}
                onChange={(e) => {
                  stopVoice();
                  setSelectedVoiceEngine(e.target.value);
                }}
                aria-label="Chọn giọng đọc"
                className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                <option value="vi-VN-HoaiMyNeural">
                  Hoài My (Nữ nhẹ nhàng - Microsoft Edge TTS)
                </option>
                <option value="vi-VN-NamMinhNeural">
                  Nam Minh (Nam truyền cảm - Microsoft Edge TTS)
                </option>
                <option value="system-default">
                  Mặc định hệ thống thiết bị (vi-VN)
                </option>
              </select>
            </div>

            {/* Speed slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700">Tốc độ đọc:</span>
                <span className="font-semibold text-brand-600">{speed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                aria-label="Tốc độ đọc"
                value={speed}
                onChange={(e) => {
                  stopVoice();
                  setSpeed(parseFloat(e.target.value));
                }}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.75x (Chậm)</span>
                <span>1.0x (Chuẩn)</span>
                <span>1.5x (Nhanh)</span>
              </div>
            </div>

            {/* Pitch slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700">Cao độ giọng:</span>
                <span className="font-semibold text-brand-600">{pitch.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.05"
                aria-label="Cao độ giọng"
                value={pitch}
                onChange={(e) => {
                  stopVoice();
                  setPitch(parseFloat(e.target.value));
                }}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.8 (Trầm)</span>
                <span>1.0 (Tự nhiên)</span>
                <span>1.2 (Thanh)</span>
              </div>
            </div>

            {/* Volume slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700">Âm lượng:</span>
                <span className="font-semibold text-brand-600">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                aria-label="Âm lượng"
                value={volume}
                onChange={(e) => {
                  stopVoice();
                  setVolume(parseInt(e.target.value, 10));
                }}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Center Content: Large Typography Steps */}
      <div className="my-auto py-8 sm:py-12 max-w-4xl mx-auto w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-sm sm:text-base font-bold">
          <span>Bước {currentStepIndex + 1} / {totalSteps}</span>
        </div>

        {/* Large Typography: 24px - 28px+ */}
        <div className="min-h-[140px] flex items-center justify-center">
          <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 leading-relaxed tracking-tight px-4">
            {cleanStepText || 'Hoàn tất các bước nấu ăn!'}
          </p>
        </div>

        {/* Mark completed toggle button */}
        <div>
          <button
            type="button"
            onClick={handleToggleCurrentStep}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer border ${
              isCurrentStepDone
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <CheckCircle2
              className={`w-5 h-5 ${
                isCurrentStepDone ? 'text-emerald-600' : 'text-slate-400'
              }`}
            />
            <span>
              {isCurrentStepDone ? 'Đã hoàn thành bước này' : 'Đánh dấu đã hoàn thành'}
            </span>
          </button>
        </div>

        {/* Pediatric Note / Texture Reminder */}
        {recipe.texture_description && (
          <div className="max-w-xl mx-auto p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm text-amber-900 flex items-center justify-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Lưu ý độ thô:</strong> {recipe.texture_description}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Step Navigation Bar */}
      <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          aria-label="Bước trước"
          className={`flex items-center gap-1.5 px-5 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all ${
            currentStepIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer active:scale-95'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Bước trước</span>
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-2 overflow-x-auto px-2">
          {steps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                stopVoice();
                setCurrentStepIndex(idx);
              }}
              aria-label={`Chuyển tới bước ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentStepIndex
                  ? 'w-8 bg-brand-500'
                  : completedSteps.includes(idx)
                  ? 'w-2.5 bg-emerald-400'
                  : 'w-2.5 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={currentStepIndex === totalSteps - 1 ? onClose : handleNext}
          aria-label={currentStepIndex === totalSteps - 1 ? 'Hoàn thành nấu' : 'Bước tiếp theo'}
          className="flex items-center gap-1.5 px-5 py-3 rounded-2xl font-bold text-sm sm:text-base bg-brand-500 hover:bg-brand-600 text-white transition-all cursor-pointer active:scale-95 shadow-md shadow-brand-500/20"
        >
          <span>
            {currentStepIndex === totalSteps - 1 ? 'Hoàn tất' : 'Bước tiếp theo'}
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
