import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import api from "@/lib/axios";
import { DateChips } from "../../components/custom/date-chips";
import { DayCard } from "../../components/custom/day-card";
import { LargeButton } from "../../components/custom/large-button";
import { PillButton } from "../../components/custom/pill-button";
import { QuoteCard } from "../../components/custom/quote-card";
import { SectionCard } from "../../components/custom/section-card";
import { SymptomCategorySection } from "../../components/custom/symptom-category";
import { Colors } from "../../constants/theme";

const flowMap: Record<string, { flow: string; has_clots: boolean }> = {
  Light: { flow: "light", has_clots: false },
  Medium: { flow: "medium", has_clots: false },
  Heavy: { flow: "heavy", has_clots: false },
  "Blood Clots": { flow: "heavy", has_clots: true },
};

interface Cycle {
  id: number;
  start_date: string;
  end_date: string | null;
}

interface Symptom {
  id: number;
  name: string;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
  symptoms: Symptom[];
}

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
  daily_symptoms?: {
    symptom_id: number;
    symptom?: { name: string };
  }[];
}

const apiFeelingToLabel: Record<string, string> = {
  great: "Great",
  good: "Good",
  okay: "Okay",
  low: "Low",
  awful: "Awful",
};

export default function Home() {
  const { isDark } = useTheme();
  const theme = Colors[isDark ? "dark" : "light"];

  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [showSymptomsModal, setShowSymptomsModal] = useState(false);
  const [selectedSymptomIds, setSelectedSymptomIds] = useState<number[]>([]);
  const [loggingPeriod, setLoggingPeriod] = useState(false);
  const [savingSymptoms, setSavingSymptoms] = useState(false);
  const [endingPeriod, setEndingPeriod] = useState(false);
  const [openingJournal, setOpeningJournal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [savedSymptomNames, setSavedSymptomNames] = useState<string[]>([]);
  const [todayLogId, setTodayLogId] = useState<number | null>(null);
  const [journalPreview, setJournalPreview] = useState("");
  const [journalFeeling, setJournalFeeling] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<{
    id: number;
    start_date: string;
    end_date: string | null;
  } | null>(null);
  const [cycleDay, setCycleDay] = useState<number | null>(null);
  const [quote, setQuote] = useState("The best is yet to come.");

  const today = new Date();
  const todayString = formatDate(today);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - 3 + index);
    return {
      day: date.getDate().toString(),
      fullDate: date,
      active: index === 3,
    };
  });

  const periodOptions = ["Light", "Medium", "Heavy", "Blood Clots"];

  const formattedToday = today.toLocaleDateString("en-GB", {
    month: "long",
    day: "numeric",
  });

  const moodCategory = categories.find((c) => c.name === "Mood");
  const feelingSymptoms = moodCategory?.symptoms.slice(0, 8) ?? [];

  const allSymptoms = categories.flatMap((c) => c.symptoms);

  useEffect(() => {
    fetchActivePeriod();
    fetchCurrentCycle();
    fetchCategories();
    fetchQuote();
    fetchTodayJournalPreview();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTodayJournalPreview();
    }, []),
  );

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getJournalFromDailyLog(data: DailyLogResponse) {
    if (data.journal) {
      return {
        entry: data.journal.entry ?? "",
        feeling: data.journal.feeling ?? null,
      };
    }
    return {
      entry: data.entry ?? "",
      feeling: data.feeling ?? null,
    };
  }

  function truncateText(text: string, maxLength = 70) {
    const trimmed = text.trim();
    if (!trimmed) return "";
    if (trimmed.length <= maxLength) return trimmed;
    return `${trimmed.slice(0, maxLength).trim()}...`;
  }

  async function fetchCurrentCycle() {
    try {
      const response = await api.get("/cycles");
      const cycles: Cycle[] = response.data ?? [];
      const activeCycle = cycles.find((cycle) => cycle.end_date === null);
      if (!activeCycle) return setCycleDay(null);
      const today = new Date();
      const todayStr = formatDate(today);
      const start = new Date(`${activeCycle.start_date}T00:00:00`);
      const end = new Date(`${todayStr}T00:00:00`);
      const day =
        Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
        1;
      setCycleDay(day > 0 ? day : null);
    } catch (error) {
      console.error("Failed to fetch current cycle:", error);
      setCycleDay(null);
    }
  }

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

  async function fetchCategories() {
    try {
      const [catRes, symRes] = await Promise.all([
        api.get("/categories"),
        api.get("/symptoms"),
      ]);

      const cats: Category[] = catRes.data.map((cat: any) => ({
        ...cat,
        symptoms: symRes.data.filter((s: Symptom) => s.category_id === cat.id),
      }));

      setCategories(cats);
    } catch (error) {
      console.error("Failed to fetch categories/symptoms:", error);
    }
  }

  async function fetchOrCreateTodayLog(): Promise<number | null> {
    try {
      const response = await api.post("/daily-logs", { date: todayString });
      const logId = response.data.id;
      setTodayLogId(logId);
      return logId;
    } catch (error: any) {
      const message = error.response?.data?.message;
      Alert.alert("Error", message ?? "Could not create today's log.");
      return null;
    }
  }

  async function fetchTodayJournalPreview() {
    try {
      const logId = await fetchOrCreateTodayLog();
      if (!logId) {
        setJournalPreview("");
        setJournalFeeling(null);
        setSavedSymptomNames([]);
        return;
      }

      const response = await api.get(`/daily-logs/${logId}`);
      const log: DailyLogResponse = response.data;
      const journal = getJournalFromDailyLog(log);

      setJournalPreview(truncateText(journal.entry ?? ""));
      setJournalFeeling(
        journal.feeling
          ? (apiFeelingToLabel[journal.feeling.toLowerCase()] ?? null)
          : null,
      );

      const names: string[] =
        log.daily_symptoms
          ?.map((ds: any) => ds.symptom?.name)
          .filter(Boolean) ?? [];
      setSavedSymptomNames(names);
      setSelectedSymptomIds(
        log.daily_symptoms?.map((ds: any) => ds.symptom_id).filter(Boolean) ??
          [],
      );
    } catch (error) {
      console.error("Failed to fetch journal preview:", error);
      setJournalPreview("");
      setJournalFeeling(null);
      setSavedSymptomNames([]);
    }
  }

  async function handleOpenSymptomsModal() {
    const logId = await fetchOrCreateTodayLog();
    if (!logId) return;
    setTodayLogId(logId);
    setShowSymptomsModal(true);
  }

  async function handleOpenJournal() {
    setOpeningJournal(true);
    try {
      const logId = await fetchOrCreateTodayLog();
      if (!logId) return;
      router.push({
        pathname: "/journal",
        params: { dailyLogId: String(logId) },
      });
    } finally {
      setOpeningJournal(false);
    }
  }

  async function saveSymptoms() {
    if (!todayLogId || selectedSymptomIds.length === 0) {
      setShowSymptomsModal(false);
      return;
    }

    setSavingSymptoms(true);
    try {
      await api.post(`/daily-logs/${todayLogId}/symptoms`, {
        items: selectedSymptomIds.map((id) => ({ symptom_id: id })),
      });
      const names = selectedSymptomIds
        .map((id) => allSymptoms.find((s) => s.id === id)?.name)
        .filter((name): name is string => Boolean(name));
      setSavedSymptomNames(names);
      setShowSymptomsModal(false);
    } catch (error: any) {
      Alert.alert("Error", "Failed to save symptoms. Please try again.");
    } finally {
      setSavingSymptoms(false);
    }
  }

  async function fetchActivePeriod() {
    try {
      const response = await api.get("/periods");
      const periods = response.data;
      const active = periods.find((p: any) => p.end_date === null);
      setActivePeriod(active ?? null);
    } catch (error) {
      console.error("Failed to fetch periods:", error);
    }
  }

  async function handleLogPeriod() {
    if (!selectedPeriod) {
      Alert.alert("Select Flow", "Please select a flow level before logging.");
      return;
    }

    setLoggingPeriod(true);
    try {
      const { flow, has_clots } = flowMap[selectedPeriod];
      let periodId: number;

      if (activePeriod) {
        periodId = activePeriod.id;
      } else {
        const periodResponse = await api.post("/periods", {
          start_date: todayString,
        });
        periodId = periodResponse.data.period.id;
        await fetchActivePeriod();
      }

      await api.put(`/periods/${periodId}/days`, {
        date: todayString,
        flow,
        has_clots,
      });

      Alert.alert("Logged!", `Period logged as ${selectedPeriod} for today.`);
      setSelectedPeriod(null);
    } catch (error: any) {
      const message = error.response?.data?.message;
      Alert.alert(
        "Error",
        message ?? "Failed to log period. Please try again.",
      );
    } finally {
      setLoggingPeriod(false);
    }
  }

  async function handleEndPeriodToday() {
    if (!activePeriod) {
      Alert.alert("No Active Period", "There is no active period to end.");
      return;
    }

    setEndingPeriod(true);
    try {
      await api.put(`/periods/${activePeriod.id}`, { end_date: todayString });
      Alert.alert("Period Ended", `Your period was ended on ${todayString}.`);
      setSelectedPeriod(null);
      await fetchActivePeriod();
    } catch (error: any) {
      const message = error.response?.data?.message;
      Alert.alert(
        "Error",
        message ?? "Failed to end period. Please try again.",
      );
    } finally {
      setEndingPeriod(false);
    }
  }

  function toggleSymptom(symptomId: number) {
    setSelectedSymptomIds((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId],
    );
  }

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 32,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <DateChips days={days} />

        <DayCard date={formattedToday} cycleDay={cycleDay ?? 0} />

        <View className="mt-5">
          <QuoteCard quote={quote} />
        </View>

        <View className="mt-5">
          <SectionCard
            title={
              savedSymptomNames.length > 0
                ? "Symptoms logged today"
                : "How are you feeling?"
            }
          >
            {savedSymptomNames.length > 0 ? (
              <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                {savedSymptomNames.map((name) => (
                  <View
                    key={name}
                    className="rounded-full px-3 py-1"
                    style={{
                      backgroundColor: theme.accent,
                    }}
                  >
                    <Text
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      {name}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              // Default state — show feeling picker
              <View className="flex-row flex-wrap gap-2">
                {feelingSymptoms.map((symptom) => (
                  <PillButton
                    key={symptom.id}
                    label={symptom.name}
                    selected={selectedSymptomIds.includes(symptom.id)}
                    onPress={() => toggleSymptom(symptom.id)}
                  />
                ))}
              </View>
            )}

            <View className="items-end mt-4">
              <Pressable
                className="rounded-full px-4 py-2"
                style={{ backgroundColor: theme.primary }}
                onPress={handleOpenSymptomsModal}
              >
                <Text className="text-xs" style={{ color: theme.text }}>
                  Log more...
                </Text>
              </Pressable>
            </View>
          </SectionCard>
        </View>

        <View className="mt-4">
          <SectionCard title="Period Tracking">
            {activePeriod ? (
              <Text
                className="text-xs mb-3"
                style={{ color: theme.textSecondary }}
              >
                Period active since {activePeriod.start_date}
              </Text>
            ) : (
              <Text
                className="text-xs mb-3"
                style={{ color: theme.textSecondary }}
              >
                No active period — logging will start a new one
              </Text>
            )}

            <View className="flex-row flex-wrap gap-2 mb-4">
              {periodOptions.map((option) => (
                <PillButton
                  key={option}
                  label={option}
                  selected={selectedPeriod === option}
                  onPress={() => setSelectedPeriod(option)}
                />
              ))}
            </View>

            <LargeButton
              title={loggingPeriod ? "Logging..." : "Log Period"}
              disabled={loggingPeriod || !selectedPeriod}
              onPress={handleLogPeriod}
            />

            {activePeriod && (
              <View className="mt-4">
                <LargeButton
                  title={endingPeriod ? "Ending Period..." : "End Period Today"}
                  backgroundColor={theme.danger}
                  textColor={theme.dangerText}
                  disabled={endingPeriod}
                  onPress={handleEndPeriodToday}
                />
              </View>
            )}
          </SectionCard>
        </View>

        <View className="mt-4">
          <SectionCard
            title="Journal"
            rightContent={
              <Pressable onPress={() => router.push("/all-journals")}>
                <Text
                  className="text-xs underline"
                  style={{ color: theme.textSecondary }}
                >
                  View All
                </Text>
              </Pressable>
            }
          >
            <Text
              className="text-sm mb-4"
              style={{ color: theme.textSecondary }}
            >
              {journalPreview || "No journal entry for today yet."}
            </Text>

            <LargeButton
              title={openingJournal ? "Opening..." : "Open Journal"}
              disabled={openingJournal}
              onPress={handleOpenJournal}
            />
          </SectionCard>
        </View>
      </ScrollView>

      <Modal
        visible={showSymptomsModal}
        animationType="slide"
        transparent
        onRequestClose={saveSymptoms}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.25)",
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={saveSymptoms} />

          <View
            style={{
              backgroundColor: theme.backgroundElement,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 30,
              maxHeight: "90%",
            }}
          >
            <View className="items-center mb-4">
              <View
                style={{
                  width: 48,
                  height: 5,
                  borderRadius: 999,
                  backgroundColor: theme.backgroundSelected,
                }}
              />
            </View>

            <ScrollView
              showsVerticalScrollIndicator
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <Text
                className="text-xl font-semibold mb-4"
                style={{ color: theme.text }}
              >
                Log more symptoms
              </Text>

              {categories.map((category) => (
                <SymptomCategorySection
                  key={category.id}
                  title={category.name}
                  symptoms={category.symptoms.map((s) => s.name)}
                  selectedSymptoms={category.symptoms
                    .filter((s) => selectedSymptomIds.includes(s.id))
                    .map((s) => s.name)}
                  onToggleSymptom={(name) => {
                    const symptom = category.symptoms.find(
                      (s) => s.name === name,
                    );
                    if (symptom) toggleSymptom(symptom.id);
                  }}
                />
              ))}

              <LargeButton
                title={savingSymptoms ? "Saving..." : "Save"}
                disabled={savingSymptoms}
                onPress={saveSymptoms}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
