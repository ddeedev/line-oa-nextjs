export const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
export const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
export const LINE_API_BASE_URL = "https://api.line.me";

// both of them must configured for using with webhook and login
export function configSuccess(): boolean {
  return !!LINE_CHANNEL_SECRET && !!LINE_CHANNEL_ACCESS_TOKEN;
}
