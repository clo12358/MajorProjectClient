import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import api from "@/lib/axios";
import { FormInput } from "../components/custom/form-input";
import { LargeButton } from "../components/custom/large-button";
import { ProfileImageCard } from "../components/custom/profile-image-card";
import { Colors } from "../constants/theme";

export default function EditProfile() {
  const { isDark } = useTheme();
  const theme = Colors[isDark ? "dark" : "light"];

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const response = await api.get("/me");
      const user = response.data;

      setName(user.name ?? "");
      setHeight(user.height ? String(user.height) : "");
      setWeight(user.weight ? String(user.weight) : "");
      setDateOfBirth(user.dob ? new Date(user.dob) : null);
      setProfileImage(user.profile_image ?? null);
    } catch (error) {
      Alert.alert("Error", "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow access to your photo library.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      setNewImageUri(uri);
    }
  }

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  async function handleSave() {
    setSaving(true);
    try {
      const formData = new FormData();

      formData.append("_method", "PUT");

      if (name) formData.append("name", name);
      if (dateOfBirth) formData.append("dob", formatDate(dateOfBirth));
      if (height) formData.append("height", String(Number(height)));
      if (weight) formData.append("weight", String(Number(weight)));

      if (newImageUri) {
        if (Platform.OS === "web") {
          // On web, expo-image-picker returns a blob: URL — fetch it and convert to a Blob
          const res = await fetch(newImageUri);
          const blob = await res.blob();
          const ext = blob.type === "image/png" ? "png" : "jpg";
          formData.append("profile_image", blob, `profile.${ext}`);
        } else {
          const filename = newImageUri.split("/").pop() ?? "profile.jpg";
          const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
          const mimeType = ext === "png" ? "image/png" : "image/jpeg";
          formData.append("profile_image", {
            uri: newImageUri,
            type: mimeType,
            name: filename,
          } as any);
        }
      }

      await api.post("/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.replace({ pathname: "/profile", params: { updated: "true" } });
    } catch (error: any) {
      console.log("Status:", error.response?.status);
      console.log("Full error:", JSON.stringify(error.response?.data, null, 2));
      const errors = error.response?.data?.errors;
      if (errors) {
        const allErrors = Object.entries(errors)
          .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
          .join("\n");
        Alert.alert("Validation Error", allErrors);
      } else {
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

        <Pressable onPress={() => console.log("Delete account pressed")}>
          <Text
            className="text-sm font-semibold underline"
            style={{ color: theme.dangerText }}
          >
            Delete
          </Text>
        </Pressable>
      </View>

      <ProfileImageCard profileImage={profileImage} onPress={handlePickImage} />

      <View className="gap-4">
        <FormInput
          label="Name (first and last)"
          placeholder="First name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        {/* Date of Birth Picker */}
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
