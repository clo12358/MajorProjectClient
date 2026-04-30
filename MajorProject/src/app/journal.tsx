import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import api from "@/lib/axios";
import { LargeButton } from "../components/custom/large-button";
import { MoodCard } from "../components/custom/mood-card";
import { Colors } from "../constants/theme";

// The shape of a daily log response from the API
interface DailyLogResponse {
  id: number;
  date?: string;
  journal?: {
    id?: number;
    entry?: string;
    feeling?: string;
  } | null;
  entry?: string;
  feeling?: string;
}

export default function Journal() {
  const { themeName } = useTheme();
  const theme = Colors[themeName];

  const params = useLocalSearchParams<{ dailyLogId?: string }>();

  const [selectedMood, setSelectedMood] = useState("Good");
  const [entry, setEntry] = useState("");
  const [dailyLogId, setDailyLogId] = useState<number | null>(null);
  const [loadingLog, setLoadingLog] = useState(true);
  const [savingEntry, setSavingEntry] = useState(false);
  const [journalDate, setJournalDate] = useState<string | null>(null);

  // The available mood options with their display label and icon
  const moods = [
    { label: "Great", icon: "heart-outline" },
    { label: "Good", icon: "happy-outline" },
    { label: "Okay", icon: "remove-circle-outline" },
    { label: "Low", icon: "sad-outline" },
    { label: "Awful", icon: "skull-outline" },
  ];

  const today = new Date();

  // Format today's date for the API
  const todayString = useMemo(() => {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // Format today's date as a readable string — used as fallback if no log date is available
  const formattedToday = useMemo(() => {
    return today.toLocaleDateString("en-GB", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  // Reads the dailyLogId route param and converts it to a number
  // Returns null if the param is missing or not a valid number
  function getParamDailyLogId(): number | null {
    const raw = params.dailyLogId;
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  }

  // Creates or retrieves today's daily log and returns its ID
  async function createOrFetchTodayLog(): Promise<number | null> {
    try {
      const response = await api.post("/daily-logs", { date: todayString });
      const log: DailyLogResponse = response.data;
      return log.id ?? null;
    } catch (error) {
      console.error("Failed to create/fetch today's log:", error);
      return null;
    }
  }

  // Fetches the existing journal entry for a given log and pre-fills the form
  async function fetchExistingJournal(logId: number) {
    try {
      const response = await api.get(`/daily-logs/${logId}`);
      const data: DailyLogResponse = response.data;

      // Use the date from the log response to show the correct date in the header
      if (data.date) {
        const date = new Date(`${data.date}T00:00:00`);
        setJournalDate(
          date.toLocaleDateString("en-GB", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
        );
      }

      // Read journal entry and feeling directly from the journal object
      const existingEntry = data.journal?.entry ?? "";
      const existingFeeling = data.journal?.feeling ?? null;

      setEntry(existingEntry);
      // Capitalise the feeling value from the API
      setSelectedMood(
        existingFeeling
          ? existingFeeling.charAt(0).toUpperCase() + existingFeeling.slice(1)
          : "Good",
      );
    } catch (error) {
      console.error("Failed to fetch existing journal:", error);
      setEntry("");
      setSelectedMood("Good");
    }
  }

  // Initialises the journal by getting the log ID and fetching any existing entry
  const initialiseJournal = useCallback(async () => {
    setLoadingLog(true);
    try {
      // Use the log ID from the route param if available, otherwise create/fetch today's log
      let logId = getParamDailyLogId();
      if (!logId) {
        logId = await createOrFetchTodayLog();
      }
      if (!logId) {
        setDailyLogId(null);
        return;
      }
      setDailyLogId(logId);
      await fetchExistingJournal(logId);
    } finally {
      setLoadingLog(false);
    }
  }, [params.dailyLogId]);

  // Re-initialise the journal every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      initialiseJournal();
    }, [initialiseJournal]),
  );

  // Saves the journal entry, tries POST first, falls back to PUT if entry already exists
  async function handleSave() {
    if (!dailyLogId || !entry.trim()) return;

    // Convert the selected mood label to lowercase for the API
    const payload = {
      entry: entry.trim(),
      feeling: selectedMood.toLowerCase(),
    };

    setSavingEntry(true);
    try {
      try {
        // Try POST first, will fail if a journal entry already exists for this log
        await api.post(`/daily-logs/${dailyLogId}/journal`, payload);
      } catch (postError: any) {
        const status = postError.response?.status;
        // Fall back to PUT if the entry already exists or POST isn't supported
        if (
          status === 404 ||
          status === 405 ||
          status === 409 ||
          status === 422
        ) {
          await api.put(`/daily-logs/${dailyLogId}/journal`, payload);
        } else {
          throw postError;
        }
      }
      // Redirect back to home with a flag to show the success toast
      router.replace({ pathname: "/home", params: { journalSaved: "1" } });
    } catch (error: any) {
      console.error("Journal save error:", error.response?.data ?? error);
    } finally {
      setSavingEntry(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center mb-4">
          <Pressable onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </Pressable>
          <View>
            <Text className="text-2xl font-bold" style={{ color: theme.text }}>
              Journal
            </Text>
            {/* Show the date of the log being edited, falling back to today */}
            <Text className="text-xs" style={{ color: theme.textSecondary }}>
              {journalDate ?? formattedToday}
            </Text>
          </View>
        </View>

        <MoodCard
          moods={moods}
          selectedMood={selectedMood}
          onSelectMood={setSelectedMood}
        />

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
            editable={!loadingLog && !savingEntry}
            style={{
              color: theme.text,
              fontSize: 14,
              minHeight: 300,
            }}
          />
        </View>

        <LargeButton
          title={
            loadingLog ? "Loading..." : savingEntry ? "Saving..." : "Save Entry"
          }
          icon="document-text-outline"
          disabled={loadingLog || savingEntry || !entry.trim()}
          onPress={handleSave}
        />
      </ScrollView>
    </View>
  );
}
