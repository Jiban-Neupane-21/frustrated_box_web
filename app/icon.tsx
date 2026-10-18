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
        backgroundColor: "#000000",
        borderRadius: "7px",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="140 150 220 200"
        width="26"
        height="26"
        fill="none"
      >
        {/* Back bubble */}
        <path
          d="M300 194 C335 194 350 215 350 240 V258 C350 280 340 305 323 333 L296 312 L252 298"
          stroke="#ff1a1a"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Front bubble body (Black fill behind it) */}
        <path
          d="M190 164 H262 A38 38 0 0 1 300 202 V234 A38 38 0 0 1 262 272 H238 L178 300 L192 267 Q152 255 152 234 V202 A38 38 0 0 1 190 164 Z"
          fill="#000000"
          stroke="#ff1a1a"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Angry Eyebrows */}
        <path
          d="M184 192 L214 206 M268 192 L238 206"
          stroke="#ff1a1a"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Eyes */}
        <circle cx="204" cy="222" r="10" fill="#ff1a1a" />
        <circle cx="248" cy="222" r="10" fill="#ff1a1a" />

        {/* Zigzag mouth */}
        <path
          d="M202 252 L214 244 L226 252 L238 244 L250 252"
          stroke="#ff1a1a"
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    { ...size },
  );
}
