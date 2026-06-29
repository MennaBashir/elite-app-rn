/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "../../global.css";
import { Platform } from "react-native";

export const ElitePalette = {
  surface: "#fcf8fa",
  surfaceDim: "#dcd9db",
  surfaceBright: "#fcf8fa",
  surfaceLowest: "#ffffff",
  surfaceLow: "#f6f3f5",
  surfaceContainer: "#f0edef",
  surfaceHigh: "#eae7e9",
  surfaceHighest: "#e4e2e4",
  onSurface: "#1b1b1d",
  onSurfaceVariant: "#45464d",
  inverseSurface: "#303032",
  inverseOnSurface: "#f3f0f2",
  outline: "#76777d",
  outlineVariant: "#c6c6cd",
  primary: "#000000",
  onPrimary: "#ffffff",
  primaryContainer: "#131b2e",
  secondary: "#0058be",
  onSecondary: "#ffffff",
  secondaryContainer: "#2170e4",
  tertiary: "#000000",
  error: "#ba1a1a",
  background: "#fcf8fa",
  overlay: "rgba(27, 27, 29, 0.26)",
  overlayStrong: "rgba(27, 27, 29, 0.44)",
  shadow: "rgba(15, 23, 42, 0.08)",
  tabInactive: "#a6a0a5",
} as const;

export const Colors = {
  light: {
    text: ElitePalette.onSurface,
    background: ElitePalette.background,
    backgroundElement: ElitePalette.surfaceContainer,
    backgroundSelected: ElitePalette.surfaceHigh,
    textSecondary: ElitePalette.onSurfaceVariant,
    primary: ElitePalette.primary,
    onPrimary: ElitePalette.onPrimary,
    secondary: ElitePalette.secondary,
    onSecondary: ElitePalette.onSecondary,
    error: ElitePalette.error,
    surface: ElitePalette.surface,
    surfaceLowest: ElitePalette.surfaceLowest,
    surfaceLow: ElitePalette.surfaceLow,
    surfaceHigh: ElitePalette.surfaceHigh,
    surfaceHighest: ElitePalette.surfaceHighest,
    border: ElitePalette.surfaceHighest,
    outline: ElitePalette.outline,
    outlineVariant: ElitePalette.outlineVariant,
    overlay: ElitePalette.overlay,
    overlayStrong: ElitePalette.overlayStrong,
    shadow: ElitePalette.shadow,
    tabInactive: ElitePalette.tabInactive,
  },
  dark: {
    text: "#f3f0f2",
    background: "#151517",
    backgroundElement: "#232326",
    backgroundSelected: "#303032",
    textSecondary: "#bdb8bc",
    primary: "#f3f0f2",
    onPrimary: "#151517",
    secondary: "#8bb8ff",
    onSecondary: "#0d223f",
    error: "#ff8b82",
    surface: "#1b1b1d",
    surfaceLowest: "#2a2a2d",
    surfaceLow: "#232326",
    surfaceHigh: "#303032",
    surfaceHighest: "#45464d",
    border: "#45464d",
    outline: "#8f9097",
    outlineVariant: "#45464d",
    overlay: "rgba(0, 0, 0, 0.24)",
    overlayStrong: "rgba(0, 0, 0, 0.48)",
    shadow: "rgba(0, 0, 0, 0.32)",
    tabInactive: "#a5a0a5",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  germaniaOne: "GermaniaOne-Regular",
  regularPlayfair: "PlayfairDisplay-Regular",
  italicPlayfair: "PlayfairDisplay-Italic",
  mediumPlayfair: "PlayfairDisplay-Medium",
  mediumItalicPlayfair: "PlayfairDisplay-MediumItalic",
  semiBoldPlayfair: "PlayfairDisplay-SemiBold",
  semiBoldItalicPlayfair: "PlayfairDisplay-SemiBoldItalic",
  boldPlayfair: "PlayfairDisplay-Bold",
  boldItalicPlayfair: "PlayfairDisplay-BoldItalic",
  extraBoldPlayfair: "PlayfairDisplay-ExtraBold",
  extraBoldItalicPlayfair: "PlayfairDisplay-ExtraBoldItalic",
  blackPlayfair: "PlayfairDisplay-Black",
  blackItalicPlayfair: "PlayfairDisplay-BlackItalic",
  blackGeist: "Geist-Black",
  boldGeist: "Geist-Bold",
  semiBoldGeist: "Geist-SemiBold",
} as const;

export const Spacing = {
  unit: 4,
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 32,
  eight: 40,
  nine: 48,
  ten: 64,
  containerPadding: 20,
  stackGapSm: 8,
  stackGapMd: 16,
  stackGapLg: 32,
  sectionMargin: 48,
} as const;

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 24,
  full: 999,
} as const;

export const Typography = {
  displayLg: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "700" as const,
    letterSpacing: -1.6,
  },
  headlineLg: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "600" as const,
    letterSpacing: -0.64,
  },
  titleMd: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  priceLg: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "500" as const,
    letterSpacing: -0.24,
  },
  bodyMd: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  bodySm: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  labelCaps: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700" as const,
    letterSpacing: 0.96,
    textTransform: "uppercase" as const,
  },
} as const;

export const BottomTabInset =
  Platform.select({ ios: 92, android: 88, default: 88 }) ?? 88;
export const MaxContentWidth = 1200;