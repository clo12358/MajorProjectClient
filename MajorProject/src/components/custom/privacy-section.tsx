import { Text, useColorScheme, View } from "react-native";

import { Colors } from "../../constants/theme";

type PrivacySectionProps = {
  title: string;
  children: React.ReactNode;
};

export function PrivacySection({ title, children }: PrivacySectionProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      className="rounded-3xl p-5 mb-4"
      style={{ backgroundColor: theme.backgroundElement }}
    >
      <Text
        className="text-lg font-semibold mb-2"
        style={{ color: theme.text }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}
