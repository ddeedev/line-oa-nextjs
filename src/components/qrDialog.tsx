"use client";

import { useEffect, useState } from "react";

interface QrDialogProps {
  open: boolean;
  onClose: () => void;
  url: string;
  imagePath?: string;
}

export default function QrDialog({
  open,
  onClose,
  url,
  imagePath = "/images/qrcode.png",
}: QrDialogProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 font-[Tahoma,sans-serif] select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-80 flex-col overflow-hidden border-2 border-[#00136b] bg-[#ece9d8] shadow-[2px_2px_10px_rgba(0,0,0,0.4)] rounded-t-[6px]"
      >
        {/* Titlebar */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#0055ea] via-[#1c80ff] to-[#0042c6] px-2 py-1 text-white">
          <span className="text-xs font-bold tracking-wide drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
            Add Friend - LINE OA
          </span>
          <button
            onClick={onClose}
            className="flex h-4 w-4 items-center justify-center bg-[#ece9d8] text-[9px] font-bold text-black border border-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:translate-x-[1px] active:translate-y-[1px]"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center gap-3 px-4 py-4">
          <p className="text-xs text-[#404040]">
            Scan this code to add us as a friend.
          </p>

          <div
            className="shrink-0 overflow-hidden rounded-[4px] border border-[#003c74] bg-white p-[2px]"
            style={{
              boxShadow:
                "inset 1px 1px 0px rgba(255, 255, 255, 0.85), inset -1px -1px 0px rgba(0, 48, 156, 0.7), 1px 1px 2px rgba(0, 0, 0, 0.35)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePath}
              alt={url}
              width={220}
              height={220}
              className="block"
            />
          </div>

          <p className="max-w-full truncate font-mono text-[11px] text-[#00136b]">
            {url}
          </p>

          <div className="flex justify-end gap-2 self-stretch">
            <button
              onClick={copyLink}
              className="flex h-[26px] items-center justify-center border border-white border-b-[#404040] border-r-[#404040] bg-[#ece9d8] px-4 text-xs font-bold text-black shadow-sm active:translate-x-[1px] active:translate-y-[1px] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white active:bg-[#e4e1de]"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <button
              onClick={onClose}
              className="flex h-[26px] items-center justify-center border border-white border-b-[#404040] border-r-[#404040] bg-[#ece9d8] px-4 text-xs font-bold text-black shadow-sm active:translate-x-[1px] active:translate-y-[1px] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white active:bg-[#e4e1de]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
