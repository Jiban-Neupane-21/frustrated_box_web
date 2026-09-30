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
      <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
        <polygon
          points="50,14 84,32 50,50 16,32"
          fill="#1c1917"
          stroke="#3f3f46"
          strokeWidth="3"
        />
        <polygon
          points="16,32 50,50 50,86 16,68"
          fill="#09090b"
          stroke="#3f3f46"
          strokeWidth="3"
        />
        <polygon
          points="50,50 84,32 84,68 50,86"
          fill="#140a0c"
          stroke="#5a181d"
          strokeWidth="3"
        />
        {/* Glowing Red Crack */}
        <path
          d="M 50 50 L 62 58 L 56 66 L 72 73 L 64 81 L 68 86"
          stroke="#ef4444"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    { ...size },
  );
}
