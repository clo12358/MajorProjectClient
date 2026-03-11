import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, useColorScheme, View } from "react-native";

import { Colors } from "../../constants/theme";

type LargeButtonProps = {
  title: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  backgroundColor?: string;
  textColor?: string;
};

export function LargeButton({
  title,
  onPress,
  icon,
  backgroundColor,
  textColor,
}: LargeButtonProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const buttonBackgroundColor = backgroundColor ?? theme.primary;
  const buttonTextColor = textColor ?? theme.text;

  return (
    <Pressable
      className="w-full rounded-2xl py-3 items-center"
      style={{ backgroundColor: buttonBackgroundColor }}
      onPress={onPress}
    >
      <View className="flex-row items-center gap-2">
        {icon ? (
          <Ionicons name={icon} size={16} color={buttonTextColor} />
        ) : null}

        <Text
          className="font-semibold text-base"
          style={{ color: buttonTextColor }}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}
