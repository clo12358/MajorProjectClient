import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Switch, Text, useColorScheme, View } from "react-native";

import { Colors } from "../../constants/theme";

export default function Profile() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [notifications, setNotifications] = useState(true);
  const [appearance, setAppearance] = useState(false);

  const cardStyle = useMemo(
    () => ({
      backgroundColor: theme.backgroundElement,
      borderColor: theme.backgroundSelected,
    }),
    [theme],
  );

  const subtleTextStyle = useMemo(
    () => ({ color: theme.textSecondary }),
    [theme],
  );

  const rowBorderStyle = useMemo(
    () => ({ borderColor: theme.backgroundSelected }),
    [theme],
  );

  const logoutBg = "#FBE3E6";
  const logoutText = "#E11D48";

  function handleLogout() {
    router.replace("/(auth)/login");
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View className="px-6 pt-10">
        {/* Profile Card */}
        <View className="rounded-3xl p-5 border" style={cardStyle}>
          <View className="flex-row items-center gap-4">
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
                Josephine Doe
              </Text>
              <Text className="text-sm" style={subtleTextStyle}>
                jdoe@example.com
              </Text>
            </View>
          </View>

          <Pressable
            className="mt-4 rounded-2xl py-3 items-center"
            style={{ backgroundColor: theme.primary }}
            onPress={() => router.push("/edit-profile")}
          >
            <Text className="font-semibold" style={{ color: theme.text }}>
              Edit Profile
            </Text>
          </Pressable>
        </View>

        {/* Quote Card */}
        <View
          className="mt-5 rounded-3xl overflow-hidden"
          style={{ backgroundColor: theme.secondary }}
        >
          <View className="px-5 py-6" style={{ backgroundColor: theme.accent }}>
            <Text className="text-center italic" style={{ color: theme.text }}>
              "Enjoy the process. The results will come."
            </Text>
          </View>
        </View>

        {/* Setting List */}
        <View className="mt-5 gap-4">
          {/* Notifications row */}
          <View className="rounded-2xl border p-4" style={cardStyle}>
            <View className="flex-row items-center">
              <View
                className="h-9 w-9 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: theme.backgroundSelected }}
              >
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color={theme.text}
                />
              </View>

              <Text
                className="flex-1 font-semibold"
                style={{ color: theme.text }}
              >
                Notifications
              </Text>

              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{
                  false: theme.backgroundSelected,
                  true: theme.primary,
                }}
                thumbColor={"#ffffff"}
              />
            </View>
          </View>

          {/* Appearance row */}
          <View className="rounded-2xl border p-4" style={cardStyle}>
            <View className="flex-row items-center">
              <View
                className="h-9 w-9 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: theme.backgroundSelected }}
              >
                <Ionicons name="sunny-outline" size={18} color={theme.text} />
              </View>

              <Text
                className="flex-1 font-semibold"
                style={{ color: theme.text }}
              >
                Appearance
              </Text>

              <Switch
                value={appearance}
                onValueChange={setAppearance}
                trackColor={{
                  false: theme.backgroundSelected,
                  true: theme.primary,
                }}
                thumbColor={"#ffffff"}
              />
            </View>
          </View>

          {/* Privacy & Data row */}
          <Pressable className="rounded-2xl border p-4" style={cardStyle}>
            <View className="flex-row items-center">
              <View
                className="h-9 w-9 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: theme.backgroundSelected }}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color={theme.text}
                />
              </View>

              <View className="flex-1">
                <Text className="font-semibold" style={{ color: theme.text }}>
                  Privacy & Data
                </Text>
                <Text className="text-xs mt-0.5" style={subtleTextStyle}>
                  Manage your data
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.textSecondary}
              />
            </View>
          </Pressable>

          {/* Export Data row */}
          <Pressable className="rounded-2xl border p-4" style={cardStyle}>
            <View className="flex-row items-center">
              <View
                className="h-9 w-9 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: theme.backgroundSelected }}
              >
                <Ionicons
                  name="download-outline"
                  size={18}
                  color={theme.text}
                />
              </View>

              <Text
                className="flex-1 font-semibold"
                style={{ color: theme.text }}
              >
                Export Data
              </Text>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.textSecondary}
              />
            </View>
          </Pressable>
        </View>

        {/* Log Out Button */}
        <Pressable
          className="mt-6 rounded-2xl py-4 items-center"
          style={{ backgroundColor: logoutBg }}
          onPress={handleLogout}
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="log-out-outline" size={18} color={logoutText} />
            <Text className="font-semibold" style={{ color: logoutText }}>
              Log Out
            </Text>
          </View>
        </Pressable>

        <View className="h-10" />
      </View>
    </View>
  );
}
