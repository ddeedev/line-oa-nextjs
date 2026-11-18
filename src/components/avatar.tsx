"use client";

import { useState } from "react";

interface UserAvatarProps {
  displayName: string;
  pictureUrl?: string;
  size: number;
}

export default function Avatar({
  displayName,
  pictureUrl,
  size = 40,
}: UserAvatarProps) {
  const [failed, setFailed] = useState(false);
  // for invalid image
  const initial = displayName.charAt(0).toUpperCase() || "?";
  if (pictureUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={pictureUrl}
        alt={displayName}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white`}
      style={{ width: size, height: size, fontSize: size / 2.2 }}
    >
      {initial}
    </div>
  );
}
