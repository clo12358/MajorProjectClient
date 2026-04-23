import { Text } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../../constants/theme";
import { Card } from "../ui/card";

type DayCardProps = {
  date: string;
  cycleDay: number;
};

export function DayCard({ date, cycleDay }: DayCardProps) {
  const { themeName, setTheme } = useTheme();
  const theme = Colors[themeName];

  return (
    <Card
      className="rounded-3xl p-6 items-center border"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundSelected,
      }}
    >
      <Text
        className="text-4xl font-bold"
        style={{ color: theme.primaryPressed }}
      >
        {date}
      </Text>
      <Text className="mt-2 text-base" style={{ color: theme.text }}>
        Day {cycleDay} of cycle
      </Text>
    </Card>
  );
}
