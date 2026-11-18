# LINE OA · Next.js

## Feature Requirement

1. Able to send message to LINE OA (account)
2. Able to send message from LINE OA (webapp)
3. Preview User (end user) info and able to select which user to react or reply to conversation

## Task (TODO)

1. LINE Bussiness Account
   1.1 Create Line developer account
   1.2 Create Line bussisness account
2. Build web app to manage line official account
   2.1 List conversations
   2.2 Enter conversation
   2.3 User Metadata: user name, image, last message, read or unread
3. API Integration
   3.1 UserPrifile
   3.2 MarkAsReade
   3.3 Push Message

# APPENDIX

### Security note (POC)

The internal API key (`APP_API_KEY`) is bundled into the client, so the `x-api-key` check on `/api/conversations*` is not real protection — it only guards against casual misuse. For production, put the webapp behind real auth (e.g. LINE Login) and keep secrets server-side.

### API

<https://developers.line.biz/en/reference/messaging-api/>
<https://developers.line.biz/en/docs/messaging-api/line-bot-sdk/>
example from <https://github.com/line/line-bot-sdk-nodejs/blob/3fc50b884e3c3d44da9d5392a2ea8e57c2e00f93/lib/validate-signature.ts>

### UI

<https://github.com/charanjit-singh/windows95-shadcn>
<https://windows95-shadcn.vercel.app/>

## AI Usage

This session used [opencode](https://opencode.ai) (CLI coding agent) to accelerate UI development. Human decided what to build, reviewed the output, and kept ownership of architecture and requirements.

What AI did in this session:

1. **Mock data** — generated `src/internals/mocks/conversations.ts` (mock users, unread counts, last messages, message histories) and wired it into the sidebar using the existing `ConversationCard` component, adding click-to-select state
2. **Theme audit** — reviewed all components for XP/Luna theme consistency and reported that `chatWindow.tsx` was still an unstyled placeholder (plus minor font-stack inconsistencies)

What AI did NOT do: requirements, project structure, LINE API integration (`src/third_party/line`, webhook, in-memory store), the retro XP shell/theme design, and the chat window implementation (hand-written by the author; AI may review it later).

Verification: AI ran `tsc --noEmit` and `eslint` after each change; remaining lint findings were pre-existing.
