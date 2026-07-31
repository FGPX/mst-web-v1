# Musterring Demo Backup Plan

## Pre-meeting CMD sequence

Stop an existing development server with `Ctrl+C`, then run:

```cmd
cd /d C:\Users\Admin\Desktop\MST_WEB
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run dev
```

Keep that CMD window open. In a second CMD window:

```cmd
cd /d C:\Users\Admin\Desktop\MST_WEB
npm.cmd run e2e
npm.cmd run audit:routes
```

Open `http://localhost:3000/presentation`, click **Reset demo data**, and keep `/presentation`, `/search`, `/configurator/mr-2875`, `/room-composer`, `/my-musterring` and `/handover` in browser history.

## OpenAI unavailable

- Leave the development server running.
- The application automatically uses the local deterministic provider.
- Verify the presentation status does not claim real AI.
- Explain that the same validated schema and catalogue-grounding boundary remains active.

## Internet unavailable

- Continue locally; core routes, imported images, deterministic search, configuration, persistence and demo handover do not require internet.
- Do not open external Musterring source links or claim current retailer information.
- Use Room Composer rather than any external generated-image provider.

## Browser state corrupted

1. Return to `/presentation`.
2. Click **Reset demo data**.
3. Refresh once.
4. Relaunch the required demo.

The reset clears only presentation resources and search history. It preserves consent and application settings.

## Product image fails

- Refresh once to retry the local asset.
- Continue using another grounded product card.
- If several assets fail, use the product facts, configuration and project summary; do not substitute an unverified remote image during the meeting.

## Development server stops

In CMD:

```cmd
cd /d C:\Users\Admin\Desktop\MST_WEB
npm.cmd run dev
```

Wait for the localhost URL, refresh `/presentation`, then reset demo data.

## Route error

1. Return to `/presentation`.
2. Reset demo data.
3. Retry the launch button once.
4. Use the adjacent controlled journey if the route still fails.
5. Record the route and browser console error after the meeting; do not improvise claims.

## CRM, email, booking or map unavailable

- This is the expected concept state.
- Use the local handover review and demo confirmation.
- State that no live lead, email or appointment was delivered.
- Show the complete structured context that a production adapter would transmit.

## Final safety rule

Never clear all browser storage manually during the meeting. Use the presentation reset so settings and consent are retained and the curated state is restored consistently.
