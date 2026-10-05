// frustratedbox-web/app/icon.tsx
import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#050505",
        borderRadius: "8px",
        border: "1px solid #3f1418",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width="100%"
        height="100%"
        fill="none"
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
            <stop offset="0%" stop-color="#1c1917" />
            <stop offset="100%" stop-color="#0f0e0e" />
          </linearGradient>
          <linearGradient
            id="leftFace"
            x1="120"
            y1="210"
            x2="256"
            y2="416"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stop-color="#141416" />
            <stop offset="100%" stop-color="#09090b" />
          </linearGradient>
          <linearGradient
            id="rightFace"
            x1="392"
            y1="210"
            x2="256"
            y2="416"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stop-color="#0d0d0f" />
            <stop offset="100%" stop-color="#050505" />
          </linearGradient>

          <linearGradient
            id="crackGradient"
            x1="256"
            y1="110"
            x2="256"
            y2="410"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stop-color="#ff4d4d" />
            <stop offset="45%" stop-color="#dc2626" />
            <stop offset="100%" stop-color="#991b1b" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient
            id="burstCore"
            cx="256"
            cy="245"
            r="140"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stop-color="#dc2626" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#dc2626" stop-opacity="0" />
          </radialGradient>
        </defs>

        <circle cx="256" cy="245" r="130" fill="url(#burstCore)" />

        <polygon
          points="256,96 392,170 256,246 120,170"
          fill="url(#topFace)"
          stroke="#27272a"
          stroke-width="2.5"
          stroke-linejoin="round"
        />

        <polygon
          points="120,170 256,246 256,416 120,336"
          fill="url(#leftFace)"
          stroke="#27272a"
          stroke-width="2.5"
          stroke-linejoin="round"
        />

        <polygon
          points="256,246 392,170 392,336 256,416"
          fill="url(#rightFace)"
          stroke="#27272a"
          stroke-width="2.5"
          stroke-linejoin="round"
        />

        <line
          x1="256"
          y1="246"
          x2="256"
          y2="416"
          stroke="#1f1f23"
          stroke-width="2"
        />
        <line
          x1="120"
          y1="170"
          x2="256"
          y2="246"
          stroke="#27272a"
          stroke-width="2"
        />
        <line
          x1="392"
          y1="170"
          x2="256"
          y2="246"
          stroke="#1f1f23"
          stroke-width="2"
        />

        <g filter="url(#glow)">
          <path
            d="M 230 110 
             L 265 155 
             L 242 195 
             L 256 246 
             L 236 295 
             L 272 345 
             L 250 416"
            stroke="#ef4444"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <path
            d="M 242 195 
             L 185 225 
             L 150 255"
            stroke="#dc2626"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <path
            d="M 256 246 
             L 305 270 
             L 345 285"
            stroke="#dc2626"
            stroke-width="3.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <path
            d="M 236 295 
             L 180 325"
            stroke="#b91c1c"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </g>

        <path
          d="M 233 118 
           L 265 155 
           L 242 195 
           L 256 246 
           L 236 295 
           L 270 342 
           L 252 405"
          stroke="#ffffff"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity="0.9"
        />

        <polygon
          points="285,140 292,135 290,146"
          fill="#dc2626"
          opacity="0.85"
        />
        <polygon
          points="215,280 222,275 220,286"
          fill="#ef4444"
          opacity="0.9"
        />
        <polygon
          points="325,255 332,250 330,260"
          fill="#dc2626"
          opacity="0.75"
        />
      </svg>
    </div>,
    { ...size },
  );
}
