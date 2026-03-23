import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, useColorScheme, View } from "react-native";

import { Colors } from "../../constants/theme";

type MoodOption = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type MoodCardProps = {
  title?: string;
  moods: MoodOption[];
  selectedMood: string;
  onSelectMood: (mood: string) => void;
};

export function MoodCard({
  title = "How are you feeling today?",
  moods,
  selectedMood,
  onSelectMood,
}: MoodCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      className="rounded-3xl border p-5 mb-5"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundSelected,
      }}
    >
      <Text
        className="text-xl font-semibold mb-5"
        style={{ color: theme.text }}
      >
        {title}
      </Text>

      <View className="flex-row justify-between">
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.label;

          return (
            <Pressable
              key={mood.label}
              onPress={() => onSelectMood(mood.label)}
              className="items-center"
            >
              <View
                className="h-12 w-12 rounded-full items-center justify-center mb-2"
                style={{
                  backgroundColor: isSelected
                    ? theme.primaryPressed
                    : theme.background,
                  borderWidth: 1,
                  borderColor: theme.backgroundSelected,
                }}
              >
                <Ionicons
                  name={mood.icon}
                  size={22}
                  color={theme.textSecondary}
                />
              </View>

              <Text className="text-xs" style={{ color: theme.textSecondary }}>
                {mood.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
