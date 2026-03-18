import { Text, useColorScheme, View } from "react-native";

import { Colors } from "../../constants/theme";

type LegendItem = {
  label: string;
  color: string;
};

type LegendProps = {
  items: LegendItem[];
};

export function Legend({ items }: LegendProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      className="rounded-2xl border px-4 py-5"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundSelected,
      }}
    >
      <View className="flex-row items-center flex-wrap">
        {items.map((item, index) => (
          <View
            key={item.label}
            className={`flex-row items-center ${index !== items.length - 1 ? "mr-6" : ""}`}
          >
            <View
              className="h-3 w-3 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            />
            <Text style={{ color: theme.textSecondary }}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
