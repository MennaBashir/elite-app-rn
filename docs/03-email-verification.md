# 03 — Email Verification

Depends on: [`01-auth-overview.md`](./01-auth-overview.md),
[`02-sign-up.md`](./02-sign-up.md)

## Goal

Confirm ownership of the user's email after signup: send a verification email,
handle the confirmation **deep link back into the Expo app**, detect verification
status, recover from expired/invalid links, and define the UX before and after
verification.

## User flow

```
After signup (session = null, email unconfirmed)
  │
  ▼
"Check your inbox" screen  ── shows email, Resend button, Open-mail hint
  │
  │  user opens email on device, taps "Confirm email"
  ▼
Supabase confirmation URL ──▶ redirects to app deep link
  (elite://auth-callback?token_hash=...&type=signup   OR   ...#access_token=...)
  │
  ▼
App deep-link handler parses params
  │
  ├─ PKCE / token_hash:  supabase.auth.verifyOtp({ type, token_hash })
  ├─ implicit tokens:    supabase.auth.setSession({ access_token, refresh_token })
  │
  ├─ success ─▶ session established ─▶ route to (tabs)
  └─ failure ─▶ "Link expired/invalid" screen with Resend option
```

## Technical implementation steps

1. **"Check your email" screen** (`src/app/(auth)/verify-email.tsx`):
   - Receives the email as a param; displays it.
   - **Resend** button → `supabase.auth.resend({ type: 'signup', email })` with a
     cooldown timer (e.g. 30–60s) to respect rate limits.
   - Optional: poll `getSession()` / rely on `onAuthStateChange` to auto-advance
     if verification happens on the same device.
2. **Deep-link configuration**:
   - Add `scheme` to `app.json` (phase 01).
   - Define a callback route, e.g. `src/app/auth-callback.tsx` (or handle via
     `Linking.useURL()` in the root layout).
3. **Deep-link handler**:
   - Use `expo-linking` (`Linking.useURL()` / `getInitialURL()`) to capture the
     URL that opened the app (cold start **and** warm start).
   - Parse params using `expo-auth-session/build/QueryParams` `getQueryParams(url)`
     (handles both query string and hash fragment).
   - If `token_hash` + `type` present → `verifyOtp({ type, token_hash })`.
   - If `access_token` + `refresh_token` present (implicit) → `setSession(...)`.
4. **Post-verification routing**: on success, `onAuthStateChange` fires with a
   session → the phase-01 guard routes to `(tabs)`.
5. **Status detection helpers**:
   - `user.email_confirmed_at` (or `confirmed_at`) indicates a verified email.
   - Expose an `isEmailVerified` derived value in the auth context if needed.

## Supabase configuration

- **Auth → Providers → Email → Confirm email = ON**.
- **Auth → URL Configuration**:
  - **Site URL**: a sensible default.
  - **Redirect allow list**: add the app deep links, e.g.
    `elite://auth-callback`, and the Expo Go dev variant (`exp://.../--/auth-callback`).
- **Email template (Confirm signup)**: ensure the action link uses the
  `token_hash` + `type` pattern that matches `verifyOtp`
  (`{{ .ConfirmationURL }}` or a custom `.../verify?token_hash=...&type=signup`).
- Confirm **link expiry** duration (default ~24h) and communicate it in the UX.
- Configure **custom SMTP** for production to avoid default rate limits.

## Expo / React Native considerations

- Handle **both** cold start (`getInitialURL`) and running app
  (`Linking` event listener / `useURL`).
- Expo Go vs standalone build have different scheme prefixes — register both
  redirect URLs in Supabase, and derive the redirect with
  `AuthSession.makeRedirectUri()` where possible so it matches the runtime.
- `detectSessionInUrl: false` on native means we must **manually** parse the URL
  and call `verifyOtp`/`setSession`.
- Some email clients open links in an in-app browser; ensure the redirect
  ultimately hits the app scheme. Test on both iOS and Android.

## Edge cases

- **Expired link** → `verifyOtp` returns error → show "Link expired" screen with
  Resend.
- **Already-used / already-confirmed link** → detect and route to login or home
  gracefully ("Your email is already verified").
- **Invalid/tampered token** → generic "This link is invalid" message.
- **Verification on a different device** than signup → the signup device should
  still eventually reflect verified state on next `getSession`/login.
- **Link opened but app not installed** (standalone) → fallback web page /
  universal link behavior (document as future work if not supported).
- **Multiple resend taps** → enforce cooldown; handle 429.
- **Deep link received before `AuthProvider` is ready** → queue/handle after
  bootstrapping.

## Error handling

| Condition | User message / action |
| --------- | --------------------- |
| Expired token | "This verification link has expired." + Resend |
| Invalid token | "This link is invalid or already used." |
| Already verified | "Your email is already verified." → go to login/home |
| Resend rate limited (429) | "Please wait before requesting another email." |
| Network error during verify | "Couldn't verify right now. Try again." |

## Testing checklist

- [ ] Signup sends a confirmation email.
- [ ] Tapping the link opens the app (cold start).
- [ ] Tapping the link opens the app (already running).
- [ ] Successful verification establishes a session and routes to `(tabs)`.
- [ ] Expired link shows the expired state + working Resend.
- [ ] Invalid/used link shows the invalid state.
- [ ] Resend respects cooldown and handles rate limiting.
- [ ] Works on both iOS and Android.
- [ ] Works in Expo Go (dev) and a standalone/dev build.
- [ ] `email_confirmed_at` reflects verification.

## Definition of Done (DoD)

- "Check your email" screen implemented with Resend + cooldown.
- App scheme + redirect URLs configured in `app.json` and Supabase.
- Deep-link handler parses both PKCE (`token_hash`) and implicit token formats.
- Verification establishes a session and routes correctly.
- Expired/invalid/already-verified states handled with clear UX.
- Tested on iOS and Android, cold and warm start.
- Testing checklist passes.
