import { Ionicons } from "@expo/vector-icons";
import { Pressable, Switch, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../../constants/theme";

type SettingsRowProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  subtitle?: string;
  type?: "switch" | "link";
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
};

export function SettingsRow({
  title,
  icon,
  subtitle,
  type = "link",
  value,
  onValueChange,
  onPress,
}: SettingsRowProps) {
  const { themeName, setTheme } = useTheme();
  const theme = Colors[themeName];

  const content = (
    <View
      className="rounded-2xl border p-4"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundSelected,
      }}
    >
      <View className="flex-row items-center">
        <View
          className="h-9 w-9 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: theme.backgroundSelected }}
        >
          <Ionicons name={icon} size={18} color={theme.text} />
        </View>

        <View className="flex-1">
          <Text className="font-semibold" style={{ color: theme.text }}>
            {title}
          </Text>

          {subtitle ? (
            <Text
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>

        {type === "switch" ? (
          <Switch
            value={value ?? false}
            onValueChange={onValueChange}
            trackColor={{
              false: theme.backgroundSelected,
              true: theme.primary,
            }}
            thumbColor="#ffffff"
          />
        ) : (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.textSecondary}
          />
        )}
      </View>
    </View>
  );

  if (type === "link") {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}
