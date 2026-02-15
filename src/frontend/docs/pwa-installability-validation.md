# PWA Installability Validation Checklist

This document tracks the validation of PWA installability requirements for LioCollyVibeThunder.

## Prerequisites Checklist

### Manifest & Icons
- [ ] `/manifest.webmanifest` returns valid JSON (HTTP 200)
- [ ] `/assets/pwa/icon-192x192.png` resolves successfully (HTTP 200)
- [ ] `/assets/pwa/icon-512x512.png` resolves successfully (HTTP 200)
- [ ] `/assets/pwa/apple-touch-icon-180x180.png` resolves successfully (HTTP 200)
- [ ] Manifest contains valid `name`, `short_name`, `start_url`, `display: standalone`
- [ ] Manifest icons array references correct paths with proper sizes and types

### iOS Safari Validation
- [ ] Apple touch icon meta tag present in `index.html`
- [ ] `apple-mobile-web-app-capable` meta tag set to "yes"
- [ ] `apple-mobile-web-app-status-bar-style` meta tag configured
- [ ] App launches in standalone mode (no Safari UI) when added to home screen
- [ ] App icon appears correctly on iOS home screen

### Android Chrome Validation
- [ ] Browser shows "Install app" or "Add to Home screen" option in menu
- [ ] Native install prompt appears when criteria are met
- [ ] In-app Install CTA triggers native prompt successfully
- [ ] App installs to home screen with correct icon and name
- [ ] App launches in standalone mode (no browser UI)

### In-App Install Flow
- [ ] Install CTA button appears in header when not installed
- [ ] Install CTA hidden/removed when app is in standalone mode
- [ ] On Android Chrome: Install CTA triggers native prompt
- [ ] On iOS Safari: Install CTA routes to `/help` page with instructions
- [ ] Success toast appears after successful installation (Android)

## Validation Results

### Test Date: [YYYY-MM-DD]
**Tester:** [Name]
**Device/Browser:** [e.g., iPhone 14 Pro / iOS 17.2 / Safari]

#### Results:
- Manifest accessible: ✅ / ❌
- Icons resolving: ✅ / ❌
- iOS standalone launch: ✅ / ❌ / N/A
- Android install prompt: ✅ / ❌ / N/A
- In-app CTA behavior: ✅ / ❌

**Notes:**
[Any issues, observations, or special conditions]

---

### Test Date: [YYYY-MM-DD]
**Tester:** [Name]
**Device/Browser:** [e.g., Samsung Galaxy S23 / Android 14 / Chrome 120]

#### Results:
- Manifest accessible: ✅ / ❌
- Icons resolving: ✅ / ❌
- iOS standalone launch: ✅ / ❌ / N/A
- Android install prompt: ✅ / ❌ / N/A
- In-app CTA behavior: ✅ / ❌

**Notes:**
[Any issues, observations, or special conditions]

---

## Sign-off

Once all checklist items are verified on both iOS Safari and Android Chrome, the build is ready for publication.

**Validated by:** ___________________  
**Date:** ___________________  
**Build Version:** ___________________
