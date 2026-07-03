# AGENTS.md

Guidance for AI agents working in this repo. **ELITE** is a premium e-commerce
mobile app (footwear & accessories) built with Expo Router + NativeWind.

## Stack

- **Expo** `~56`, **React Native** `0.85`, **React** `19`
- **Expo Router** — file-based routing (`src/app/`)
- **NativeWind** + **Tailwind** `3.4` — styling via `className`
- **react-hook-form** + **zod** (`@hookform/resolvers`) — forms & validation
- **lucide-react-native** — icons
- **expo-image**, **expo-linear-gradient**, **expo-symbols**

## Commands

- `npm run start` / `ios` / `android` / `web` — start dev server
- `npm run lint` — ESLint + Prettier check (run before finishing a task)
- `npm run format` — ESLint `--fix` + Prettier `--write`

## Project structure

```
src/
  app/                  # Expo Router routes (headerless root Stack)
    (onboarding)/       # index (carousel) -> preferences
    (auth)/             # login, signup
    (tabs)/             # bottom tabs (Home)
  components/
    auth/               # header, externalLogin
    home/               # hero, categories, features, feature
    shared/             # inputController
    container.tsx       # SafeAreaView + ScrollView wrapper
  constants/theme.ts    # design tokens (source of truth)
  schema/auth.ts        # zod schemas
  mock/                 # categories, products
assets/                 # images + fonts, assets.ts registry
```

## Path aliases

- `@/*` -> `./src/*` (configured in `tsconfig.json`)
- `assets/...` resolves from repo root (e.g. `import { assets } from 'assets/assets'`)

## Design system

The single source of truth for design tokens is `src/constants/theme.ts`.
Tailwind's theme is **not** extended (`tailwind.config.js` is empty), so tokens
are consumed via imports from `theme.ts` (inline `style={...}`) — NOT via custom
Tailwind class names. Many current screens also hardcode hex values in
`className` (e.g. `bg-[#0058BE]`); prefer referencing tokens instead.

### Colors — `ElitePalette`

Raw palette. Access theme-mapped colors through `Colors.light` / `Colors.dark`.

| Token              | Hex        | Usage                          |
| ------------------ | ---------- | ------------------------------ |
| `primary`          | `#000000`  | Primary actions, text (black)  |
| `onPrimary`        | `#ffffff`  | Text/icons on primary          |
| `secondary`        | `#0058be`  | Accent / links / CTA blue      |
| `onSecondary`      | `#ffffff`  | Text on secondary              |
| `background`       | `#fcf8fa`  | App background                 |
| `surface`          | `#fcf8fa`  | Base surface                   |
| `surfaceLowest`    | `#ffffff`  | Cards / raised surfaces        |
| `onSurface`        | `#1b1b1d`  | Primary text                   |
| `onSurfaceVariant` | `#45464d`  | Secondary text (`#45464D`)     |
| `outline`          | `#76777d`  | Borders                        |
| `outlineVariant`   | `#c6c6cd`  | Subtle borders (`#C6C6CD`)     |
| `error`            | `#ba1a1a`  | Errors                         |
| `tabInactive`      | `#a6a0a5`  | Inactive tab icons             |
| `shadow`           | `rgba(15,23,42,0.08)` | Elevation shadows   |

`Colors` exposes a semantic `light` / `dark` map (e.g. `text`, `background`,
`primary`, `secondary`, `border`, `textSecondary`). A `dark` palette exists but
is currently unused (`app.json` sets `userInterfaceStyle: "light"`).

### Fonts — `Fonts`

Loaded in `src/app/_layout.tsx`, applied via `style={{ fontFamily: Fonts.x }}`.

- `germaniaOne` — brand/logo wordmark ("ELITE")
- `regularPlayfair` .. `blackItalicPlayfair` — Playfair Display display serif
- `blackGeist`, `boldGeist`, `semiBoldGeist` — Geist sans (body/headings)

### Spacing — `Spacing`

4px base unit. Key values: `containerPadding: 20`, `stackGapSm/Md/Lg`,
`sectionMargin: 48`.

### Radius — `Radius`

`sm: 4`, `md: 8`, `lg: 12`, `xl: 16`, `pill: 24`, `full: 999`.

### Typography — `Typography`

Preset text styles: `displayLg`, `headlineLg`, `titleMd`, `priceLg`, `bodyMd`,
`bodySm`, `labelCaps`.

### Layout constants

- `BottomTabInset` — per-platform bottom inset (iOS 92 / Android 88)
- `MaxContentWidth` — `1200`

## Conventions

- Screens/components wrap content in `Container` (`SafeAreaView` + `ScrollView`, `px-4`).
- Forms: `useForm` + `zodResolver` with schemas from `src/schema/`; render fields
  with `InputController` (label + `Controller` + `ErrorMessage`).
- Icons via `lucide-react-native`, colored with theme values.
- Images via `expo-image` sourced from the `assets` registry, never raw paths.
- Do **not** add comments unless asked; follow existing NativeWind class style.
- Prefer `theme.ts` tokens over hardcoded hex in `className`.

## Known gaps / WIP

- `(onboarding)/preferences.tsx` is a placeholder stub.
- Auth `onSubmit` handlers only `console.log` — no real auth/navigation yet.
- Only the `Home` tab is registered in `(tabs)/_layout.tsx`.
- Signup screen reuses the "Welcome Back" login header copy.
- `dark` color scheme is defined but not wired up.
