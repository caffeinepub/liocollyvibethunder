# Specification

## Summary
**Goal:** Allow users to upload valid audio files for Song Snippets even when the browser provides a missing or unreliable MIME type, while still blocking clearly non-audio files.

**Planned changes:**
- Update the Song Snippet upload validation in `frontend/src/pages/MyProfilePage.tsx` to accept files with empty/unknown `file.type` when the filename extension indicates a supported audio format.
- Configure the upload file picker to allow broad audio selection and include common audio extensions (.mp3, .wav, .m4a, .aac, .ogg, .flac, .webm).
- Keep rejection behavior for clearly non-audio files (e.g., .png, .pdf) with an English error message, and ensure accepted uploads call `publishSongSnippet` and appear in the snippets list with a playable `<audio>` control.

**User-visible outcome:** Users can select and upload common audio files for snippets even if their browser doesn’t report the correct MIME type, and the uploaded snippet shows up in the list and can be played back.
