# AI Assistant Privacy and Retention

- API keys and OpenAI calls remain server-side.
- Voice starts only after an explicit user action and browser permission.
- Typed input is available without microphone access.
- Current messages are held in React memory and disappear on reload/new conversation.
- Session storage retains only structured Product/material/project/configuration references, filters and approved preferences.
- Clear/New conversation deletes assistant session state.
- Preferences are not saved to My Musterring without an explicit confirmed action.
- Analytics records event names, routes and non-sensitive entity/action IDs only; full chat messages, transcripts and contact data are excluded.
- No assistant action automatically submits a retailer request, booking or personal data.
- The application does not use conversations or voice transcripts for model training.
- Server inputs/outputs are validated and a rate-limit abstraction is present. Production requires distributed rate limiting, DPIA/provider review and agreed retention.
