import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, useColorScheme, View } from "react-native";

import api from "@/lib/axios";
import { generateAndShareReport } from "@/lib/generateReport";
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
  const [exportingReport, setExportingReport] = useState(false);
  const [quote, setQuote] = useState(
    "Enjoy the process. The results will come.",
  );

  const { updated } = useLocalSearchParams<{ updated?: string }>();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchQuote();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, []),
  );

  useEffect(() => {
    if (updated === "true") {
      setShowToast(true);
      router.setParams({ updated: "" });
    }
  }, [updated]);

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

  async function handleExportReport() {
    setExportingReport(true);
    try {
      await generateAndShareReport();
    } catch (error) {
      console.error("Failed to export report:", error);
      Alert.alert(
        "Export Failed",
        "Something went wrong generating your report. Please try again.",
      );
    } finally {
      setExportingReport(false);
    }
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
        <ProfileCard
          name={user?.name ?? "Unknown"}
          email={user?.email ?? "Unknown"}
          profileImage={user?.profile_image ?? null}
          buttonTitle="Edit Profile"
          onPressButton={() => router.push("/edit-profile")}
        />

        <View className="mt-5">
          <QuoteCard quote={quote} />
        </View>

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
            onPress={() => router.push("/privacy-data")}
          />

          <SettingsRow
            title={exportingReport ? "Generating Report..." : "Export Data"}
            subtitle="Download a PDF report for your doctor"
            icon={exportingReport ? "hourglass-outline" : "download-outline"}
            type="link"
            onPress={exportingReport ? undefined : handleExportReport}
          />
        </View>

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

      <Toast
        message="Profile updated successfully"
        visible={showToast}
        onHide={() => setShowToast(false)}
      />
    </View>
  );
}
