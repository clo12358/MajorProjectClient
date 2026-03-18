import { Text, useColorScheme, View } from "react-native";

import { Colors } from "../../constants/theme";

type DayItem = {
  day: string;
  fullDate: Date;
  active: boolean;
};

type DateChipsProps = {
  days: DayItem[];
};

export function DateChips({ days }: DateChipsProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View className="flex-row justify-between mb-5">
      {days.map((item) => (
        <View
          key={item.fullDate.toISOString()}
          className="h-8 w-8 rounded-full items-center justify-center"
          style={{
            backgroundColor: item.active ? theme.primary : theme.secondary,
          }}
        >
          <Text className="text-xs font-medium" style={{ color: theme.text }}>
            {item.day}
          </Text>
        </View>
      ))}
    </View>
  );
}
