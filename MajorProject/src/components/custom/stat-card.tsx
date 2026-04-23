import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../../constants/theme";

type StatCardProps = {
  title: string;
  value: string | number;
  label: string;
};

export function StatCard({ title, value, label }: StatCardProps) {
  const { themeName, setTheme } = useTheme();
  const theme = Colors[themeName];

  return (
    <View
      className="flex-1 rounded-3xl border p-5"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundSelected,
      }}
    >
      <Text className="text-base font-medium" style={{ color: theme.text }}>
        {title}
      </Text>

      <Text
        className="mt-2 text-4xl font-light"
        style={{ color: theme.primary }}
      >
        {value}
      </Text>

      <Text style={{ color: theme.textSecondary }}>{label}</Text>
    </View>
  );
}
