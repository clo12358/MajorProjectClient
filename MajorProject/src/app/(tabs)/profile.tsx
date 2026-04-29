import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import api from "@/lib/axios";
import { generateAndShareReport } from "@/lib/generateReport";
import { LargeButton } from "../../components/custom/large-button";
import { ProfileCard } from "../../components/custom/profile-card";
import { QuoteCard } from "../../components/custom/quote-card";
import { SettingsRow } from "../../components/custom/settings-row";
import { Toast } from "../../components/custom/toast";
import { Colors, ThemeName } from "../../constants/theme";

// Defines the shape of the user object returned from the API
interface User {
  id: number;
  name: string;
  email: string;
  dob: string | null;
  height: string | null;
  weight: string | null;
  profile_image: string | null;
}

// Array of available themes for the user to choose from
const THEMES: { name: ThemeName; label: string; description: string }[] = [
  {
    name: "light",
    label: "Cloud",
    description: "Clean light theme",
  },
  {
    name: "dark",
    label: "Midnight",
    description: "Deep teal darks",
  },
  {
    name: "rose",
    label: "Rose",
    description: "Soft warm pinks",
  },
  {
    name: "sage",
    label: "Sage",
    description: "Calm natural greens",
  },
  {
    name: "lavender",
    label: "Lavender",
    description: "Dreamy soft purples",
  },
  {
    name: "sunset",
    label: "Sunset",
    description: "Warm peachy tones",
  },
];

export default function Profile() {
  const { themeName, setTheme } = useTheme();
  const theme = Colors[themeName];

  const [notifications, setNotifications] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportingReport, setExportingReport] = useState(false);
  //This will display if a quote cant be fetched from the API
  const [quote, setQuote] = useState(
    "Enjoy the process. The results will come.",
  );
  const [showThemeModal, setShowThemeModal] = useState(false);

  const { updated } = useLocalSearchParams<{ updated?: string }>();
  const [showToast, setShowToast] = useState(false);

  // Fetch the quote when the component first loads
  useEffect(() => {
    fetchQuote();
  }, []);

  // Re-fetches the user's profile data every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          // Fetch the user's profile data from the API
          const response = await api.get("/me");
          const u = response.data;
          setUser(u);
          // Fetches the locally saved avatar so the most recently saved one is always shown
          const saved = await AsyncStorage.getItem(`avatar_url_${u.id}`);
          setLocalAvatar(saved ?? null);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        } finally {
          setLoading(false);
        }
      }
      load();
    }, []),
  );

  //This checks if the user has just updated their profile and shows a toast notification to say its completed
  useEffect(() => {
    if (updated === "true") {
      setShowToast(true);
      router.setParams({ updated: "" });
    }
  }, [updated]);

  // Fetches a random quote
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

  // Logs the user out by removing the auth token and redirecting to the login screen
  async function handleLogout() {
    await AsyncStorage.removeItem("auth_token");
    router.replace("/(auth)/login");
  }

  //Handles the report button. Generates and shares the PDF report by calling the generateAndShareReport() function, which is in the generateReport.ts file.
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-10">
          <ProfileCard
            name={user?.name ?? "Unknown"}
            email={user?.email ?? "Unknown"}
            profileImage={localAvatar}
            dob={user?.dob ?? null}
            height={user?.height ?? null}
            weight={user?.weight ?? null}
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
              title="Theme"
              subtitle={THEMES.find((t) => t.name === themeName)?.label ?? ""}
              icon="color-palette-outline"
              type="link"
              onPress={() => setShowThemeModal(true)}
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
      </ScrollView>

      {/* Theme Picker Modal */}
      <Modal
        visible={showThemeModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.25)",
          }}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setShowThemeModal(false)}
          />

          <View
            style={{
              backgroundColor: theme.backgroundElement,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingHorizontal: 24,
              paddingTop: 16,
              paddingBottom: 40,
              maxHeight: "80%",
            }}
          >
            {/* Handle bar */}
            <View className="items-center mb-6">
              <View
                style={{
                  width: 48,
                  height: 5,
                  borderRadius: 999,
                  backgroundColor: theme.backgroundSelected,
                }}
              />
            </View>

            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: theme.text,
                marginBottom: 20,
              }}
            >
              Choose a Theme
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
            >
              {/* Loops through the THEMES array to show each theme option */}
              {THEMES.map((t) => {
                const preview = Colors[t.name];
                const isSelected = themeName === t.name;

                return (
                  <Pressable
                    key={t.name}
                    onPress={() => {
                      setTheme(t.name);
                      setShowThemeModal(false);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 16,
                      borderRadius: 16,
                      borderWidth: isSelected ? 2 : 1,
                      borderColor: isSelected
                        ? theme.primaryPressed
                        : theme.backgroundSelected,
                      backgroundColor: isSelected
                        ? theme.backgroundSelected
                        : theme.backgroundElement,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 14,
                      }}
                    >
                      {/* Colour preview swatches */}
                      <View style={{ flexDirection: "row", gap: 4 }}>
                        {[
                          preview.background,
                          preview.primary,
                          preview.secondary,
                          preview.accent,
                        ].map(
                          (
                            colour,
                            i, //Loops through the 4 colour swatches for each theme to show
                          ) => (
                            <View
                              key={i}
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: 9,
                                backgroundColor: colour,
                                borderWidth: 1,
                                borderColor: preview.backgroundSelected,
                              }}
                            />
                          ),
                        )}
                      </View>

                      <View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: theme.text,
                          }}
                        >
                          {t.label}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: theme.textSecondary,
                          }}
                        >
                          {t.description}
                        </Text>
                      </View>
                    </View>

                    {isSelected && (
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: theme.primaryPressed,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Profile updated toast */}
      <Toast
        message="Profile updated successfully"
        visible={showToast}
        onHide={() => setShowToast(false)}
      />
    </View>
  );
}
