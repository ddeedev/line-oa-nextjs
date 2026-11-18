import type { NextApiRequest, NextApiResponse } from "next";
import { listConversations } from "@/internals/store/conversation";
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

  return res.status(200).json({ conversations: listConversations() });
}
