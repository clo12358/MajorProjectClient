import { Text, useColorScheme, View } from "react-native";

import { Colors } from "../../constants/theme";

type InfoCardProps = {
  title: string;
  subtitle?: string;
};

export function InfoCard({ title, subtitle }: InfoCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      className="rounded-3xl overflow-hidden"
      style={{ backgroundColor: theme.accent }}
    >
      <View className="p-4">
        <View
          className="rounded-2xl px-4 py-4"
          style={{ backgroundColor: theme.accent }}
        >
          <Text
            className="text-2xl font-semibold"
            style={{ color: theme.text }}
          >
            {title}
          </Text>

          {subtitle ? (
            <Text
              className="mt-1 text-base"
              style={{ color: theme.textSecondary }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
