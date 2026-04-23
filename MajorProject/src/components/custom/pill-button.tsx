import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../../constants/theme";

type PillButtonProps = {
  label: string;
  selected?: boolean;
  logged?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

export function PillButton({
  label,
  selected = false,
  logged = false,
  icon,
  onPress,
}: PillButtonProps) {
  const { themeName, setTheme } = useTheme();
  const theme = Colors[themeName];

  return (
    <Pressable
      onPress={onPress}
      className="rounded-full px-4 py-2"
      style={{
        backgroundColor: selected
          ? theme.secondaryPressed
          : logged
            ? theme.secondaryPressed
            : theme.secondary,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
      }}
    >
      {icon && <Ionicons name={icon} size={11} color={theme.text} />}
      <Text
        className="text-xs"
        style={{
          color: theme.text,
          fontWeight: logged || selected ? "700" : "400",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
