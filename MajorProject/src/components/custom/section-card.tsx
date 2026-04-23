import { ReactNode } from "react";
import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
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
  const { themeName, setTheme } = useTheme();
  const theme = Colors[themeName];

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
