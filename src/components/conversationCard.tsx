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
  size: number;
}

// for list conversation list or history
export default function ConversationCard({
  displayName,
  pictureUrl,
  unreadCount,
  lastMessage,
  size = 40,
}: ConversationSummary) {
  return (
    // image -- name -- unreadCount
    // image -- lastMessage
    <div>
      {/* image -- name */}
      <Avatar displayName={displayName} pictureUrl={pictureUrl} size={size} />
      <div className="min-w-0 flex-1">
        {/* image -- lastMessage -- unreadCount*/}
        <div className="flix items-baseline justify-between">
          <span className="truncate text-sm font-semibold">{displayName}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-gray-800">
            {lastMessage
              ? `${lastMessage.direction === MessageDirection.Out ? "you: " : ""}${lastMessage.text}`
              : "start conversation"}
          </span>
          {unreadCount > 0 && (
            <span className="shrink-0 rounded-full bg-gray-800 px-1.5 py-0.5 text-[11px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
