import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../../constants/theme";
import { PillButton } from "./pill-button";

export const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Cravings: "fast-food-outline",
  "Endometriosis Symptoms": "medical-outline",
  "Energy Level": "flash-outline",
  "Gut Health": "nutrition-outline",
  Mood: "happy-outline",
  "PCOS Symptoms": "body-outline",
  "Sex & Sex Drive": "heart-outline",
  Symptoms: "bandage-outline",
  "Vaginal Discharge": "water-outline",
};

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
  const { themeName, setTheme } = useTheme();
  const theme = Colors[themeName];
  const icon = CATEGORY_ICONS[title];

  return (
    <View className="mb-6">
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          marginBottom: 12,
        }}
      >
        {icon && (
          <Ionicons name={icon} size={16} color={theme.primaryPressed} />
        )}
        <Text className="text-base font-semibold" style={{ color: theme.text }}>
          {title}
        </Text>
      </View>

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
