import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../../constants/theme";

type SymptomItem = {
  rank: number;
  name: string;
  count: number;
  width: string;
};

type SymptomsCardProps = {
  title: string;
  symptoms: SymptomItem[];
};

export function SymptomsCard({ title, symptoms }: SymptomsCardProps) {
  const { themeName, setTheme } = useTheme();
  const theme = Colors[themeName];

  const RANK_COLORS = [theme.primary, theme.secondary, theme.accent];

  const top3 = symptoms.slice(0, 3);

  return (
    <View
      className="rounded-3xl border p-5"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundSelected,
      }}
    >
      <Text
        className="text-2xl font-semibold mb-1"
        style={{ color: theme.text }}
      >
        {title}
      </Text>
      <Text className="text-xs mb-5" style={{ color: theme.textSecondary }}>
        Based on all logged days
      </Text>

      <View className="gap-3">
        {top3.map((symptom, index) => {
          const accentColor = RANK_COLORS[index];
          const isTop = index === 0;

          return (
            <View
              key={symptom.rank}
              className="rounded-2xl p-4"
              style={{
                backgroundColor: accentColor + "22",
                borderWidth: 1,
                borderColor: accentColor + (isTop ? "88" : "44"),
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="rounded-full px-2 py-0.5 mr-3"
                  style={{ backgroundColor: accentColor }}
                >
                  <Text
                    className="text-xs font-bold"
                    style={{ color: theme.background }}
                  >
                    #{symptom.rank}
                  </Text>
                </View>

                <Text
                  className="flex-1 font-semibold text-sm"
                  style={{ color: theme.text }}
                >
                  {symptom.name}
                </Text>

                <Text
                  className="text-xs font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  {symptom.count}×
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
