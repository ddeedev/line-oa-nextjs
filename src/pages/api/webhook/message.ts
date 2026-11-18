import { LINE_CHANNEL_SECRET } from "@/config/app";
import { LineWebhookEvent } from "@/third_party/line/message/types";
import { validateSignature } from "@/third_party/line/message";
import {
  addMessage,
  ensureRecord,
  MessageDirection,
} from "@/internals/store/conversation";
import { getUserProfile } from "@/third_party/line/api";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";

// Disable Next.js default body parser so we can get the raw body string for signature validation
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(readable: Readable): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

type IncommingEvent = {
  events?: LineWebhookEvent[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // TODO:: remove later
  console.log(`Incomming hook: Method: ${req.method},  Body: ${req.body}`);
  // just for healthcheck
  if (req.method == "GET") {
    return res.status(200).json({ ok: true });
  }

  if (req.method != "POST") {
    return res.status(400).json({ message: "Bad request" });
  }

  if (req.body) {
    let rawBody: string;
    try {
      rawBody = await getRawBody(req);
    } catch (error) {
      return res.status(400).json({ message: "Failed to read request body" });
    }

    const lineSignature = req.headers["x-line-signature"] as string;

    if (!lineSignature) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //varify signature and early panic
    try {
      const validated = validateSignature(
        rawBody,
        LINE_CHANNEL_SECRET!,
        lineSignature,
      );

      if (!validated) return res.status(400).json({ message: "Bad Request" });
    } catch (error) {
      return res.status(500).json({ message: "Panic: Verify signature" });
    }

    let events: LineWebhookEvent[];

    // deserialize body
    try {
      const pasred = JSON.parse(rawBody) as IncommingEvent;
      events = pasred.events ?? [];
    } catch (error) {
      return res.status(400).json({ message: "Bad Request" });
    }

    // same as for ... range in go
    // filter only event type messga for this POC
    for (const e of events) {
      if (e.type == "message") {
        const userId = e.source?.userId;
        if (!userId || !e.message) continue;
        const userProfile = await getUserProfile(userId);
        // init or upate user record
        ensureRecord(userId, userProfile ?? undefined);

        // update user conversation
        const text =
          e.message.type == "text" ? (e.message.text ?? "") : e.message.type;

        //
        e.message.text = text;

        addMessage(userId, e.message, MessageDirection.In, e.timestamp!);
      }
    }
  }

  return res.status(200).json({ ok: true });
}
