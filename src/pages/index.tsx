"use client";

import ChatWindow from "@/components/chatWindow";
import Avatar from "@/components/avatar";
import ConversationCard from "@/components/conversationCard";
import { useCallback, useEffect, useState } from "react";
import {
  type ConversationOveriew,
  type ChatMessage,
} from "@/internals/store/conversation";
import { APP_API_KEY } from "@/config/app";

function buildInternalHeader(): Headers {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("x-api-key", `${APP_API_KEY}`);
  return headers;
}

export default function Home() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [conversations, setConversations] = useState<
    Array<ConversationOveriew>
  >([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  // derive instead of duplicating state; stays fresh on every poll
  const activeConversation =
    conversations.find((c) => c.userId === activeUserId) ?? conversations[0];

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

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        cache: "no-store",
        headers: buildInternalHeader(),
      });

      if (!res.ok) return;
      const data = (await res.json()) as {
        conversations: ConversationOveriew[];
      };
      setConversations(data.conversations);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Unknown error";
      console.log(`Failed load conversations: ${detail}`);
    }
  }, []);

  // heavy load all conversations
  useEffect(() => {
    const initial = setTimeout(loadConversations, 0);
    const timer = setInterval(loadConversations, 3000);
    return () => {
      clearTimeout(initial);
      clearInterval(timer);
    };
  }, [loadConversations]);

  const handleSelect = useCallback((userId: string) => {
    setActiveUserId(userId);

    // optimistic mark as read, server syncs with LINE
    setConversations((prev) =>
      prev.map((c) => (c.userId === userId ? { ...c, unreadCount: 0 } : c)),
    );

    fetch(`/api/conversations/${userId}/messages/read`, {
      method: "POST",
      headers: buildInternalHeader(),
    }).catch((error) => {
      const detail = error instanceof Error ? error.message : "Unknown error";
      console.log(`Failed to mark as read: ${detail}`);
    });
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      if (!activeConversation) return;
      const userId = activeConversation.userId;

      try {
        const res = await fetch(`/api/conversations/${userId}/messages/send`, {
          method: "POST",
          headers: buildInternalHeader(),
          body: JSON.stringify({ messages: [text] }),
        });

        if (!res.ok) return;
        const data = (await res.json()) as { message: ChatMessage[] };
        const sent = data.message;
        if (sent.length === 0) return;

        // merge locally, next poll confirms from the server
        setConversations((prev) =>
          prev.map((c) =>
            c.userId === userId
              ? {
                  ...c,
                  messages: [...c.messages, ...sent],
                  lastMessage: sent[sent.length - 1],
                }
              : c,
          ),
        );
      } catch (error) {
        const detail = error instanceof Error ? error.message : "Unknown error";
        console.log(`Failed to send message: ${detail}`);
      }
    },
    [activeConversation],
  );

  const getStatusInfo = () => {
    if (configured === null) {
      return { dot: "bg-zinc-400 animate-pulse", text: "connecting..." };
    }
    if (configured === true) {
      return { dot: "bg-emerald-500", text: "online" };
    }
    return { dot: "bg-amber-500", text: "offline (missing config)" };
  };

  const status = getStatusInfo();

  return (
    <div className="flex h-dvh overflow-hidden bg-[#ece9d8] text-black font-[Tahoma,sans-serif] select-none">
      {/* Outer Retro Window Container */}
      <div className="flex m-2 md:m-4 flex-1 overflow-hidden border-2 border-[#00136b] bg-[#ece9d8] shadow-[2px_2px_10px_rgba(0,0,0,0.4)] rounded-t-[6px] flex-col">
        {/* Retro XP Window Titlebar */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#0055ea] via-[#1c80ff] to-[#0042c6] px-2 py-1 text-white shadow-inner">
          <div className="flex items-center gap-2">
            {/* Tiny retro app icon */}
            <div className="flex h-4 w-4 items-center justify-center bg-[#06C755] text-[10px] font-bold rounded-[2px] shadow-sm">
              L
            </div>
            <span className="text-xs font-bold tracking-wide drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
              LINE_OA_Messenger.exe - [Conversations]
            </span>
          </div>

          {/* XP Window Control Buttons (Minimize, Maximize, Close) */}
          <div className="flex items-center gap-[3px]">
            <button className="flex h-4 w-4 items-center justify-center bg-[#ece9d8] text-black text-[9px] font-bold border border-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:translate-x-[1px] active:translate-y-[1px]">
              _
            </button>
            <button className="flex h-4 w-4 items-center justify-center bg-[#ece9d8] text-black text-[9px] font-bold border border-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:translate-x-[1px] active:translate-y-[1px]">
              □
            </button>
            <button className="flex h-4 w-4 items-center justify-center bg-[#ece9d8] text-black text-[9px] font-bold border border-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:translate-x-[1px] active:translate-y-[1px]">
              ✕
            </button>
          </div>
        </div>

        {/* Main Application Workspace (Split Pane) */}
        <div className="flex flex-1 overflow-hidden bg-white border-t border-white">
          {/* Sidebar / Contact List Panel */}
          <aside className="flex w-80 shrink-0 flex-col border-r border-[#808080] bg-[#f1eeeb]">
            <header className="flex items-center gap-3 border-b border-[#dfdcd7] bg-[#ece9d8] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <div className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-[#003c74] bg-[#06C755] shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-white"
                  aria-hidden="true"
                >
                  <path d="M12 3C6.98 3 3 6.36 3 10.5c0 2.34 1.24 4.42 3.19 5.82-.13.86-.55 2.2-1.62 3.36 0 0 2.5-.28 4.53-1.75.95.22 1.92.32 2.9.32 5.02 0 9-3.36 9-7.5S17.02 3 12 3z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-xs font-bold text-[#00136b]">
                  LINE OA Webchat
                </h1>
                <p className="flex items-center gap-1.5 text-[11px] text-[#404040]">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${status.dot}`}
                  />
                  {status.text}
                </p>
              </div>
            </header>

            {/* Simulated contact list container with sunken XP border */}
            <div className="flex-1 overflow-y-auto bg-white m-2 border border-[#7f9db9] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] p-1">
              {conversations.map((conversation) => (
                <ConversationCard
                  key={conversation.userId}
                  displayName={conversation.displayName}
                  pictureUrl={conversation.pictureUrl}
                  unreadCount={conversation.unreadCount}
                  lastMessage={
                    conversation.lastMessage ? conversation.lastMessage : null
                  }
                  isActive={conversation.userId === activeConversation?.userId}
                  onClick={() => handleSelect(conversation.userId)}
                />
              ))}
            </div>
          </aside>

          {/* Active Chat Main Panel */}
          <main className="flex min-w-0 flex-1 flex-col bg-white">
            <header className="flex items-center gap-3 border-b border-[#dfdcd7] bg-[#ece9d8] px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <Avatar
                displayName={activeConversation?.displayName ?? "?"}
                pictureUrl={activeConversation?.pictureUrl}
                size={40}
              />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-xs font-bold text-[#00136b]">
                  {activeConversation?.displayName ??
                    "No conversation selected"}
                </h2>
                <p className="truncate font-mono text-[10px] text-[#666]">
                  {activeConversation?.userId ?? "-"}
                </p>
              </div>
            </header>

            {/* Chat content container */}
            <div className="flex-1 overflow-hidden bg-white">
              {activeConversation ? (
                <ChatWindow
                  messages={activeConversation.messages}
                  peerName={activeConversation.displayName}
                  onSend={handleSend}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs italic text-[#808080]">
                  No active conversations loaded...
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Retro Window Status Bar at the bottom */}
        <footer className="flex items-center justify-between bg-[#ece9d8] px-2 py-0.5 border-t border-[#808080] text-[11px] text-[#404040]">
          <span>Ready</span>
          <span className="border-l border-r border-[#808080] px-2">UTF-8</span>
        </footer>
      </div>
    </div>
  );
}
