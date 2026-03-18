import { Text, useColorScheme } from "react-native";

import { Colors } from "../../constants/theme";
import { Card } from "../ui/card";

type DayCardProps = {
  date: string;
  cycleDay: number;
};

export function DayCard({ date, cycleDay }: DayCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <Card
      className="rounded-3xl p-6 items-center border"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundSelected,
      }}
    >
      <Text className="text-4xl font-bold" style={{ color: theme.primary }}>
        {date}
      </Text>
      <Text className="mt-2 text-base" style={{ color: theme.text }}>
        Day {cycleDay} of cycle
      </Text>
    </Card>
  );
}
