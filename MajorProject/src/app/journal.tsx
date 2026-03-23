import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

import { LargeButton } from "../components/custom/large-button";
import { MoodCard } from "../components/custom/mood-card";
import { Colors } from "../constants/theme";

export default function Journal() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [selectedMood, setSelectedMood] = useState("Good");
  const [entry, setEntry] = useState("");

  const moods = [
    { label: "Great", icon: "heart-outline" },
    { label: "Good", icon: "happy-outline" },
    { label: "Okay", icon: "remove-circle-outline" },
    { label: "Low", icon: "sad-outline" },
    { label: "Awful", icon: "skull-outline" },
  ] as const;

  function handleSave() {
    router.back();
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 32,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </Pressable>

        <View>
          <Text className="text-2xl font-bold" style={{ color: theme.text }}>
            Journal
          </Text>
          <Text className="text-xs" style={{ color: theme.textSecondary }}>
            Tuesday, January 18, 2026
          </Text>
        </View>
      </View>

      {/* Mood card */}
      <MoodCard
        moods={moods}
        selectedMood={selectedMood}
        onSelectMood={setSelectedMood}
      />

      {/* Journal input */}
      <View
        className="rounded-3xl border p-4 mb-5"
        style={{
          backgroundColor: theme.backgroundElement,
          borderColor: theme.backgroundSelected,
          minHeight: 340,
        }}
      >
        <TextInput
          value={entry}
          onChangeText={setEntry}
          placeholder="Write about how you're feeling today..."
          placeholderTextColor={theme.textSecondary}
          multiline
          textAlignVertical="top"
          style={{
            color: theme.text,
            fontSize: 14,
            minHeight: 300,
          }}
        />
      </View>

      {/* Save button */}
      <LargeButton
        title="Save Entry"
        icon="document-text-outline"
        onPress={handleSave}
      />
    </ScrollView>
  );
}
