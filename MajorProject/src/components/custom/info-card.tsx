import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

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
  onLogPress?: () => void;
};

export function InfoCard({
  title,
  subtitle,
  symptoms,
  onLogPress,
}: InfoCardProps) {
  const { themeName } = useTheme();
  const theme = Colors[themeName];

  return (
    <LinearGradient
      colors={[theme.primary, theme.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 24, padding: 16 }}
    >
      <View className="px-4 py-4">
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

          {onLogPress ? (
            <Pressable
              onPress={onLogPress}
              style={({ pressed }) => ({
                marginTop: 12,
                alignSelf: "flex-start",
                backgroundColor: theme.primaryPressed,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 999,
              })}
            >
              <Text
                style={{
                  color: theme.background,
                  fontWeight: "700",
                  fontSize: 13,
                }}
              >
                Log for this date
              </Text>
            </Pressable>
          ) : null}
      </View>
    </LinearGradient>
  );
}
