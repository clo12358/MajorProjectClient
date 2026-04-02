import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import api from "@/lib/axios";
import { LargeButton } from "../components/custom/large-button";
import { MoodCard } from "../components/custom/mood-card";
import { Toast } from "../components/custom/toast";
import { Colors } from "../constants/theme";

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

interface JournalResponse {
  id?: number;
  daily_log_id: number;
  entry: string;
  feeling: string;
  created_at?: string;
  updated_at?: string;
}

const moodToApiValue: Record<string, string> = {
  Great: "great",
  Good: "good",
  Okay: "okay",
  Low: "low",
  Awful: "awful",
};

const apiValueToMoodLabel: Record<string, string> = {
  great: "Great",
  good: "Good",
  okay: "Okay",
  low: "Low",
  awful: "Awful",
};

export default function Journal() {
  const { isDark } = useTheme();
  const theme = Colors[isDark ? "dark" : "light"];

  const params = useLocalSearchParams<{ dailyLogId?: string }>();

  const [selectedMood, setSelectedMood] = useState("Good");
  const [entry, setEntry] = useState("");
  const [dailyLogId, setDailyLogId] = useState<number | null>(null);
  const [loadingLog, setLoadingLog] = useState(true);
  const [savingEntry, setSavingEntry] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const moods = [
    { label: "Great", icon: "heart-outline" },
    { label: "Good", icon: "happy-outline" },
    { label: "Okay", icon: "remove-circle-outline" },
    { label: "Low", icon: "sad-outline" },
    { label: "Awful", icon: "skull-outline" },
  ];

  const today = new Date();

  const todayString = useMemo(() => formatDateForApi(today), []);
  const formattedToday = useMemo(() => {
    return today.toLocaleDateString("en-GB", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  function formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getParamDailyLogId(): number | null {
    const raw = params.dailyLogId;

    if (!raw) return null;

    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  }

  function extractJournalFromDailyLog(data: DailyLogResponse) {
    if (data.journal) {
      return {
        entry: data.journal.entry ?? "",
        feeling: data.journal.feeling ?? "good",
      };
    }

    if (typeof data.entry === "string" || typeof data.feeling === "string") {
      return {
        entry: data.entry ?? "",
        feeling: data.feeling ?? "good",
      };
    }

    return null;
  }

  async function createOrFetchTodayLog(): Promise<number | null> {
    try {
      const response = await api.post("/daily-logs", {
        date: todayString,
      });

      const log: DailyLogResponse = response.data;
      return log.id ?? null;
    } catch (error) {
      console.error("Failed to create/fetch today's log:", error);
      return null;
    }
  }

  async function fetchExistingJournal(logId: number) {
    try {
      const response = await api.get(`/daily-logs/${logId}`);
      const data: DailyLogResponse = response.data;

      const existingJournal = extractJournalFromDailyLog(data);

      if (existingJournal) {
        setEntry(existingJournal.entry);

        const mappedMood =
          apiValueToMoodLabel[existingJournal.feeling.toLowerCase()] ?? "Good";

        setSelectedMood(mappedMood);
      } else {
        setEntry("");
        setSelectedMood("Good");
      }
    } catch (error) {
      console.error("Failed to fetch existing journal:", error);
      setEntry("");
      setSelectedMood("Good");
    }
  }

  const initialiseJournal = useCallback(async () => {
    setLoadingLog(true);

    try {
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

  useFocusEffect(
    useCallback(() => {
      initialiseJournal();
    }, [initialiseJournal]),
  );

  async function saveWithPost(
    logId: number,
    payload: {
      entry: string;
      feeling: string;
    },
  ) {
    return api.post(`/daily-logs/${logId}/journal`, payload);
  }

  async function saveWithPut(
    logId: number,
    payload: {
      entry: string;
      feeling: string;
    },
  ) {
    return api.put(`/daily-logs/${logId}/journal`, payload);
  }

  async function handleSave() {
    if (!dailyLogId) {
      return;
    }

    if (!entry.trim()) {
      return;
    }

    const apiFeeling = moodToApiValue[selectedMood];

    if (!apiFeeling) {
      return;
    }

    const payload = {
      entry: entry.trim(),
      feeling: apiFeeling,
    };

    setSavingEntry(true);

    try {
      let response;

      try {
        response = await saveWithPost(dailyLogId, payload);
      } catch (postError: any) {
        const status = postError.response?.status;

        if (
          status === 404 ||
          status === 405 ||
          status === 409 ||
          status === 422
        ) {
          response = await saveWithPut(dailyLogId, payload);
        } else {
          throw postError;
        }
      }

      const savedJournal: JournalResponse = response.data;

      setEntry(savedJournal.entry ?? payload.entry);
      setSelectedMood(
        apiValueToMoodLabel[savedJournal.feeling?.toLowerCase()] ??
          selectedMood,
      );

      setToastVisible(true);
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
            <Text className="text-xs" style={{ color: theme.textSecondary }}>
              {formattedToday}
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

      <Toast
        message="Journal updated"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}
