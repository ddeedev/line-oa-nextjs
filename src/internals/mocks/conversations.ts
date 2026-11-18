import {
  MessageDirection,
  type ChatMessage,
  type ConversationOveriew,
} from "@/internals/store/conversation";

export interface MockConversation extends ConversationOveriew {
  messages: ChatMessage[];
}

// TODO: replace with real data from conversation store API
const now = Date.now();
const MIN = 1000 * 60;

function msg(
  id: string,
  text: string,
  direction: MessageDirection,
  minutesAgo: number,
): ChatMessage {
  return {
    id,
    type: "text",
    text,
    quoteToken: `mock-quote-${id}`,
    direction,
    timestamp: now - minutesAgo * MIN,
  };
}

export const mockConversations: MockConversation[] = [
  {
    userId: "U1234567890abcdef",
    displayName: "hamdee",
    pictureUrl: "/images/asa.jpg",
    unreadCount: 0,
    messages: [
      msg(
        "1-1",
        "Hello! Is this the LINE OA support?",
        MessageDirection.In,
        60,
      ),
      msg(
        "1-2",
        "Hi hamdee! Yes, how can I help you today?",
        MessageDirection.Out,
        58,
      ),
      msg(
        "1-3",
        "I want to ask about my order #12345",
        MessageDirection.In,
        55,
      ),
      msg(
        "1-4",
        "Sure, one moment please. Let me check.",
        MessageDirection.Out,
        52,
      ),
      msg("1-5", "Thank you!", MessageDirection.In, 50),
      msg(
        "1-6",
        "Your order has been shipped and will arrive tomorrow.",
        MessageDirection.Out,
        45,
      ),
      msg("1-7", "See you tomorrow!", MessageDirection.Out, 5),
    ],
    lastMessage: msg("1-7", "See you tomorrow!", MessageDirection.Out, 5),
  },
  {
    userId: "U2345678901abcdef",
    displayName: "Somchai",
    unreadCount: 2,
    messages: [
      msg("2-1", "สวัสดีครับ มีอะไรให้ช่วยไหมครับ", MessageDirection.Out, 1440),
      msg(
        "2-2",
        "สวัสดีครับ ผมสั่งสินค้าไปเมื่อวานนี้ครับ",
        MessageDirection.In,
        35,
      ),
      msg("2-3", "คุณส่งของให้ผมได้เลยไหมครับ", MessageDirection.In, 32),
    ],
    lastMessage: msg(
      "2-3",
      "คุณส่งของให้ผมได้เลยไหมครับ",
      MessageDirection.In,
      32,
    ),
  },
  {
    userId: "U3456789012abcdef",
    displayName: "LINE Official Account",
    unreadCount: 12,
    messages: [
      msg(
        "3-1",
        "You have a new login attempt from Chrome on Windows.",
        MessageDirection.In,
        182,
      ),
      msg("3-2", "Your verification code is 4821", MessageDirection.In, 181),
      msg("3-3", "This code expires in 10 minutes.", MessageDirection.In, 180),
    ],
    lastMessage: msg(
      "3-3",
      "This code expires in 10 minutes.",
      MessageDirection.In,
      180,
    ),
  },
  {
    userId: "U4567890123abcdef",
    displayName: "Ploy",
    unreadCount: 0,
    messages: [
      msg(
        "4-1",
        "ได้รับของแล้วค่ะ สินค้าสวยมากเลยค่ะ",
        MessageDirection.In,
        1560,
      ),
      msg("4-2", "ยินดีที่ให้บริการค่ะ", MessageDirection.Out, 1550),
      msg("4-3", "ขอบคุณค่ะ 🙏", MessageDirection.In, 1540),
    ],
    lastMessage: msg("4-3", "ขอบคุณค่ะ 🙏", MessageDirection.In, 1540),
  },
];
