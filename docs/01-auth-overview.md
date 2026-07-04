# 01 — Authentication Overview & Foundation

Shared architecture and building blocks that all other auth phases depend on.

## Goal

Establish the technical foundation for authentication:

- A correctly configured Supabase client with **secure, persistent** sessions.
- A single global **`AuthProvider`** exposing session/user state to the app.
- **Route protection**: unauthenticated users see `(auth)`, authenticated users
  see `(tabs)`, first-time users see `(onboarding)`.
- **Automatic session restoration** and token refresh so a logged-in user is
  never asked to sign in again unnecessarily.
- Deep-link (URL scheme) configuration required for email verification and OAuth.

## User flow (top level)

```
App launch
  │
  ├─ Load fonts + restore Supabase session (bootstrapping)
  │
  ├─ Session valid?  ──yes──▶ has completed onboarding? ──yes──▶ (tabs)
  │                                                      └─no───▶ (onboarding)
  │
  └─ no session ─────────────▶ (auth)/login
```

## Technical implementation steps

### 1. Dependencies

Confirm / add:

- `@supabase/supabase-js` (present)
- `expo-secure-store` (present) — encrypted key storage
- `expo-linking` (present) — deep links
- `expo-web-browser`, `expo-auth-session`, `expo-crypto` — **to add** (OAuth, phase 05)
- `@react-native-async-storage/async-storage` **or** keep the existing
  `expo-sqlite/localStorage` shim — decide one storage strategy (see step 3)

### 2. Environment & config

- Standardize env var names. Current client uses `EXPO_PUBLIC_SUPABASE_KEY`;
  align on `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  (or publishable key). Document in `.env.example`.
- Add an app URL **`scheme`** to `app.json` (e.g. `"scheme": "elite"`). Required
  by phases 03 and 05. Without it, deep links/OAuth redirects cannot resolve.

### 3. Supabase client (`src/utils/supabase.ts`)

Target auth config:

```
auth: {
  storage: <secure adapter>,   // see below
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,   // required on native
  flowType: 'pkce',            // recommended for mobile; needed for OAuth code exchange
}
```

Storage strategy — choose one and document the trade-off:

- **Option A (recommended): `LargeSecureStore`** — an adapter that encrypts the
  session with AES-256 (via `aes-js` + `react-native-get-random-values`), stores
  the AES key in `expo-secure-store` (2048-byte limit) and the ciphertext in
  AsyncStorage. Best security.
- **Option B: AsyncStorage only** — simpler, session stored unencrypted on device.
- **Option C: keep existing `expo-sqlite/localStorage`** — works today; verify it
  survives app restarts before relying on it.

### 4. Token auto-refresh on foreground

- Wire `AppState` so `supabase.auth.startAutoRefresh()` runs when the app is
  `active` and `stopAutoRefresh()` when backgrounded. Prevents stale tokens.

### 5. Auth context (`src/context/auth.tsx` or `src/providers/AuthProvider.tsx`)

- Holds `session`, `user`, `loading` (bootstrapping) state.
- On mount: call `supabase.auth.getSession()` to hydrate, then subscribe with
  `supabase.auth.onAuthStateChange((event, session) => ...)`.
- Unsubscribe on unmount.
- Expose helpers: `signOut()`, plus phase-specific actions can live in a service
  layer (`src/services/auth.ts`).

### 6. Routing guard

- Mount `AuthProvider` in `src/app/_layout.tsx`, wrapping the `Stack`.
- Use a guard (either in root layout via `useEffect` + `router.replace`, or a
  `(protected)` layout group) that redirects based on `session` and onboarding
  status.
- Keep the splash screen visible until `getSession()` resolves to avoid a flash
  of the login screen.

### 7. Service layer (`src/services/auth.ts`)

- Thin wrappers: `signUpWithEmail`, `signInWithEmail`, `signInWithGoogle`,
  `verifyEmailOtp`, `signOut`, `getCurrentSession`.
- Centralizes Supabase calls and error normalization (see error handling below).

## Supabase configuration

- **Auth → URL Configuration**: set **Site URL** and the **Redirect URL allow
  list**. Add the app scheme redirect(s) used by phases 03/05
  (e.g. `elite://auth-callback`, `elite://verify`).
- **Auth → Providers → Email**: keep "Confirm email" enabled (drives phase 03).
- **Auth → Providers → Google**: configured in phase 05.
- Decide on **PKCE flow** project-wide (matches client `flowType: 'pkce'`).

## Expo / React Native considerations

- `detectSessionInUrl: false` is mandatory on native (there is no browser URL).
- `app.json` `scheme` must match redirect URLs registered in Supabase.
- Dev vs prod: Expo Go uses `exp://` deep links; a dev/production build uses the
  custom scheme. Document both redirect URIs in Supabase.
- SecureStore only works on device/simulator, not web — branch storage adapter
  by `Platform.OS` if web support is needed.
- Keep secrets out of the repo; only `EXPO_PUBLIC_*` (publishable) keys ship to
  the client. Never embed the service-role key.

## Edge cases

- App launched with no network → `getSession()` should still restore a cached
  session; show offline-tolerant UI.
- Corrupted/undecryptable stored session → treat as logged out, clear storage.
- Token refresh fails (revoked/expired refresh token) → sign out gracefully and
  route to login.
- User signs out on one screen while another screen holds stale state → rely on
  `onAuthStateChange` as the single source of truth.
- Onboarding completion flag missing → default to showing onboarding.

## Error handling

- Centralize a `mapAuthError(error)` util that converts Supabase `AuthError`
  codes/messages into user-friendly copy (used by all phases).
- Never surface raw Supabase messages directly to users.
- Log unexpected errors (non-user errors) for diagnostics without leaking PII.

## Testing checklist

- [ ] Fresh install → no session → lands on `(auth)/login`.
- [ ] After login, kill & relaunch app → session restored, lands on `(tabs)`.
- [ ] Session persists across app restart (storage adapter verified).
- [ ] Token auto-refreshes after expiry when app returns to foreground.
- [ ] `signOut()` clears session and routes to login everywhere.
- [ ] Splash stays until bootstrapping completes (no login flash).
- [ ] Works with airplane mode on (cached session still restores).

## Definition of Done (DoD)

- Supabase client configured with secure storage, `autoRefreshToken`,
  `persistSession`, `detectSessionInUrl: false`, and `flowType: 'pkce'`.
- `app.json` has a `scheme`; matching redirect URLs added to Supabase allow list.
- `AuthProvider` provides `session`, `user`, `loading`, `signOut`.
- Root layout restores session before rendering and guards routes correctly.
- `AppState` auto-refresh wired.
- `mapAuthError` util exists and is used by the service layer.
- All items in the testing checklist pass.
