import { Stack } from "expo-router";
import { useColorScheme, View } from "react-native";
import "../global.css";

export default function RootLayout() {
  const scheme = useColorScheme(); // "light" | "dark"

  return (
    <View className={`flex-1 ${scheme === "dark" ? "dark" : ""} bg-background`}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
