import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { JournalCard, JournalEntry } from "@/components/custom/journal-card";
import api from "@/lib/axios";
import { Colors } from "../constants/theme";

export default function AllJournalsPage() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchJournals();
    }, []),
  );

  async function fetchJournals() {
    setLoading(true);
    try {
      const response = await api.get("/journals");
      setJournals(response.data ?? []);
    } catch (error) {
      console.error("Failed to fetch journals:", error);
      setJournals([]);
    } finally {
      setLoading(false);
    }
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
      <View className="flex-row items-center mb-5">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </Pressable>

        <View>
          <Text className="text-2xl font-bold" style={{ color: theme.text }}>
            All Journal Entries
          </Text>
          <Text className="text-xs" style={{ color: theme.textSecondary }}>
            Your past journal notes
          </Text>
        </View>
      </View>

      {loading ? (
        <View className="mt-10 items-center">
          <ActivityIndicator size="small" color={theme.primary} />
          <Text className="mt-3 text-sm" style={{ color: theme.textSecondary }}>
            Loading journal entries...
          </Text>
        </View>
      ) : journals.length === 0 ? (
        <View
          className="rounded-3xl border p-4"
          style={{
            backgroundColor: theme.backgroundElement,
            borderColor: theme.backgroundSelected,
          }}
        >
          <Text className="text-sm" style={{ color: theme.textSecondary }}>
            No journal entries yet.
          </Text>
        </View>
      ) : (
        <View className="gap-4">
          {journals.map((journal) => (
            <JournalCard key={journal.id} journal={journal} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
