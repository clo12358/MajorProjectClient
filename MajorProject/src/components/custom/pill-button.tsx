import { Pressable, Text } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../../constants/theme";

type PillButtonProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function PillButton({
  label,
  selected = false,
  onPress,
}: PillButtonProps) {
  const { isDark } = useTheme();
  const theme = Colors[isDark ? "dark" : "light"];

  return (
    <Pressable
      onPress={onPress}
      className="rounded-full px-4 py-2"
      style={{
        backgroundColor: selected ? theme.secondaryPressed : theme.secondary,
      }}
    >
      <Text className="text-xs" style={{ color: theme.text }}>
        {label}
      </Text>
    </Pressable>
  );
}
