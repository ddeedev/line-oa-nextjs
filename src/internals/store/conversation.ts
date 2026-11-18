import type { Message } from "@/third_party/line/message/types";
import type { UserProfile } from "@/third_party/line/user/types";

export enum MessageDirection {
  In,
  Out,
}

interface ChatMessage extends Message {
  direction: MessageDirection;
  timestamp: number;
}

export interface ConversationOveriew {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  unreadCount: number;
  lastMessage: ChatMessage;
}

export interface ConversationRecord extends UserProfile {
  unreadCount: number;
  message: Array<ChatMessage>;
}

// prisma-like to store in momory storate
// use globalThis so data can servives in dev-mode
const globalForStore = globalThis as unknown as {
  conversationStore: Map<string, ConversationRecord> | undefined;
};

const converstaions: Map<string, ConversationRecord> =
  globalForStore.conversationStore ?? new Map<string, ConversationRecord>();

// so i dont ahve to implement class converstaions
globalForStore.conversationStore = converstaions;

// util func
// retrieve or create new instanse
export function ensureRecord(
  userId: string,
  profile?: Partial<UserProfile>,
): ConversationRecord {
  let existing = converstaions.get(userId);

  // update user info
  if (existing) {
    if (profile?.pictureUrl !== undefined) {
      existing.pictureUrl = profile.pictureUrl;
    }
    if (profile?.displayName) {
      existing.displayName = profile.displayName;
    }

    return existing;
  }

  const newRecord: ConversationRecord = {
    userId,
    displayName: profile?.displayName ?? userId,
    pictureUrl: profile?.pictureUrl ?? userId,
    unreadCount: 0,
    message: [],
  };

  converstaions.set(userId, newRecord);
  return newRecord;
}

// append text message to user hash map also update lastMessage and unreade count
export function addMessage(
  userId: string,
  message: Message,
  direction: MessageDirection,
  timestamp: number,
): ChatMessage {
  // get existing record
  let record = ensureRecord(userId);

  if (direction == MessageDirection.In) {
    // *mut record.unreadCount += 1
    // record is mutable
    record.unreadCount += 1;
  }

  const newMessage: ChatMessage = {
    timestamp,
    direction,
    ...message,
  };

  record.message.push(newMessage);

  return newMessage;
}

export function getConversation(
  userId: string,
): ConversationRecord | undefined {
  return converstaions.get(userId);
}

// must sync with markAsRead enpoint of line biz
export function markAsRead(userId: string): void {
  let record = converstaions.get(userId);
  if (record) record.unreadCount = 0;
}
