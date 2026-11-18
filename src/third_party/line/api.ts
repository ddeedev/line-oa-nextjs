import {
  LINE_API_BASE_URL,
  LINE_CHANNEL_SECRET,
  LINE_CHANNEL_ACCESS_TOKEN,
} from "@/config/app";
import { UserProfile } from "./user/types";
import { headers } from "next/headers";

/*
async function fetchWithHeaders(url: string): Promise<Response> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  const requestOptions = {
    method: 'GET',
    headers: headers
  };

  const response = await fetch(url, requestOptions);
  if (!response.ok) {
    throw new Error('The server resoundingly rebuked our headers: ' + response.statusText);
  }
  return response;
}
*/

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
    throw new Error("Cannot get user profile");
  }
}

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
    throw new Error("Cannot send message to user");
  }
}
