import { ReactNode } from "react";
import { Text, useColorScheme, View } from "react-native";

import { Colors } from "../../constants/theme";

type SectionCardProps = {
  title: string;
  rightContent?: ReactNode;
  children: ReactNode;
};

export function SectionCard({
  title,
  rightContent,
  children,
}: SectionCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      className="rounded-3xl p-4 border"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundSelected,
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-semibold" style={{ color: theme.text }}>
          {title}
        </Text>

        {rightContent ? rightContent : null}
      </View>

      {children}
    </View>
  );
}
