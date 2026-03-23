import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";

import api from "@/lib/axios";
import { LargeButton } from "../../components/custom/large-button";
import { ProfileCard } from "../../components/custom/profile-card";
import { QuoteCard } from "../../components/custom/quote-card";
import { SettingsRow } from "../../components/custom/settings-row";
import { Toast } from "../../components/custom/toast";
import { Colors } from "../../constants/theme";

interface User {
  id: number;
  name: string;
  email: string;
  dob: string | null;
  height: string | null;
  weight: string | null;
  profile_image: string | null;
}

export default function Profile() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [notifications, setNotifications] = useState(true);
  const [appearance, setAppearance] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState(
    "Enjoy the process. The results will come.",
  );

  const { updated } = useLocalSearchParams<{ updated?: string }>();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchQuote();
  }, []);

  // Show the success toast if we were redirected here after a profile update,
  // then immediately clear the param from the URL so it doesn't re-trigger on reload.
  useEffect(() => {
    if (updated === "true") {
      setShowToast(true);
      router.setParams({ updated: "" });
    }
  }, [updated]);

  //Connecting API
  async function fetchProfile() {
    try {
      const response = await api.get("/me");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchQuote() {
    try {
      const randomId = Math.floor(Math.random() * 1385) + 1;
      const response = await fetch(`https://dummyjson.com/quotes/${randomId}`);
      const data = await response.json();
      setQuote(`"${data.quote}"`);
    } catch (error) {
      console.error("Failed to fetch quote:", error);
    }
  }

  async function handleLogout() {
    await AsyncStorage.removeItem("auth_token");
    router.replace("/(auth)/login");
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View className="px-6 pt-10">
        {/* Profile Card */}
        <ProfileCard
          name={user?.name ?? "Unknown"}
          email={user?.email ?? "Unknown"}
          buttonTitle="Edit Profile"
          onPressButton={() => router.push("/edit-profile")}
        />

        {/* Quote Card */}
        <View className="mt-5">
          <QuoteCard quote={quote} />
        </View>

        {/* Setting List */}
        <View className="mt-5 gap-4">
          <SettingsRow
            title="Notifications"
            icon="notifications-outline"
            type="switch"
            value={notifications}
            onValueChange={setNotifications}
          />

          <SettingsRow
            title="Appearance"
            icon="sunny-outline"
            type="switch"
            value={appearance}
            onValueChange={setAppearance}
          />

          <SettingsRow
            title="Privacy & Data"
            subtitle="Manage your data"
            icon="shield-checkmark-outline"
            type="link"
            onPress={() => {}}
          />

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

      {/* Success toast */}
      <Toast
        message="Profile updated successfully"
        visible={showToast}
        onHide={() => setShowToast(false)}
      />
    </View>
  );
}
