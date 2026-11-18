import { LINE_CHANNEL_SECRET } from "@/config/app";
import { LineWebhookEvent } from "@/third_party/line/message/types";
import { validateSignature } from "@/third_party/line/message";
import { NextResponse } from "next/server";
import {
  addMessage,
  ensureRecord,
  MessageDirection,
} from "@/internals/store/conversation";
import { getUserProfile } from "@/third_party/line/api";

type IncommingEvent = {
  events?: LineWebhookEvent[];
};

export async function POST(req: Request) {
  const rawBody = await req.text();

  const lineSignature = req.headers.get("x-line-signature");

  if (!lineSignature) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  //varify signature and early panic
  try {
    const validated = validateSignature(
      rawBody,
      LINE_CHANNEL_SECRET!,
      lineSignature,
    );

    if (!validated)
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { message: "Panic: Verify signature" },
      { status: 500 },
    );
  }

  let events: LineWebhookEvent[];

  // deserialize body
  try {
    const pasred = JSON.parse(rawBody) as IncommingEvent;
    events = pasred.events ?? [];
  } catch (error) {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }

  // same as for ... range in go
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
  // filter only event type messga for this POC

  return NextResponse.json({ ok: true }, { status: 200 });
}

// just for healthcheck
export async function GET() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
