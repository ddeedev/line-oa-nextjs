import { getConversation } from "@/internals/store/conversation";
import { markAsRead } from "@/third_party/line/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { markAsRead as storeMarkAdRead } from "@/internals/store/conversation";
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

  let body: { userId: string };

  // deserialize body
  try {
    body = JSON.parse(req.body) as { userId: string };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return res
      .status(502)
      .json({ message: `Failed to read request body ${detail}` });
  }

  // get user conversatio
  const convo = getConversation(body.userId);
  let readkey: string | undefined;

  if (convo) {
    readkey =
      convo.message.length > 0
        ? convo.message[convo.message.length - 1].markAsReadToken
        : undefined;
  }

  if (!readkey) {
    return res.status(502).json({ message: `Faile to mark read messages` });
  }

  // call push api
  try {
    await markAsRead(readkey);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return res.status(502).json({ message: `Faile to read message ${detail}` });
  }

  storeMarkAdRead(body.userId);

  return res.status(201).json({ ok: true });
}
