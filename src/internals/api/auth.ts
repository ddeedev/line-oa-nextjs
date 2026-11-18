import { APP_API_KEY } from "@/config/app";
import type { NextApiRequest } from "next";

// POC auth: shared key between webapp client and internal API
export function isAuthorized(req: NextApiRequest): boolean {
  const apiKey = req.headers["x-api-key"];
  return typeof apiKey === "string" && apiKey === APP_API_KEY;
}
