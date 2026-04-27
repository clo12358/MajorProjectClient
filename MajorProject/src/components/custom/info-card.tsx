import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../../constants/theme";
import { CATEGORY_ICONS } from "./symptom-category";

type SavedSymptom = {
  name: string;
  category: string;
};

type InfoCardProps = {
  title: string;
  subtitle?: string;
  symptoms?: SavedSymptom[];
};

export function InfoCard({ title, subtitle, symptoms }: InfoCardProps) {
  const { themeName } = useTheme();
  const theme = Colors[themeName];

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
            <Text className="mt-1 text-base" style={{ color: theme.text }}>
              {subtitle}
            </Text>
          ) : null}

          {symptoms && symptoms.length > 0 ? (
            <View className="flex-row flex-wrap mt-3" style={{ gap: 8 }}>
              {symptoms.map(({ name, category }) => (
                <View
                  key={`${category}-${name}`}
                  className="rounded-full px-3 py-2"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.accent,
                    borderWidth: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Ionicons
                    name={CATEGORY_ICONS[category] ?? "ellipse-outline"}
                    size={11}
                    color={theme.primaryPressed}
                  />
                  <Text
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {name}
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
