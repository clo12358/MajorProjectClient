import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import api from "@/lib/axios";
import { FormInput } from "../components/custom/form-input";
import { LargeButton } from "../components/custom/large-button";
import { ProfileImageCard } from "../components/custom/profile-image-card";
import { Colors } from "../constants/theme";

export default function EditProfile() {
  const { themeName, setTheme } = useTheme();
  const theme = Colors[themeName];

  const [userId, setUserId] = useState<number | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetches the user's existing profile data, and prefills the form and loads the avatar if it exists in AsyncStorage
  useEffect(() => {
    async function init() {
      try {
        const response = await api.get("/me");
        const user = response.data;
        setUserId(user.id);
        setName(user.name ?? "");
        //Convert height and weight to strings for the text inputs
        setHeight(user.height ? String(user.height) : "");
        setWeight(user.weight ? String(user.weight) : "");
        setDateOfBirth(user.dob ? new Date(user.dob) : null);
        const saved = await AsyncStorage.getItem(`avatar_url_${user.id}`);
        if (saved) setProfileImage(saved);
      } catch (error) {
        Alert.alert("Error", "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  //Formats a Date object into YYYY-MM-DD format for sending back to the API
  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0"); // padStart ensures single digit days have a leading 0 e.g. "01"
    return `${year}-${month}-${day}`;
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Builds a FormData object to send the profile data as multipart/form-data
      const formData = new FormData();
      formData.append("_method", "PUT");
      // Converts height and weight to strings for the text inputs
      if (name) formData.append("name", name);
      if (dateOfBirth) formData.append("dob", formatDate(dateOfBirth));
      if (height) formData.append("height", height);
      if (weight) formData.append("weight", weight);

      await api.post("/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      //Redirects back to the profile page with a thing to show the success toast
      router.replace({ pathname: "/profile", params: { updated: "true" } });
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      if (errors) {
        //Combines all validation errors into a single string to show in the alert
        const allErrors = Object.entries(errors)
          .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
          .join("\n");
        Alert.alert("Validation Error", allErrors);
      } else {
        //Falls back to a generic error message if something else went wrong
        Alert.alert(
          "Error",
          error.response?.data?.message ??
            "Failed to save profile. Please try again.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  //Loading icon while fetching profile data
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
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </Pressable>
          <Text className="text-2xl font-bold" style={{ color: theme.text }}>
            Edit Profile
          </Text>
        </View>
      </View>

      <ProfileImageCard
        userId={userId ?? 0}
        profileImage={profileImage}
        onSelect={setProfileImage}
      />

      <View className="gap-4">
        <FormInput
          label="Name (first and last)"
          placeholder="First name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <View>
          <Text
            className="text-sm font-medium mb-1"
            style={{ color: theme.text }}
          >
            Date of Birth
          </Text>

          {Platform.OS === "web" ? (
            <input
              type="date"
              value={dateOfBirth ? formatDate(dateOfBirth) : ""}
              max={formatDate(new Date())}
              onChange={(e) => {
                if (e.target.value) setDateOfBirth(new Date(e.target.value));
              }}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: `1px solid ${theme.backgroundSelected}`,
                backgroundColor: theme.backgroundElement,
                color: theme.text,
                fontSize: "16px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          ) : (
            <>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={{
                  borderWidth: 1,
                  borderColor: theme.backgroundSelected,
                  borderRadius: 10,
                  padding: 14,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: theme.backgroundElement,
                }}
              >
                <Text
                  style={{
                    color: dateOfBirth ? theme.text : theme.textSecondary,
                  }}
                >
                  {dateOfBirth ? formatDate(dateOfBirth) : "Select date"}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={theme.textSecondary}
                />
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth ?? new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    if (Platform.OS === "android") setShowDatePicker(false);
                    if (selectedDate) setDateOfBirth(selectedDate);
                  }}
                />
              )}

              {showDatePicker && Platform.OS === "ios" && (
                <Pressable
                  onPress={() => setShowDatePicker(false)}
                  style={{
                    alignSelf: "flex-end",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: theme.primary,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Done</Text>
                </Pressable>
              )}
            </>
          )}
        </View>

        <FormInput
          label="Height (cm)"
          placeholder="Height"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />

        <FormInput
          label="Weight (kg)"
          placeholder="Weight"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
      </View>

      <View className="mt-6">
        <LargeButton
          title={saving ? "Saving..." : "Save Changes"}
          onPress={handleSave}
          disabled={saving}
        />
      </View>
    </ScrollView>
  );
}
