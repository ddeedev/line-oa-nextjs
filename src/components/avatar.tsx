"use client";

import { useState } from "react";

interface UserAvatarProps {
  displayName: string;
  pictureUrl?: string;
  size?: number;
}

export default function Avatar({
  displayName,
  pictureUrl,
  size = 40,
}: UserAvatarProps) {
  const [failed, setFailed] = useState(false);
  // for invalid image
  const initial = displayName.charAt(0).toUpperCase() || "?";

  // Classic XP glossy Luna blue gradient & 3D beveled frame
  const xpFrameStyle: React.CSSProperties = {
    width: size,
    height: size,
    boxShadow:
      "inset 1px 1px 0px rgba(255, 255, 255, 0.85), inset -1px -1px 0px rgba(0, 48, 156, 0.7), 1px 1px 2px rgba(0, 0, 0, 0.35)",
  };

  if (pictureUrl && !failed) {
    return (
      <div
        className="shrink-0 overflow-hidden rounded-[4px] border border-[#003c74] bg-[#ece9d8] p-[2px]"
        style={xpFrameStyle}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pictureUrl}
          alt={displayName}
          width={size}
          height={size}
          onError={() => setFailed(true)}
          className="h-full w-full rounded-[2px] border border-[#808080]/50 object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="flex shrink-0 select-none items-center justify-center rounded-[4px] border border-[#003c74] bg-gradient-to-b from-[#7ba2e7] via-[#245edb] to-[#1941a5] font-bold text-white"
      style={{
        ...xpFrameStyle,
        fontSize: size / 2.1,
        fontFamily: "Tahoma, 'Segoe UI', sans-serif",
        textShadow: "1px 1px 1px rgba(0, 0, 0, 0.65)",
      }}
    >
      {initial}
    </div>
  );
}
