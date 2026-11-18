import Avatar from "./avatar";
import { MessageDirection } from "@/internals/store/conversation";

interface ConversationSummary {
  displayName: string;
  pictureUrl?: string;
  unreadCount: number;
  lastMessage: {
    text: string;
    direction: MessageDirection;
    timestamp: number;
  };
  size?: number;
  isActive?: boolean; // dispaly chat slection
  onClick?: () => void;
}

export default function ConversationCard({
  displayName,
  pictureUrl,
  unreadCount,
  lastMessage,
  size = 36,
  isActive = false,
  onClick,
}: ConversationSummary) {
  return (
    // image -- name -- unreadCount
    // image -- lastMessage
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 px-2 py-1.5 cursor-pointer select-none font-[Tahoma,sans-serif] text-xs border border-transparent transition-colors ${
        isActive
          ? "bg-[#316ac5] text-white border-dotted border-black" // XP selected item style (Classic Blue highlight)
          : "hover:bg-[#f1edeb] active:bg-[#e4e1de]" // XP subtle hover list effect
      }`}
    >
      {/* image -- name */}
      <Avatar displayName={displayName} pictureUrl={pictureUrl} size={size} />

      {/* image -- lastMessage -- unreadCount*/}
      <div className="min-w-0 flex-1">
        {/* Name row */}
        <div className="flex items-baseline justify-between">
          <span
            className={`truncate font-bold ${isActive ? "text-white" : "text-[#00136b]"}`}
          >
            {displayName}
          </span>
        </div>

        {/* Last message and unread badge row */}
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span
            className={`truncate text-[11px] ${isActive ? "text-white/90" : "text-[#666666]"}`}
          >
            {lastMessage
              ? `${lastMessage.direction === MessageDirection.Out ? "You: " : ""}${lastMessage.text}`
              : "Start conversation"}
          </span>

          {unreadCount > 0 && (
            <span className="shrink-0 rounded-[3px] border border-[#003c74] bg-[#ffe794] px-1 py-px text-[10px] font-bold text-black shadow-sm">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
