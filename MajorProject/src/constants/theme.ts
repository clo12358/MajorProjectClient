import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#2C3A40",
    background: "#FBFBFB",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#F0F4F4",

    primary: "#C3DCDB",
    primaryPressed: "#9FBFBE",
    secondary: "#D1E2F5",
    secondaryPressed: "#A8C8E1",
    accent: "#FDDFD8",

    textSecondary: "#60646C",
  },

  dark: {
    text: "#F2F5F5",
    background: "#121616",
    backgroundElement: "#1B2121",
    backgroundSelected: "#242C2C",

    primary: "#7FAFAE",
    primaryPressed: "#5E8F8E",

    secondary: "#7FA7C8",
    secondaryPressed: "#5E86A8",

    accent: "#CFA29C",

    textSecondary: "#A1A8A8",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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
