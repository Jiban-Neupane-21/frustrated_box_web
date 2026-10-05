// frustratedbox-web/components/ui/logo.tsx
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

        /* Hover: box shake */
        @keyframes fb-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-1px) rotate(-0.5deg); }
          75% { transform: translateX(1px) rotate(0.5deg); }
        }

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

      {/* SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width={size}
        height={size}
        fill="none"
        className="shrink-0"
      >
        <defs>
          <linearGradient
            id="topFace"
            x1="256"
            y1="96"
            x2="256"
            y2="246"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#1c1917" />
            <stop offset="100%" stopColor="#0f0e0e" />
          </linearGradient>

          <linearGradient
            id="leftFace"
            x1="120"
            y1="210"
            x2="256"
            y2="416"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#141416" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>

          <linearGradient
            id="rightFace"
            x1="392"
            y1="210"
            x2="256"
            y2="416"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#0d0d0f" />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>

          <filter id="crackGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* CUBE BODY (fb-body shake animate हुन्छ) */}
        <g className="fb-body">
          {/* Top Face (fb-lid strain animate हुन्छ) */}
          <polygon
            className="fb-lid"
            points="256,96 392,170 256,246 120,170"
            fill="url(#topFace)"
            stroke="#27272a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Left Face */}
          <polygon
            points="120,170 256,246 256,416 120,336"
            fill="url(#leftFace)"
            stroke="#27272a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Right Face */}
          <polygon
            points="256,246 392,170 392,336 256,416"
            fill="url(#rightFace)"
            stroke="#27272a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Inner Accent Edges */}
          <line
            x1="256"
            y1="246"
            x2="256"
            y2="416"
            stroke="#1f1f23"
            strokeWidth="2"
          />
          <line
            x1="120"
            y1="170"
            x2="256"
            y2="246"
            stroke="#27272a"
            strokeWidth="2"
          />
          <line
            x1="392"
            y1="170"
            x2="256"
            y2="246"
            stroke="#1f1f23"
            strokeWidth="2"
          />
        </g>

        {/* FRACTURES / CRACKS (Hover गर्दा glow हुन्छ) */}
        <g className="fb-cracks" filter="url(#crackGlow)">
          {/* Main Center Fracture */}
          <path
            d="M 230 110 
               L 265 155 
               L 242 195 
               L 256 246 
               L 236 295 
               L 272 345 
               L 250 416"
            stroke="#ef4444"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Left Branch */}
          <path
            d="M 242 195 
               L 185 225 
               L 150 255"
            stroke="#dc2626"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Branch */}
          <path
            d="M 256 246 
               L 305 270 
               L 345 285"
            stroke="#dc2626"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Lower Branch */}
          <path
            d="M 236 295 
               L 180 325"
            stroke="#b91c1c"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* High-Heat White Core Line */}
        <path
          d="M 233 118 
             L 265 155 
             L 242 195 
             L 256 246 
             L 236 295 
             L 270 342 
             L 252 405"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />

        {/* Ejected Shards */}
        <polygon points="285,140 292,135 290,146" fill="#dc2626" />
        <polygon points="215,280 222,275 220,286" fill="#ef4444" />
        <polygon points="325,255 332,250 330,260" fill="#dc2626" />
      </svg>

      {/* Brand Wordmark */}
      {showText && (
        <span className="font-black text-xl tracking-tighter text-white flex items-center">
          Frustrated
          <span className="text-red-600 -skew-x-6 ml-0.5">Box</span>
        </span>
      )}
    </div>
  );
}
