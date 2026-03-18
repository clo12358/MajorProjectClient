import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { FormInput } from "../components/custom/form-input";
import { LargeButton } from "../components/custom/large-button";
import { ProfileImageCard } from "../components/custom/profile-image-card";
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
            style={{ color: "#E11D48" }}
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

        <FormInput
          label="Date of Birth"
          placeholder="YYYY-MM-DD"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          autoCapitalize="none"
        />

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
        <LargeButton title="Save Changes" onPress={handleSave} />
      </View>
    </ScrollView>
  );
}
