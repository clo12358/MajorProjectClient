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

import api from "@/lib/axios";
import { Colors } from "../constants/theme";

interface AllJournalEntry {
  id: number;
  daily_log_id: number;
  entry: string | null;
  feeling: "great" | "good" | "okay" | "low" | "awful" | null;
  created_at?: string;
  updated_at?: string;
  daily_log?: {
    id: number;
    cycle_id: number;
    date: string;
  };
}

export default function AllJournalsPage() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [journals, setJournals] = useState<AllJournalEntry[]>([]);
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

  function formatDate(dateString?: string) {
    if (!dateString) return "Unknown date";

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatFeeling(
    feeling: AllJournalEntry["feeling"],
  ): "Great" | "Good" | "Okay" | "Low" | "Awful" | null {
    if (!feeling) return null;

    switch (feeling) {
      case "great":
        return "Great";
      case "good":
        return "Good";
      case "okay":
        return "Okay";
      case "low":
        return "Low";
      case "awful":
        return "Awful";
      default:
        return null;
    }
  }

  function getMoodColor(feeling: AllJournalEntry["feeling"]) {
    switch (feeling) {
      case "great":
        return theme.primary;
      case "good":
        return theme.primary;
      case "okay":
        return theme.secondary;
      case "low":
        return theme.secondary;
      case "awful":
        return theme.accent;
      default:
        return theme.backgroundSelected;
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
          {journals.map((journal) => {
            const feelingLabel = formatFeeling(journal.feeling);

            return (
              <View
                key={journal.id}
                className="rounded-3xl border p-4"
                style={{
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected,
                }}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <Text
                    className="text-sm font-semibold flex-1 pr-3"
                    style={{ color: theme.text }}
                  >
                    {formatDate(journal.daily_log?.date)}
                  </Text>

                  {feelingLabel && (
                    <View
                      className="rounded-full px-3 py-1"
                      style={{ backgroundColor: getMoodColor(journal.feeling) }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: theme.background }}
                      >
                        {feelingLabel}
                      </Text>
                    </View>
                  )}
                </View>

                <Text
                  className="text-sm leading-6"
                  style={{ color: theme.textSecondary }}
                >
                  {journal.entry?.trim() || "No journal text for this entry."}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
