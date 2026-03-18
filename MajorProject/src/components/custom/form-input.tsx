import { Text, useColorScheme, View } from "react-native";

import { Colors } from "../../constants/theme";
import { Input } from "../ui/input";

type FormInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

export function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
}: FormInputProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold" style={{ color: theme.text }}>
        {label}
      </Text>

      <View
        className="rounded-2xl px-4 py-2 border"
        style={{
          backgroundColor: theme.backgroundElement,
          borderColor: theme.backgroundSelected,
        }}
      >
        <Input
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          className="border-0 bg-transparent"
        />
      </View>
    </View>
  );
}
