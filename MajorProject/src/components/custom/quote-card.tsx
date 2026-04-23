import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../../constants/theme";

type QuoteCardProps = {
  quote: string;
};

export function QuoteCard({ quote }: QuoteCardProps) {
  const { themeName } = useTheme();
  const theme = Colors[themeName];

  return (
    <LinearGradient
      colors={[theme.primary, theme.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 24,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          textAlign: "center",
          fontStyle: "italic",
          color: theme.text,
          lineHeight: 22,
        }}
      >
        {quote}
      </Text>
    </LinearGradient>
  );
}
