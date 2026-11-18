/*
  "message": {
 "id": "444573844083572737",
 "type": "text",
 "quoteToken": "q3Plxr4AgKd...",
 "markAsReadToken": "30yhdy232...",
 "text": "@All @example Good Morning!! (love)",
 "emojis": [
   {
     "index": 29,
     "length": 6,
     "productId": "5ac1bfd5040ab15980c9b435",
     "emojiId": "001"
   }
 ],
 */
export interface Message {
  id: string;
  type: string; // type :"text"
  text: string;
  quoteToken?: string;
  markAsReadToken?: string;
  emojis?: [unknown];
  mention?: unknown;
}

/*
 "source": {
    "type": "user",
    "userId": "U4af4980629..."
  }
"source": {
    "type": "group",
    "groupId": "Ca56f94637c...",
    "userId": "U4af4980629..."
  }
"source": {
    "type": "room",
    "roomId": "Ra8dbf4673c...",
    "userId": "U4af4980629..."
  }
 */
export interface MessageSource {
  type: string;
  userId: string;
  groupId?: string; // for group
  roomId?: string; // for line openchat มั้ง idk
}

export interface LineWebhookEvent {
  type: string;
  replyToken?: string;
  mode?: string;
  timestamp?: number;
  source?: MessageSource;
  webhookEventId?: string;
  deliveryContext?: {
    isRedelivery: boolean; // use false for this POC
  };
  message?: Message;

  // etc idc
  [key: string]: unknown;
}
