import { Text, useColorScheme, View } from "react-native";

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
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      className="rounded-3xl border p-5"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundSelected,
      }}
    >
      <Text className="text-3xl font-medium mb-5" style={{ color: theme.text }}>
        {title}
      </Text>

      <View className="gap-5">
        {symptoms.map((symptom) => (
          <View key={symptom.rank}>
            <View className="flex-row items-center mb-2">
              <View
                className="h-8 w-8 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: theme.backgroundSelected }}
              >
                <Text style={{ color: theme.text }}>{symptom.rank}</Text>
              </View>

              <Text className="flex-1 text-base" style={{ color: theme.text }}>
                {symptom.name}
              </Text>

              <Text style={{ color: theme.text }}>{symptom.count} times</Text>
            </View>

            <View
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: theme.accent }}
            >
              <View
                className="h-2 rounded-full"
                style={{
                  width: symptom.width,
                  backgroundColor: theme.primary,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
