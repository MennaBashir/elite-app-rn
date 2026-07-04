# 02 — Sign Up (Email & Password)

Depends on: [`01-auth-overview.md`](./01-auth-overview.md)

## Goal

Let a new user create an account with **full name, email, and password**,
validate their input client-side, submit to Supabase, handle all error states,
and route them into the email-verification flow (phase 03).

## User flow

```
Signup screen
  │  user enters full name, email, password, accepts terms
  ▼
Submit ──▶ client validation (zod)
  │           └─ invalid ─▶ inline field errors, stay on screen
  ▼ valid
supabase.auth.signUp({ email, password, options })
  │
  ├─ error ─▶ show mapped error message (e.g. "email already registered")
  │
  └─ success
        │
        ├─ email confirmation ENABLED (our case)
        │     └─▶ navigate to "Check your email" screen (phase 03)
        │
        └─ email confirmation DISABLED
              └─▶ session returned → route to (tabs)
```

## Technical implementation steps

1. **Screen**: reuse `src/app/(auth)/signup.tsx`. Fix the header copy (currently
   shows the login "Welcome Back" text) to signup-specific copy.
2. **Form**: keep `react-hook-form` + `zodResolver(registerSchema)` from
   `src/schema/auth.ts` (`fullName`, `email`, `password`, `checked`).
   - Strengthen the password rule if desired (min length, complexity).
   - Consider trimming/normalizing email (lowercase).
3. **Service call** (`src/services/auth.ts` → `signUpWithEmail`):
   - `supabase.auth.signUp({ email, password, options: { emailRedirectTo, data: { full_name } } })`.
   - Pass `full_name` via `options.data` so it is stored in `user_metadata`.
   - `emailRedirectTo` = the app deep link defined in phase 03.
4. **Submit handler** in the screen:
   - Set a `submitting` state to disable the button + show a spinner.
   - On success with confirmation enabled → `router.replace` to the
     "check your email" screen, passing the email.
   - On error → surface via a form-level error banner and/or field error.
5. **Store profile row (optional, later phase)**: if a `profiles` table is
   introduced, insert/upsert the profile after first successful session. For
   Phase 1, `user_metadata.full_name` is sufficient.

## Supabase configuration

- **Auth → Providers → Email → Confirm email = ON** (defines the flow above).
- **Auth → URL Configuration**: `emailRedirectTo` value must be in the redirect
  allow list (shared with phase 03).
- Optionally configure **minimum password length** in Auth settings to match the
  client zod rule.
- Be aware of Supabase's built-in **email rate limits** on the default SMTP;
  production should configure a custom SMTP provider.

## Expo / React Native considerations

- `signUp` returns `{ data: { user, session }, error }`. With confirmation ON,
  `session` is `null` until the user verifies — do **not** treat signup as login.
- Keep the terms checkbox (`checked`) enforced by zod before enabling submit.
- Use `KeyboardAvoidingView`/scroll so the password field isn't hidden by the
  keyboard.
- Disable autocorrect/autocapitalize on the email field; set
  `keyboardType="email-address"` and `textContentType` appropriately.

## Edge cases

- **Email already registered**: Supabase may return a generic response (to avoid
  user enumeration) or an error depending on settings. Plan copy for both: "If
  this email exists, check your inbox" vs explicit "already registered".
- User taps submit multiple times → guard with `submitting` flag / disabled button.
- Whitespace-only or mixed-case email → normalize before sending.
- Weak password rejected by Supabase even if it passed client rules → show mapped
  error.
- User backgrounds the app mid-request → ensure the promise resolution still
  updates state safely (avoid setState on unmounted component).
- Network failure → distinguish "no connection" from "server error" in messaging.

## Error handling

Map common Supabase auth errors to friendly copy via `mapAuthError`:

| Condition | User message |
| --------- | ------------ |
| Invalid email format (server) | "Please enter a valid email address." |
| Weak password | "Password doesn't meet the minimum requirements." |
| Email already in use | "An account with this email already exists." |
| Rate limited (429) | "Too many attempts. Please try again in a bit." |
| Network / offline | "You appear to be offline. Check your connection." |
| Unknown | "Something went wrong. Please try again." |

- Show field-level errors for validation, a banner for request-level errors.

## Testing checklist

- [ ] Empty/invalid fields show correct inline zod errors.
- [ ] Terms unchecked blocks submission.
- [ ] Valid new signup → navigates to "check your email" screen.
- [ ] Duplicate email → correct, non-enumerating message.
- [ ] `full_name` appears in `user_metadata` in Supabase dashboard.
- [ ] Button disabled + spinner shown while request is in flight.
- [ ] Offline submit → offline error, no crash.
- [ ] Rapid double-tap does not create duplicate requests.

## Definition of Done (DoD)

- `signUpWithEmail` service implemented and used by `signup.tsx`.
- Signup header copy corrected (no leftover login text).
- `full_name` persisted to `user_metadata`; `emailRedirectTo` set.
- All error states mapped and displayed appropriately.
- Loading/disabled states implemented.
- Successful signup routes into the phase-03 verification screen.
- Testing checklist passes.
