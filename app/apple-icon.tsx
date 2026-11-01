import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff", borderRadius: 38 }}>
      <svg width="142" height="142" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#171715" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
          <path d="M135 78c-31 0-53 23-53 53v251c0 31 22 53 53 53h242c31 0 53-22 53-53V137c0-32-22-59-53-59H135" opacity=".35"/>
          <path d="M160 138v213c0 24 17 41 41 41h171c24 0 41-17 41-41V157c0-24-17-41-41-41H203"/>
          <path d="m214 224 42-35 43 35M214 272h91M214 317h63"/>
          <path d="m303 390 99-99 36 36-99 99-53 17 17-53Z"/>
          <path d="m387 306 36 36"/>
        </g>
      </svg>
    </div>,
    size
  );
}
