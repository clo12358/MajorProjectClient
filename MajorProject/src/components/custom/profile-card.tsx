import { Ionicons } from "@expo/vector-icons";
import { Text, useColorScheme, View } from "react-native";

import { Colors } from "../../constants/theme";
import { LargeButton } from "./large-button";

type ProfileCardProps = {
  name: string;
  email: string;
  buttonTitle?: string;
  onPressButton?: () => void;
};

export function ProfileCard({
  name,
  email,
  buttonTitle = "Edit Profile",
  onPressButton,
}: ProfileCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      className="rounded-3xl p-5 border"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundSelected,
      }}
    >
      <View className="flex-row items-center gap-4 mb-3">
        <View
          className="h-14 w-14 rounded-full items-center justify-center"
          style={{ backgroundColor: theme.backgroundSelected }}
        >
          <Ionicons
            name="person-outline"
            size={26}
            color={theme.textSecondary}
          />
        </View>

        <View className="flex-1">
          <Text
            className="text-base font-semibold"
            style={{ color: theme.text }}
          >
            {name}
          </Text>
          <Text className="text-sm" style={{ color: theme.textSecondary }}>
            {email}
          </Text>
        </View>
      </View>

      <LargeButton title={buttonTitle} onPress={onPressButton} />
    </View>
  );
}
