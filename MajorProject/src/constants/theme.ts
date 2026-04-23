import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#2C3A40",
    background: "#FBFBFB",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#F0F4F4",
    primary: "#C3DCDB",
    primaryPressed: "#5E8A89",
    secondary: "#D1E2F5",
    secondaryPressed: "#7AAAC8",
    accent: "#FDDFD8",
    danger: "#FBE3E6",
    dangerText: "#9B0F2E",
    textSecondary: "#60646C",
  },

  dark: {
    text: "#E8F0F0",
    background: "#18201F",
    backgroundElement: "#22302F",
    backgroundSelected: "#2C3E3D",
    primary: "#3D6E6D",
    primaryPressed: "#C3DCDB",
    secondary: "#2C4A6B",
    secondaryPressed: "#1e344d",
    accent: "#6B3D35",
    danger: "#3D1F24",
    dangerText: "#F97B99",
    textSecondary: "#9EB0B0",
  },

  rose: {
    text: "#3A2C2C",
    background: "#FFF8F8",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#FCF0F0",
    primary: "#F2C4CE",
    primaryPressed: "#B56576",
    secondary: "#F5D6E0",
    secondaryPressed: "#C47A8A",
    accent: "#FDE8D0",
    danger: "#FBE3E6",
    dangerText: "#9B0F2E",
    textSecondary: "#8C6068",
  },

  sage: {
    text: "#2C3A30",
    background: "#F8FAF8",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#EDF3ED",
    primary: "#B8D4BC",
    primaryPressed: "#4A7A52",
    secondary: "#D4E8D0",
    secondaryPressed: "#6A9E72",
    accent: "#E8F0D4",
    danger: "#FBE3E6",
    dangerText: "#9B0F2E",
    textSecondary: "#5C6E5E",
  },

  lavender: {
    text: "#2E2A3A",
    background: "#FAF8FF",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#F0ECF9",
    primary: "#D4C4F0",
    primaryPressed: "#7A5FB5",
    secondary: "#E8D4F0",
    secondaryPressed: "#A87ACC",
    accent: "#F0D4E8",
    danger: "#FBE3E6",
    dangerText: "#9B0F2E",
    textSecondary: "#6E6080",
  },

  sunset: {
    text: "#3A2E28",
    background: "#FFF9F5",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#FFF0E8",
    primary: "#F5C4A0",
    primaryPressed: "#C47840",
    secondary: "#F5D8B8",
    secondaryPressed: "#C49060",
    accent: "#F0E0C8",
    danger: "#FBE3E6",
    dangerText: "#9B0F2E",
    textSecondary: "#806050",
  },
} as const;

export type ThemeName = keyof typeof Colors;
export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
