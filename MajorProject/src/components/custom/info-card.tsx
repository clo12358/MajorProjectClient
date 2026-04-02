import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../../constants/theme";

type InfoCardProps = {
  title: string;
  subtitle?: string;
  symptoms?: string[];
};

export function InfoCard({ title, subtitle, symptoms }: InfoCardProps) {
  const { isDark } = useTheme();
  const theme = Colors[isDark ? "dark" : "light"];

  return (
    <View
      className="rounded-3xl overflow-hidden"
      style={{ backgroundColor: theme.primary }}
    >
      <View className="p-4">
        <View
          className="rounded-2xl px-4 py-4"
          style={{ backgroundColor: theme.primary }}
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

          {symptoms && symptoms.length > 0 ? (
            <View className="flex-row flex-wrap mt-3" style={{ gap: 8 }}>
              {symptoms.map((symptom) => (
                <View
                  key={symptom}
                  className="rounded-full px-3 py-1"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.accent,
                    borderWidth: 1,
                  }}
                >
                  <Text
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {symptom}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
