import React from "react";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({
  size = 38,
  showText = true,
  className = "",
}: LogoProps) {
  return (
    <div
      className={`fb-logo inline-flex items-center gap-2.5 select-none cursor-pointer ${className}`}
    >
      <style>{`
        /* Lid / Top face strain under pressure */
        @keyframes fb-lid {
          0%, 70%, 100% { transform: translateY(0) rotate(0deg); }
          78% { transform: translateY(-2px) rotate(-1deg); }
          86% { transform: translateY(-0.5px) rotate(-0.5deg); }
          94% { transform: translateY(-1.5px) rotate(-1deg); }
        }

        /* SVG visual components behavior */
        .fb-body {
          transform-box: fill-box;
          transform-origin: center;
        }
        .fb-logo:hover .fb-body {
          animation: fb-shake 0.15s linear infinite;
        }

        .fb-lid {
          transform-box: fill-box;
          transform-origin: center;
          animation: fb-lid 3.2s ease-in-out infinite;
        }
        .fb-logo:hover .fb-lid {
          animation-duration: 0.6s;
        }

        /* Hover Glow transition on cracks */
        .fb-cracks {
          transition: filter 0.3s ease-in-out;
        }
        .fb-logo:hover .fb-cracks {
          filter: drop-shadow(0 0 10px #ef4444) drop-shadow(0 0 20px #dc2626);
        }

        @media (prefers-reduced-motion: reduce) {
          .fb-lid,
          .fb-logo:hover .fb-body,
          .fb-logo:hover .fb-lid {
            animation: none;
          }
        }
      `}</style>

      {/* Frustrated Box Brand Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 500"
        width={size}
        height={size}
        role="img"
        aria-label="Frustrated Box Icon"
        className="fb-body overflow-visible"
      >
        <defs>
          <style>{`
            .stroke { 
              fill: none; 
              stroke: #ff1a1a; 
              stroke-width: 9; 
              stroke-linecap: round; 
              stroke-linejoin: round; 
            }
            /* Inner components to map on CSS anim classes */
            .fb-bubble-bg {
              fill: #000;
            }
          `}</style>

          {/* Subtle Outer Glow for frustration dynamic */}
          <filter id="frust-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Back bubble representing user overlay */}
        <path
          className="stroke fb-lid fb-cracks"
          filter="url(#frust-glow)"
          d="M300 194 C335 194 350 215 350 240 V258 C350 280 340 305 323 333 L296 312 L252 298"
        />

        {/* Inner core boundary group */}
        <g className="fb-cracks">
          {/* Front frustrated face */}
          <path
            className="stroke fb-bubble-bg"
            d="M190 164 H262 A38 38 0 0 1 300 202 V234 A38 38 0 0 1 262 272 H238 L178 300 L192 267 Q152 255 152 234 V202 A38 38 0 0 1 190 164 Z"
          />

          {/* Aggressive Eyebrows (Tension-lines) */}
          <path className="stroke" d="M184 192 L214 206 M268 192 L238 206" />

          {/* Angry Eyes */}
          <circle cx="204" cy="222" r="7" fill="#ff1a1a" />
          <circle cx="248" cy="222" r="7" fill="#ff1a1a" />

          {/* Frustrated Scribble Mouth */}
          <path
            className="stroke"
            d="M202 252 L214 244 L226 252 L238 244 L250 252"
          />
        </g>
      </svg>

      {/* Brand Wordmark text */}
      {showText && (
        <span className="font-black text-xl tracking-tighter text-white flex items-center">
          Frustrated
          <span className="text-red-600 -skew-x-6 ml-0.5">Box</span>
        </span>
      )}
    </div>
  );
}
