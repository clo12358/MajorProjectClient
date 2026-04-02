import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { View } from "react-native";
import "../global.css";

function RootLayoutInner() {
  const { isDark } = useTheme();

  return (
    <View className={`flex-1 ${isDark ? "dark" : ""} bg-background`}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutInner />
    </ThemeProvider>
  );
}
