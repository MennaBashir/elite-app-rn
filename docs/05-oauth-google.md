# 05 — OAuth: Sign in with Google

Depends on: [`01-auth-overview.md`](./01-auth-overview.md)

## Goal

Let users authenticate with **Google** via Supabase OAuth, using Expo's
`WebBrowser` + `AuthSession` for the redirect, handle the deep-link callback,
distinguish new vs existing users, and handle all error/cancel states.

> Scope note: **Google only** this phase. The Apple button in `ExternalLogin`
> stays visually present but is out of scope.

## User flow

```
Login/Signup screen ──▶ tap "Continue with Google"
  │
  ▼
supabase.auth.signInWithOAuth({ provider: 'google', options:{ redirectTo, skipBrowserRedirect:true } })
  │  returns an authorization URL
  ▼
WebBrowser.openAuthSessionAsync(url, redirectTo)
  │  user authenticates with Google in the system web view
  ▼
Redirect back to app deep link (elite://auth-callback?code=... [PKCE])
  │
  ▼
Parse params (expo-auth-session QueryParams)
  │
  ├─ PKCE:      supabase.auth.exchangeCodeForSession(code)
  ├─ implicit:  supabase.auth.setSession({ access_token, refresh_token })
  │
  ├─ success ─▶ session established
  │               ├─ new user  ─▶ (optionally) onboarding / profile completion
  │               └─ existing  ─▶ (tabs)
  │
  ├─ user cancelled (result.type !== 'success') ─▶ no-op, return to screen
  └─ error ─▶ mapped error message
```

## Technical implementation steps

1. **Dependencies to add**: `expo-web-browser`, `expo-auth-session`,
   `expo-crypto` (PKCE). Ensure `expo-linking` (present) is available.
2. **App scheme**: `app.json` `scheme` (phase 01) — required for `redirectTo`.
3. **Warm up browser** (optional perf): `WebBrowser.warmUpAsync()` on mount,
   `coolDownAsync()` on unmount; call `WebBrowser.maybeCompleteAuthSession()` at
   module top level.
4. **Redirect URI**: build with
   `AuthSession.makeRedirectUri({ scheme: 'elite', path: 'auth-callback' })` so it
   adapts to Expo Go (`exp://`) vs standalone (`elite://`).
5. **Service call** (`src/services/auth.ts` → `signInWithGoogle`):
   - `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo, skipBrowserRedirect: true, queryParams: { prompt: 'consent', access_type: 'offline' } } })`.
   - `access_type: 'offline'` + `prompt: 'consent'` so Google returns a refresh
     token.
   - Open the returned `data.url` with `WebBrowser.openAuthSessionAsync(url, redirectTo, { showInRecents: true })`.
6. **Handle the callback**:
   - Read `result.url` (or the deep-link URL); parse with
     `QueryParams.getQueryParams(url)`.
   - PKCE: `supabase.auth.exchangeCodeForSession(code)`.
   - Implicit fallback: `supabase.auth.setSession({ access_token, refresh_token })`.
7. **Wire buttons**: connect `ExternalLogin`'s Google button to
   `signInWithGoogle`; add loading state.
8. **New vs existing user detection**:
   - Compare `user.created_at` vs `last_sign_in_at`, or check for the presence of
     a profile row / metadata to decide whether to route to onboarding.
   - For Phase 1, routing all successful OAuth users to `(tabs)` is acceptable;
     document the new-user branch for later.

## Supabase configuration

- **Google Cloud Console**:
  - Create an OAuth 2.0 **Web application** client.
  - **Authorized redirect URIs**: add the Supabase callback
    `https://<project-ref>.supabase.co/auth/v1/callback`.
  - Copy the **Client ID** and **Client Secret**.
- **Supabase → Auth → Providers → Google**: enable it, paste Client ID + Secret.
- **Supabase → Auth → URL Configuration**: add the app redirect(s) to the allow
  list, e.g. `elite://auth-callback` (plus Expo Go dev variant). Wildcards like
  `elite://**` are acceptable if needed.
- Ensure project **PKCE flow** matches the client `flowType: 'pkce'` (phase 01).

## Expo / React Native considerations

- `WebBrowser.maybeCompleteAuthSession()` must be called (module scope) so the
  auth session completes when redirected back.
- Use `openAuthSessionAsync` (not `openBrowserAsync`) — it returns the redirect
  URL and supports the auth session lifecycle.
- Expo Go vs standalone: `makeRedirectUri` handles the difference; register both
  in Supabase.
- Google does **not** return a refresh token by default → include
  `access_type: 'offline'` and `prompt: 'consent'`.
- Test on real iOS and Android devices; simulators can behave differently with
  system browsers.

## Edge cases

- **User cancels** the Google screen → `result.type === 'cancel'/'dismiss'` →
  silently return, no error banner.
- **Redirect mismatch** (URL not in allow list) → Supabase rejects → show error;
  usually a config bug, log it.
- **Account linking**: a Google email that matches an existing email/password
  account — behavior depends on Supabase's "link identities" setting; document
  expected outcome.
- **No refresh token** (missing `access_type`) → session can't refresh long-term;
  ensure params are set.
- **Deep link arrives after screen unmounts** → handle via a global listener /
  the phase-01 callback route.
- **Browser fails to open** / no default browser → catch and show fallback error.
- **Interrupted flow** (app backgrounded mid-auth) → `openAuthSessionAsync`
  resolves with a non-success type; treat as cancel.

## Error handling

| Condition | Handling |
| --------- | -------- |
| User cancelled | No error UI; return to previous screen |
| Redirect/config error | "Couldn't sign in with Google. Please try again." + log |
| Code exchange failed | "Sign-in failed. Please try again." |
| Provider disabled / misconfigured | Generic error + log (dev-facing) |
| Network error | "You appear to be offline." |

## Testing checklist

- [ ] Tapping Google opens the system web view.
- [ ] Completing Google auth returns to the app and establishes a session.
- [ ] Cancelling the flow returns to the screen with no error.
- [ ] New Google user creates an account (visible in Supabase → Auth → Users).
- [ ] Existing Google user logs straight in.
- [ ] Session persists across app restart (auto-login).
- [ ] Refresh token present (verify long-lived session / offline access).
- [ ] Works on iOS and Android real devices.
- [ ] Works in Expo Go (dev) and standalone/dev build.
- [ ] Redirect URLs correctly allow-listed (no redirect_uri_mismatch).

## Definition of Done (DoD)

- Required Expo packages installed; `maybeCompleteAuthSession()` called.
- Google provider configured in Supabase with Cloud Console client + secret.
- App scheme + redirect URLs configured and allow-listed.
- `signInWithGoogle` implemented (PKCE `exchangeCodeForSession`, implicit
  fallback) and wired to the Google button with loading state.
- New-vs-existing routing behavior documented (and basic routing works).
- Cancel and error states handled without crashes.
- Testing checklist passes.
