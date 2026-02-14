# Specification

## Summary
**Goal:** Deliver a mobile-first MVP for LioCollyVibeThunder that supports Internet Identity sign-in, artist profiles + collaborator discovery, lyrics creation/editing with basic rhyme/templates tools, audio capture (voice notes) and uploads (snippets), and direct messaging—under a consistent non-blue/purple visual theme.

**Planned changes:**
- Build a mobile-first UI shell with a consistent visual theme applied across all pages (distinct non-blue/purple primary palette).
- Add Internet Identity sign-in/sign-out and session-aware UI that gates create/edit actions while allowing limited browsing.
- Backend: implement persistent artist profile models with CRUD and query-by-genre/tag.
- Frontend: create profile create/edit, profile view, and collaborator discovery with genre/tag filtering.
- Backend: implement persistent lyrics CRUD scoped to the signed-in principal, with title/timestamps/optional tags and list sorted by updated time.
- Frontend: add a mobile-optimized lyric editor and a lyrics library with basic search/filter plus visible save feedback.
- Frontend: add song templates picker (insert into editor) and a local-only basic rhyme suggestion tool (bundled word list + suffix matching) with clear “approximate” messaging.
- Add voice note recording via MediaRecorder with record/playback/naming and persistence; enforce UI size/time limits aligned to canister constraints.
- Add song snippet uploads with title/description/genres and publishing to user profile; enforce file size/length limits in the UI; enable playback on profiles.
- Implement direct messaging: backend persistence for conversations/messages; frontend inbox, conversation view, and composer (start from another artist’s profile), store-and-fetch only.

**User-visible outcome:** On mobile, users can sign in with Internet Identity, create and discover artist profiles by genre/tag, write and manage lyrics with templates and basic rhyme suggestions, record and save voice notes, upload and publish short audio snippets to their profile, and message other creators through an inbox and conversation screens.
