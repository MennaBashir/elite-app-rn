# Authentication Module — Engineering Plan

This directory contains the phased implementation plan for the **Authentication
module** of the ELITE app (React Native + Expo Router + Supabase).

> **Status:** Planning only. No implementation code is written yet. These
> documents are the source of truth for building the auth module step by step.

## Scope of Phase 1 — Authentication Foundation

| # | Document | Feature |
| - | -------- | ------- |
| 01 | [`01-auth-overview.md`](./01-auth-overview.md) | Architecture, shared foundation (Supabase client, session, storage, auth context, routing guards) |
| 02 | [`02-sign-up.md`](./02-sign-up.md) | Email + password registration, validation, error handling |
| 03 | [`03-email-verification.md`](./03-email-verification.md) | Email confirmation, deep links, verification status |
| 04 | [`04-login.md`](./04-login.md) | Email + password login, session persistence, auto-login |
| 05 | [`05-oauth-google.md`](./05-oauth-google.md) | Google sign-in via Supabase OAuth + Expo AuthSession |

## How to read this plan

1. Start with **01 — Overview**. It defines the shared building blocks
   (Supabase client config, `AuthProvider`, session storage, route protection)
   that every other phase depends on.
2. Phases **02 → 05** each stand alone but assume the foundation from 01 exists.
3. Each document follows the same structure:
   - **Goal**
   - **User flow**
   - **Technical implementation steps**
   - **Supabase configuration**
   - **Expo / React Native considerations**
   - **Edge cases**
   - **Error handling**
   - **Testing checklist**
   - **Definition of Done (DoD)**

## Current codebase snapshot (starting point)

- Supabase client already exists at `src/utils/supabase.ts` (uses
  `expo-sqlite/localStorage`, `autoRefreshToken`, `persistSession`).
- Env vars referenced: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_KEY`.
- Zod schemas exist at `src/schema/auth.ts` (`loginSchema`, `registerSchema`).
- Auth screens exist under `src/app/(auth)/` (`login.tsx`, `signup.tsx`) but
  `onSubmit` handlers only `console.log` — **no real auth yet**.
- `ExternalLogin` component (`src/components/auth/externalLogin.tsx`) renders
  Google + Apple buttons but they are not wired.
- `expo-linking` and `expo-secure-store` are already installed.
- `app.json` has **no `scheme`** yet (required for deep links / OAuth redirects).

## Out of scope for Phase 1

- Password reset / forgot password flow
- Apple sign-in (button exists but not implemented this phase)
- Phone / OTP auth
- Multi-factor authentication (MFA)
- Role-based access control beyond basic session gating
- Account deletion / profile management

These will be planned in later phases.
