import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Text, useColorScheme, View } from "react-native";

import { LargeButton } from "../../components/custom/large-button";
import { QuoteCard } from "../../components/custom/quote-card";
import { SettingsRow } from "../../components/custom/settings-row";
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

  function handleLogout() {
    router.replace("/(auth)/login");
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View className="px-6 pt-10">
        {/* Profile Card */}
        <View className="rounded-3xl p-5 border" style={cardStyle}>
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
                Josephine Doe
              </Text>
              <Text className="text-sm" style={subtleTextStyle}>
                jdoe@example.com
              </Text>
            </View>
          </View>

          <LargeButton
            title="Edit Profile"
            onPress={() => router.push("/edit-profile")}
          />
        </View>

        {/* Quote Card */}
        <View className="mt-5">
          <QuoteCard quote="Enjoy the process. The results will come." />
        </View>

        {/* Setting List */}
        <View className="mt-5 gap-4">
          {/* Notifications */}
          <SettingsRow
            title="Notifications"
            icon="notifications-outline"
            type="switch"
            value={notifications}
            onValueChange={setNotifications}
          />

          {/* Appearance */}
          <SettingsRow
            title="Appearance"
            icon="sunny-outline"
            type="switch"
            value={appearance}
            onValueChange={setAppearance}
          />

          {/* Privacy & Data */}
          <SettingsRow
            title="Privacy & Data"
            subtitle="Manage your data"
            icon="shield-checkmark-outline"
            type="link"
            onPress={() => {}}
          />

          {/* Export Data */}
          <SettingsRow
            title="Export Data"
            icon="download-outline"
            type="link"
            onPress={() => {}}
          />
        </View>

        {/* Log Out Button */}
        <View className="mt-6">
          <LargeButton
            title="Log Out"
            icon="log-out-outline"
            backgroundColor={theme.danger}
            textColor={theme.dangerText}
            onPress={handleLogout}
          />
        </View>

        <View className="h-10" />
      </View>
    </View>
  );
}
