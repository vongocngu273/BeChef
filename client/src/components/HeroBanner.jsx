import React from 'react';

export default function HeroBanner() {
  return (
    <div
      data-testid="hero-banner"
      className="rounded-3xl backdrop-blur-md bg-white/75 border border-white/60 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left transition-all"
    >
      {/* Crisp Vector SVG Illustration: Baby Chef with cute toque, smile, spoon, and steaming pot */}
      <div className="relative shrink-0 flex items-center justify-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-100 via-orange-50 to-emerald-100 flex items-center justify-center shadow-xs border border-white/80 p-1">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Minh họa Đầu Bếp Nhí BeChef"
            role="img"
          >
            {/* Soft decorative background glow */}
            <circle cx="50" cy="50" r="46" fill="#FEF3C7" fillOpacity="0.4" />

            {/* Steaming gentle heart steam from cooking pot */}
            <path
              d="M71 44 C69 41 65 42 67 45 C68 47 71 49 71 49 C71 49 74 47 75 45 C77 42 73 41 71 44 Z"
              fill="#FB7185"
              className="animate-pulse"
            />
            <path
              d="M79 36 C77.5 33.5 74.5 34.5 76 36.5 C77 38 79 39.5 79 39.5 C79 39.5 81 38 82 36.5 C83.5 34.5 80.5 33.5 79 36 Z"
              fill="#F43F5E"
              opacity="0.8"
            />
            <path
              d="M69 52 Q66 48 70 45"
              stroke="#FDA4AF"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />

            {/* Baby Chef Face */}
            <circle cx="45" cy="54" r="23" fill="#FED7AA" />
            <circle cx="45" cy="54" r="22" fill="#FFEDD5" />

            {/* Rosy Blush Cheeks */}
            <circle cx="34" cy="59" r="4.5" fill="#FDA4AF" opacity="0.85" />
            <circle cx="56" cy="59" r="4.5" fill="#FDA4AF" opacity="0.85" />

            {/* Friendly sparkling eyes */}
            <ellipse cx="37" cy="51" rx="2.5" ry="3.2" fill="#1E293B" />
            <ellipse cx="53" cy="51" rx="2.5" ry="3.2" fill="#1E293B" />
            <circle cx="36" cy="49.8" r="1" fill="#FFFFFF" />
            <circle cx="52" cy="49.8" r="1" fill="#FFFFFF" />

            {/* Happy Curved Smile */}
            <path
              d="M40 58 Q45 64 50 58"
              stroke="#E11D48"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="#F43F5E"
            />

            {/* Baby Chef Hat (Toque) */}
            <path
              d="M27 38 C23 23, 41 18, 45 25 C50 16, 68 21, 64 38 Z"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />
            <rect
              x="27"
              y="35"
              width="37"
              height="8"
              rx="2.5"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            {/* Ribbon on Hat Band */}
            <path
              d="M29 39 L62 39"
              stroke="#38BDF8"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Little Heart Badge on Hat */}
            <path
              d="M45.5 37 C44.5 35.5 42.5 36.5 44 38 L45.5 39.5 L47 38 C48.5 36.5 46.5 35.5 45.5 37 Z"
              fill="#F43F5E"
            />

            {/* Neckerchief / Apron */}
            <path d="M40 70 L45 76 L50 70 Z" fill="#F59E0B" />
            <path
              d="M33 72 Q45 76 57 72 L60 90 L30 90 Z"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1"
            />

            {/* Steaming Baby Food Pot */}
            <path
              d="M60 67 L82 67 C84 67 85 69 84 72 L81 85 C80 88 77 90 71 90 C65 90 62 88 61 85 L58 72 C57 69 58 67 60 67 Z"
              fill="#EA580C"
            />
            <ellipse cx="71" cy="67" rx="11" ry="3" fill="#FB923C" stroke="#EA580C" strokeWidth="1" />
            {/* Puree inside pot */}
            <ellipse cx="71" cy="67" rx="9" ry="1.8" fill="#FEF08A" />
            {/* Pot handle */}
            <path
              d="M82 72 Q87 72 86 77 Q85 81 81 81"
              fill="none"
              stroke="#C2410C"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Wooden Spoon */}
            <path
              d="M24 64 L72 65"
              stroke="#D97706"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <ellipse
              cx="72"
              cy="65"
              rx="4"
              ry="2.5"
              fill="#B45309"
              transform="rotate(-8 72 65)"
            />

            {/* Baby Hand holding spoon */}
            <circle cx="28" cy="64" r="3.5" fill="#FED7AA" />

            {/* Little Sparkle */}
            <path
              d="M17 40 L18.5 43.5 L22 45 L18.5 46.5 L17 50 L15.5 46.5 L12 45 L15.5 43.5 Z"
              fill="#F59E0B"
            />
          </svg>
        </div>
        <span className="absolute -bottom-1 -right-1 text-xs bg-white/90 backdrop-blur-xs rounded-full p-0.5 shadow-xs border border-amber-200">
          ✨
        </span>
      </div>

      {/* Banner Text */}
      <div className="space-y-1">
        <h3 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug tracking-tight">
          Cùng mẹ chuẩn bị bữa ăn dặm đầu đời tràn đầy dinh dưỡng & yêu thương
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          BeChef đồng hành thiết kế thực đơn khoa học, độ thô chuẩn lứa tuổi và an toàn tuyệt đối.
        </p>
      </div>
    </div>
  );
}
