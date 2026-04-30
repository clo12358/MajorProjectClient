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

  nordic: {
    text: "#0C2340",
    background: "#F4F7FB",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#DDEAF7",
    primary: "#378ADD",
    primaryPressed: "#0C447C",
    secondary: "#7F77DD",
    secondaryPressed: "#3C3489",
    accent: "#EF9F27",
    danger: "#FBE3E6",
    dangerText: "#9B0F2E",
    textSecondary: "#4A6680",
  },

  forestNight: {
    text: "#D4EEE4",
    background: "#141F1A",
    backgroundElement: "#1D3D2A",
    backgroundSelected: "#254D35",
    primary: "#1D9E75",
    primaryPressed: "#5DCAA5",
    secondary: "#D85A30",
    secondaryPressed: "#F0997B",
    accent: "#EF9F27",
    danger: "#3D1A1A",
    dangerText: "#F09595",
    textSecondary: "#6A9E82",
  },

  bubblegum: {
    text: "#3A0A20",
    background: "#FFF8FC",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#FDE8F2",
    primary: "#D4537E",
    primaryPressed: "#72243E",
    secondary: "#1D9E75",
    secondaryPressed: "#085041",
    accent: "#378ADD",
    danger: "#FBE3E6",
    dangerText: "#9B0F2E",
    textSecondary: "#993556",
  },

  dusk: {
    text: "#EDE8FA",
    background: "#1C1A24",
    backgroundElement: "#2E2438",
    backgroundSelected: "#3A2E48",
    primary: "#993556",
    primaryPressed: "#ED93B1",
    secondary: "#185FA5",
    secondaryPressed: "#85B7EB",
    accent: "#EF9F27",
    danger: "#3D1A1A",
    dangerText: "#F09595",
    textSecondary: "#AFA9EC",
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
