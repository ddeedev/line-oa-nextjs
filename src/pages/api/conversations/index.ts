import type { NextApiRequest, NextApiResponse } from "next";
import { APP_API_KEY } from "@/config/app";
import { listConversations } from "@/internals/store/conversation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method != "POST") {
    return res.status(400).json({ message: "Bad request" });
  }

  const api_key = req.headers["x-api-key"] as string;
  if (!api_key) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (api_key != APP_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json({ conversations: listConversations() });
}
