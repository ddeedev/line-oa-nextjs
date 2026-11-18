import { addMessage, MessageDirection } from "@/internals/store/conversation";
import { pushMessage } from "@/third_party/line/api";
import type { Message } from "@/third_party/line/message/types";
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { ChatMessage } from "@/internals/store/conversation";
import { APP_API_KEY } from "@/config/app";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == "GET") {
    return res.status(404);
  }

  const api_key = req.headers["x-api-key"] as string;
  if (!api_key) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (api_key != APP_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let body: {
    userId: string;
    messages: Array<string>;
  };

  // deserialize body
  try {
    body = JSON.parse(req.body) as {
      userId: string;
      messages: Array<string>;
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return res
      .status(502)
      .json({ message: `Failed to read request body ${detail}` });
  }

  // call push api
  try {
    await pushMessage(body.userId, body.messages);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return res.status(502).json({ message: `Faile to send message ${detail}` });
  }

  let sentMessage: Array<ChatMessage> = [];
  for (const msg of body.messages) {
    const chatMessage: Message = {
      id: randomUUID(),
      text: msg,
      type: "text",
    };

    sentMessage.push(
      addMessage(body.userId, chatMessage, MessageDirection.Out, Date.now()),
    );
  }

  return res.status(201).json({ message: sentMessage });
}
