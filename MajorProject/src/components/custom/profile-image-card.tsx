import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, useColorScheme, View } from "react-native";

import { Colors } from "../../constants/theme";

type ProfileImageCardProps = {
  profileImage: string | null;
  onPress: () => void;
};

export function ProfileImageCard({
  profileImage,
  onPress,
}: ProfileImageCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      className="rounded-3xl border p-5 mb-5 items-center"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundSelected,
      }}
    >
      <Pressable onPress={onPress} className="items-center">
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            style={{
              width: 96,
              height: 96,
              borderRadius: 999,
              marginBottom: 12,
            }}
          />
        ) : (
          <View
            className="h-24 w-24 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: theme.backgroundSelected }}
          >
            <Ionicons
              name="person-outline"
              size={38}
              color={theme.textSecondary}
            />
          </View>
        )}

        <View
          className="rounded-full px-4 py-2"
          style={{ backgroundColor: theme.primary }}
        >
          <Text style={{ color: theme.text, fontWeight: "600" }}>
            Change Profile Image
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
