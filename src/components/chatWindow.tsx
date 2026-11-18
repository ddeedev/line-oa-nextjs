"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageDirection,
  type ChatMessage,
} from "@/internals/store/conversation";

interface ChatWindowProps {
  messages: ChatMessage[];
  peerName: string;
  selfName?: string;
  onSend: (text: string) => void;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatWindow({
  messages,
  peerName,
  selfName = "You",
  onSend,
}: ChatWindowProps) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col font-[Tahoma,sans-serif] text-xs border-[#808080] bg-[#f1eeeb]">
      {/* MSN-style conversation transcript */}
      <div className="flex-1 overflow-y-auto m-2 mb-0 border border-[#7f9db9] bg-white p-2 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]">
        {messages.length === 0 ? (
          <p className="p-2 italic text-[#808080]">
            No messages yet. Say hello!
          </p>
        ) : (
          messages.map((message, index) => {
            // MSN groups consecutive messages under one "X says:" header
            const prev = messages[index - 1];
            const showHeader = !prev || prev.direction !== message.direction;
            const isIn = message.direction === MessageDirection.In;

            return (
              <div key={message.id} className="mb-1">
                {showHeader && (
                  <p className="mt-2 flex items-baseline gap-2 first:mt-0">
                    <span className="font-bold text-[#00136b]">
                      {isIn ? `${peerName} says:` : `${selfName} say:`}
                    </span>
                    <span className="text-[10px] text-[#808080]">
                      ({formatTime(message.timestamp)})
                    </span>
                  </p>
                )}
                <p className="pl-2 break-words whitespace-pre-wrap text-black">
                  {message.text}
                </p>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Message input bar */}
      <div className="flex items-center gap-2 p-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder={`Message ${peerName}...`}
          className="flex-1 border border-[#7f9db9] bg-white px-2 py-1.5 text-xs shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] outline-none placeholder:text-[#808080]"
        />
        <button
          onClick={send}
          disabled={!draft.trim()}
          className="flex h-[27px] items-center justify-center border border-white border-b-[#404040] border-r-[#404040] bg-[#ece9d8] px-4 font-bold text-black shadow-sm transition-colors active:translate-x-[1px] active:translate-y-[1px] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white active:bg-[#e4e1de] disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
