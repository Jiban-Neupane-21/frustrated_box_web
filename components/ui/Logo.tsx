// frustratedbox-web/components/ui/logo.tsx
import React from "react";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({
  size = 36,
  showText = true,
  className = "",
}: LogoProps) {
  return (
    <div
      className={`fb-logo inline-flex items-center gap-2.5 select-none ${className}`}
    >
      <style>{`
        /* Lid strains under pressure */
        @keyframes fb-lid {
          0%, 70%, 100% { transform: translateY(0) rotate(0deg); }
          78% { transform: translateY(-2.5px) rotate(-5deg); }
          86% { transform: translateY(-1px) rotate(-2deg); }
          94% { transform: translateY(-2px) rotate(-4deg); }
        }
        /* Hover: shake */
        @keyframes fb-shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-1.5px) rotate(-2deg); }
          75% { transform: translateX(1.5px) rotate(2deg); }
        }
        /* Anger mark pulse */
        @keyframes fb-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .fb-lid { transform-box: fill-box; transform-origin: 0% 100%; animation: fb-lid 3.2s ease-in-out infinite; }
        .fb-logo:hover .fb-lid { animation-duration: 0.6s; }

        .fb-body { transform-box: fill-box; transform-origin: center; }
        .fb-logo:hover .fb-body { animation: fb-shake 0.14s linear infinite; }

        .fb-mark { transform-box: fill-box; transform-origin: center; animation: fb-pulse 1.4s ease-in-out infinite; }
        .fb-logo:hover .fb-mark { animation-duration: 0.35s; }

        @media (prefers-reduced-motion: reduce) {
          .fb-lid, .fb-mark, .fb-logo:hover .fb-body,
          .fb-logo:hover .fb-lid, .fb-logo:hover .fb-mark { animation: none; }
        }
      `}</style>

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible"
        role="img"
        aria-label="Frustrated Box logo: an angry box with its lid about to pop"
      >
        {/* Body */}
        <g className="fb-body">
          <rect
            x="12"
            y="34"
            width="76"
            height="54"
            rx="12"
            fill="#140a0b"
            stroke="#dc2626"
            strokeWidth="3"
          />

          {/* Angry brows */}
          <path
            d="M 26 47 L 43 54 M 74 47 L 57 54"
            stroke="#ef4444"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Eyes */}
          <circle cx="38" cy="61" r="3.5" fill="#fff" />
          <circle cx="62" cy="61" r="3.5" fill="#fff" />

          {/* Gritted zigzag mouth */}
          <path
            d="M 32 78 L 38.5 72 L 45 78 L 51.5 72 L 58 78 L 64.5 72 L 68 76"
            stroke="#ef4444"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Lid, popping from pressure */}
        <g className="fb-lid">
          <rect x="8" y="20" width="84" height="13" rx="6" fill="#dc2626" />
        </g>
      </svg>

      {showText && (
        <span className="font-black text-xl tracking-tighter text-white flex items-center">
          Frustrated
          <span className="text-red-600 -skew-x-6">Box</span>
        </span>
      )}
    </div>
  );
}
