import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import ChatWindow from "@/components/chatWindow";
import ConversationCard from "@/components/conversationCard";
import { configSuccess } from "@/config/app";
import { useCallback, useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const initConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/config-status");
      const data = await res.json();
      setConfigured(data.configured);
    } catch (error) {
      setConfigured(false);
    }
  }, []);

  useEffect(() => {
    initConfig();
  }, [initConfig]);

  return (
    <div className="flex h-dvh overflow-hidden bg-zinc-100 text-zinc-900">
      <aside className="flex w-80 shrink-0 flex-col border-r border-zinc-200 bg-white md:w-96">
        <header className="flex items-center gap-3 border-b border-zinc-200 px-4 py-4">
          {/* TODO:: change them later maybe xd */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#06C755]">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 fill-white"
              aria-hidden="true"
            >
              <path d="M12 3C6.98 3 3 6.36 3 10.5c0 2.34 1.24 4.42 3.19 5.82-.13.86-.55 2.2-1.62 3.36 0 0 2.5-.28 4.53-1.75.95.22 1.92.32 2.9.32 5.02 0 9-3.36 9-7.5S17.02 3 12 3z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold">LINE OA Webchat</h1>
            <p className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span
                className={`inline-block h-2 w-2 rounded-full ${configured === false ? "bg-amber-500" : "bg-emerald-500"}`}
              />
              {configured === null
                ? "conntecting..."
                : configured
                  ? "online"
                  : "offline"}
            </p>
          </div>
        </header>
      </aside>
    </div>
  );
}
