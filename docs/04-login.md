# 04 — Login (Email & Password), Session Persistence & Auto-Login

Depends on: [`01-auth-overview.md`](./01-auth-overview.md)

## Goal

Authenticate returning users with email + password, validate input, handle
errors, **persist the session** across app restarts, and **auto-login** when a
valid session already exists so the login screen is skipped.

## User flow

```
App launch ──▶ (phase 01) getSession()
  │
  ├─ valid session ─▶ auto-login ─▶ (tabs)   [login screen never shown]
  │
  └─ no session ─▶ Login screen
                     │ enter email + password
                     ▼
                   Submit ──▶ zod validation
                     │           └─ invalid ─▶ inline errors
                     ▼ valid
                   supabase.auth.signInWithPassword({ email, password })
                     │
                     ├─ error ─▶ mapped message (invalid creds / unconfirmed / rate limited)
                     └─ success ─▶ session stored ─▶ route to (tabs)
```

## Technical implementation steps

1. **Screen**: `src/app/(auth)/login.tsx`.
   - **Fix existing bug**: it imports `useRoute` from `expo-router` and calls
     `router.navigate('/(tabs)/index')`. Replace with `useRouter()` and
     `router.replace('/(tabs)')`. (Navigation currently fails.)
2. **Form**: `react-hook-form` + `zodResolver(loginSchema)` (`email`, `password`).
   - Normalize email (trim + lowercase).
3. **Service call** (`src/services/auth.ts` → `signInWithEmail`):
   - `supabase.auth.signInWithPassword({ email, password })`.
   - On success, the client persists the session automatically (phase-01 storage).
4. **Submit handler**:
   - `submitting` state disables button + shows spinner.
   - Success → let the phase-01 guard route on `onAuthStateChange`, or explicitly
     `router.replace('/(tabs)')`.
   - Error → banner with mapped message.
5. **Auto-login / session persistence**: handled by phase 01
   (`persistSession: true`, secure storage, `getSession()` on boot). This phase
   just verifies it works end-to-end for password logins.
6. **Sign out**: expose `signOut()` (from auth context) somewhere reachable
   (e.g. a temporary button/profile) to test the full loop.
7. **"Unconfirmed email" handling**: if login fails because the email isn't
   verified, offer to resend verification (links to phase 03).

## Supabase configuration

- **Auth → Providers → Email** enabled.
- If "Confirm email" is ON, unverified users **cannot** log in until verified —
  design copy accordingly.
- Review **rate limiting** settings for failed logins.
- No extra redirect URLs needed for password login (unlike OAuth/verification).

## Expo / React Native considerations

- Password field: `secureTextEntry`, with an optional show/hide toggle.
- Email field: `keyboardType="email-address"`, `autoCapitalize="none"`,
  `autoCorrect={false}`.
- `KeyboardAvoidingView` so inputs stay visible.
- Do not store the password anywhere; only the resulting session is persisted
  (encrypted, per phase 01).
- Ensure the splash screen stays until `getSession()` resolves so auto-login
  doesn't flash the login screen.

## Edge cases

- **Wrong password / unknown email** → generic "invalid credentials" (avoid
  revealing which field is wrong).
- **Unconfirmed email** → specific path offering resend verification.
- **Expired/invalid stored session on launch** → silently fall back to login.
- **Refresh token revoked** (e.g. password changed elsewhere) → sign out + login.
- **Rapid repeated submits** → guard with `submitting`.
- **Offline** → clear offline message; do not clear existing valid session.
- **Autofill / password managers** → ensure fields have correct `textContentType`.

## Error handling

| Condition | User message |
| --------- | ------------ |
| Invalid credentials | "Incorrect email or password." |
| Email not confirmed | "Please verify your email first." + Resend action |
| Rate limited (429) | "Too many attempts. Try again shortly." |
| Network / offline | "You appear to be offline." |
| Unknown | "Something went wrong. Please try again." |

- Field-level errors for zod validation; banner for auth/request errors.

## Testing checklist

- [ ] Invalid email/short password → inline zod errors.
- [ ] Valid credentials → session created, routes to `(tabs)`.
- [ ] Wrong password → generic invalid-credentials message.
- [ ] Unconfirmed account → verify-email prompt with working resend.
- [ ] Kill & relaunch after login → auto-login into `(tabs)`, no login screen.
- [ ] Session survives cold start (persistence verified).
- [ ] `signOut()` returns user to login and clears session.
- [ ] Login button disabled + spinner during request.
- [ ] Offline login attempt → offline message, existing session untouched.
- [ ] The pre-existing `useRoute`/navigation bug is fixed.

## Definition of Done (DoD)

- `signInWithEmail` service implemented and wired into `login.tsx`.
- Login navigation bug fixed (`useRouter` + `router.replace('/(tabs)')`).
- Session persists across restarts; auto-login skips the login screen.
- All error states mapped, including the unconfirmed-email path.
- Loading/disabled states implemented.
- `signOut()` works end-to-end.
- Testing checklist passes.
