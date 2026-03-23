import { Text, useColorScheme, View } from "react-native";

import { Colors } from "../../constants/theme";

type QuoteCardProps = {
  quote: string;
};

export function QuoteCard({ quote }: QuoteCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      className="rounded-3xl overflow-hidden"
      style={{ backgroundColor: theme.secondary }}
    >
      <View className="px-5 py-6" style={{ backgroundColor: theme.accent }}>
        <Text className="text-center italic" style={{ color: theme.text }}>
          {quote}
        </Text>
      </View>
    </View>
  );
}
