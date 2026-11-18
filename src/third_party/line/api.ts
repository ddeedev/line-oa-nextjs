import { LINE_API_BASE_URL, LINE_CHANNEL_ACCESS_TOKEN } from "@/config/app";
import { UserProfile } from "./user/types";

function buildHeader(): Headers {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`);
  return headers;
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  const headers = buildHeader();
  try {
    const res = await fetch(
      `${LINE_API_BASE_URL}/v2/bot/profile/${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: headers,
      },
    );

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as UserProfile;
    return data;
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Cannot get user profile ${detail}`);
  }
}

// push aka send messages to user
export async function pushMessage(
  userId: string,
  messages: Array<string>,
): Promise<void> {
  let toSend: Array<{ type: string; text: string }> = [];

  for (const msg of messages) {
    toSend.push({
      text: msg,
      type: "text",
    });
  }

  const jsonBody = {
    to: userId,
    messages: toSend,
  };
  const headers = buildHeader();
  try {
    const res = await fetch(`${LINE_API_BASE_URL}/v2/bot/message/push`, {
      headers: headers,
      body: JSON.stringify(jsonBody),
    });

    if (!res.ok) {
      throw new Error("Cannot send message to user");
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Cannot send message to user ${detail}`);
  }
}

/*curl -v -X POST https://api.line.me/v2/bot/chat/markAsRead \
-son' \
-H 'Authorization: Bearer {channel access token}' \
-d '{
  "markAsReadToken": "{mark as read token}"
*/
export async function markAsRead(token: string): Promise<void> {
  const headers = buildHeader();
  const jsonBody = {
    markAsReadToken: token,
  };

  try {
    const res = await fetch(`${LINE_API_BASE_URL}/v2/bot/chat/markAsRead`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(jsonBody),
    });

    if (!res.ok) {
      throw new Error("MarkAsRead faild");
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`MarkAsRead faild ${detail}`);
  }
}
