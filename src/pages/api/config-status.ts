import { configSuccess } from "@/config/app"; // Assuming this checks server-side env vars
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({ configured: configSuccess() });
}
