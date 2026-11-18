import {
  getConversation,
  markAsRead as storeMarkAdRead,
  MessageDirection,
} from "@/internals/store/conversation";
import { markAsRead } from "@/third_party/line/api";
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

  // markAsReadToken only exists on inbound (user) messages
  const token = getConversation(userId)?.message
    .slice()
    .reverse()
    .find(
      (m) => m.direction === MessageDirection.In && m.markAsReadToken,
    )?.markAsReadToken;

  if (token) {
    try {
      await markAsRead(token);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(502)
        .json({ message: `Failed to mark as read ${detail}` });
    }
  }

  storeMarkAdRead(userId);

  return res.status(200).json({ ok: true });
}
