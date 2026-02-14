# Specification

## Summary
**Goal:** Make LioCollyVibeThunder installable as a PWA and add an in-app Help/Install screen that explains browser-based installation and clarifies store publishing expectations.

**Planned changes:**
- Add a dedicated Help / Install page reachable via an in-app route/link, with step-by-step installation instructions for iOS Safari and Android Chrome, plus a note explaining that App Store / Play Store publishing requires separate native packaging outside this web app build.
- Add PWA support by creating and linking a web app manifest, adding required HTML meta/link tags (including theme color and Apple install-related tags), and defining app metadata and icon entries for common sizes.
- Ensure generated brand images are present under `frontend/public/assets/generated` and are used in the UI (logo in the header and hero banner on the discovery page) without 404s.

**User-visible outcome:** Users can install the app from their mobile browser as a PWA, access an in-app page that explains how to install on iOS/Android, and see the correct logo and hero banner assets in the UI.
