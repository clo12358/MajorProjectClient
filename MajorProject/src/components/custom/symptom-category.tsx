import { Text, useColorScheme, View } from "react-native";

import { Colors } from "../../constants/theme";
import { PillButton } from "./pill-button";

type SymptomCategorySectionProps = {
  title: string;
  symptoms: string[];
  selectedSymptoms: string[];
  onToggleSymptom: (symptom: string) => void;
};

export function SymptomCategorySection({
  title,
  symptoms,
  selectedSymptoms,
  onToggleSymptom,
}: SymptomCategorySectionProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View className="mb-6">
      <Text
        className="text-base font-semibold mb-3"
        style={{ color: theme.text }}
      >
        {title}
      </Text>

      <View className="flex-row flex-wrap gap-2">
        {symptoms.map((symptom) => {
          const isSelected = selectedSymptoms.includes(symptom);

          return (
            <PillButton
              key={symptom}
              label={symptom}
              selected={isSelected}
              onPress={() => onToggleSymptom(symptom)}
            />
          );
        })}
      </View>
    </View>
  );
}
