import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

import { Button } from "../components/ui/button";
import { Colors } from "../constants/theme";

export default function EditProfile() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("Josephine Doe");
  const [height, setHeight] = useState("162");
  const [weight, setWeight] = useState("65");
  const [dateOfBirth, setDateOfBirth] = useState("2001-05-14");

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  }

  function handleSave() {
    router.back();
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
        {/* Left side */}
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </Pressable>

          <Text className="text-2xl font-bold" style={{ color: theme.text }}>
            Edit Profile
          </Text>
        </View>

        {/* Delete account */}
        <Pressable onPress={() => console.log("Delete account pressed")}>
          <Text
            className="text-sm font-semibold underline"
            style={{ color: "#E11D48" }}
          >
            Delete
          </Text>
        </Pressable>
      </View>

      <View
        className="rounded-3xl border p-5 mb-5 items-center"
        style={{
          backgroundColor: theme.backgroundElement,
          borderColor: theme.backgroundSelected,
        }}
      >
        <Pressable onPress={handlePickImage} className="items-center">
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

      <View className="gap-4">
        {/* Name */}
        <View>
          <Text
            className="text-sm font-semibold mb-2"
            style={{ color: theme.text }}
          >
            Name (first and last)
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="First name"
            placeholderTextColor={theme.textSecondary}
            style={{
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundSelected,
              borderWidth: 1,
              borderRadius: 18,
              paddingHorizontal: 16,
              paddingVertical: 14,
              color: theme.text,
            }}
          />
        </View>

        {/* Date of Birth */}
        <View>
          <Text
            className="text-sm font-semibold mb-2"
            style={{ color: theme.text }}
          >
            Date of Birth
          </Text>
          <TextInput
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.textSecondary}
            style={{
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundSelected,
              borderWidth: 1,
              borderRadius: 18,
              paddingHorizontal: 16,
              paddingVertical: 14,
              color: theme.text,
            }}
          />
        </View>

        {/* Height */}
        <View>
          <Text
            className="text-sm font-semibold mb-2"
            style={{ color: theme.text }}
          >
            Height (cm)
          </Text>
          <TextInput
            value={height}
            onChangeText={setHeight}
            placeholder="Height"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
            style={{
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundSelected,
              borderWidth: 1,
              borderRadius: 18,
              paddingHorizontal: 16,
              paddingVertical: 14,
              color: theme.text,
            }}
          />
        </View>

        {/* Weight */}
        <View>
          <Text
            className="text-sm font-semibold mb-2"
            style={{ color: theme.text }}
          >
            Weight (kg)
          </Text>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            placeholder="Weight"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
            style={{
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundSelected,
              borderWidth: 1,
              borderRadius: 18,
              paddingHorizontal: 16,
              paddingVertical: 14,
              color: theme.text,
            }}
          />
        </View>
      </View>

      <Button
        className="w-full rounded-2xl py-4 mt-6"
        style={{ backgroundColor: theme.primary }}
        onPress={handleSave}
      >
        <Text className="font-semibold text-base" style={{ color: theme.text }}>
          Save Changes
        </Text>
      </Button>
    </ScrollView>
  );
}
