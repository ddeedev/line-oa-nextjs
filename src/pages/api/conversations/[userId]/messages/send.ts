import {
  addMessage,
  MessageDirection,
  type ChatMessage,
} from "@/internals/store/conversation";
import { pushMessage } from "@/third_party/line/api";
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthorized } from "@/internals/api/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // userId comes from the path, not the body
  const { userId } = req.query;
  if (typeof userId !== "string" || !userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  // Next already parses JSON bodies; only parse when we get a raw string
  let body: { messages?: Array<string> };
  try {
    body =
      typeof req.body === "string"
        ? (JSON.parse(req.body) as { messages?: Array<string> })
        : req.body;
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return res
      .status(502)
      .json({ message: `Failed to read request body ${detail}` });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return res.status(400).json({ message: "messages[] is required" });
  }

  // call push api first, only record on success
  try {
    await pushMessage(userId, body.messages);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return res.status(502).json({ message: `Failed to send message ${detail}` });
  }

  const sentMessage: Array<ChatMessage> = body.messages.map((text) =>
    addMessage(
      userId,
      { id: randomUUID(), type: "text", text },
      MessageDirection.Out,
      Date.now(),
    ),
  );

  return res.status(201).json({ message: sentMessage });
}
