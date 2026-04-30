import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import api from "@/lib/axios";
import { CalendarCard } from "../../components/custom/calendar-card";
import { InfoCard } from "../../components/custom/info-card";
import { Legend } from "../../components/custom/legend";
import { Colors } from "../../constants/theme";

// These set the shapes of all the data that is going to be fetched from the API
interface Period {
  id: number;
  cycle_id: number;
  start_date: string;
  end_date: string | null;
}

interface PeriodDay {
  id: number;
  period_id: number;
  date: string;
  flow: string;
  has_clots: boolean | number;
}

interface SinglePeriodResponse {
  days?: PeriodDay[];
}

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

interface DailySymptom {
  id: number;
  symptom?: {
    id: number;
    name: string;
    category?: {
      name: string;
    };
  };
}

interface DailyLog {
  id: number;
  date: string;
  daily_symptoms?: DailySymptom[];
}

type SavedSymptom = {
  name: string;
  category: string;
};

// Formats a Date object into YYYY-MM-DD for the API
function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Calculates the number of days between two date strings
function getDayDifference(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

const todayString = formatDateString(new Date());

// The category name used to identify sex related symptoms
const SEX_CATEGORY = "Sex & Sex Drive";

export default function CalendarPage() {
  const { themeName } = useTheme();
  const theme = Colors[themeName];

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [periodDates, setPeriodDates] = useState<string[]>([]);
  const [periodLogsByDate, setPeriodLogsByDate] = useState<
    Record<string, PeriodDay>
  >({});
  const [dailyLogsByDate, setDailyLogsByDate] = useState<
    Record<string, DailyLog>
  >({});
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [hasAnyData, setHasAnyData] = useState<boolean | null>(null);

  // Falls back to today if no date is selected
  const displayDate = selectedDate ?? todayString;

  // Fetch all data
  useEffect(() => {
    fetchCycles();
    fetchCalendarData();
    fetchAllDailyLogs();
    fetchCategories();
  }, []);

  // Fetches symptom categories and combines them with their symptoms
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
      console.error("Failed to fetch categories:", error);
    }
  }

  // Fetches all cycles and sets whether the user has any data at all
  async function fetchCycles() {
    try {
      const response = await api.get("/cycles");
      const fetchedCycles: Cycle[] = response.data ?? [];
      setCycles(fetchedCycles);
      setHasAnyData(fetchedCycles.length > 0);
    } catch (error) {
      console.error("Failed to fetch cycles:", error);
      setHasAnyData(false);
    }
  }

  // Returns all dates between a start and end date as an array
  function getDatesInRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const current = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    // Loop through each day and add it to the array until we reach the end date
    while (current <= end) {
      dates.push(formatDateString(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  // Fetches all periods and builds the list of period dates and day-level logs
  async function fetchCalendarData() {
    try {
      const periodsResponse = await api.get("/periods");
      const periods: Period[] = periodsResponse.data ?? [];

      if (periods.length === 0) {
        setPeriodDates([]);
        setPeriodLogsByDate({});
        return;
      }

      // Builds a flat list of all dates that fall within any period
      const allMarkedDates = periods.flatMap((period) =>
        getDatesInRange(period.start_date, period.end_date ?? todayString),
      );
      setPeriodDates([...new Set(allMarkedDates)].sort());

      // Fetch each period individually to get their day-by-day logs
      const singlePeriodResponses = await Promise.all(
        periods.map((period) => api.get(`/periods/${period.id}`)),
      );

      // Build a lookup object where the key is the date and the value is the period day log
      const byDate: Record<string, PeriodDay> = {};
      singlePeriodResponses
        .flatMap((r) => (r.data as SinglePeriodResponse).days ?? [])
        .forEach((day) => {
          byDate[day.date] = day;
        });

      setPeriodLogsByDate(byDate);
    } catch (error) {
      console.error("Failed to fetch calendar data:", error);
    }
  }

  // Fetches all daily logs and organises them by date for quick lookup
  async function fetchAllDailyLogs() {
    try {
      const response = await api.get("/daily-logs");
      const logs: DailyLog[] = response.data ?? [];
      const byDate: Record<string, DailyLog> = {};
      logs.forEach((log) => {
        byDate[log.date] = log;
      });
      setDailyLogsByDate(byDate);
    } catch (error) {
      console.error("Failed to fetch daily logs:", error);
    }
  }

  // Returns all dates that have a sex related symptom logged
  const sexDates = useMemo(() => {
    return Object.entries(dailyLogsByDate)
      .filter(([_, log]) =>
        log.daily_symptoms?.some(
          (ds) => ds.symptom?.category?.name === SEX_CATEGORY,
        ),
      )
      .map(([date]) => date);
  }, [dailyLogsByDate]);

  // Calculates which day of the cycle the selected date falls on
  const cycleDay = useMemo(() => {
    if (cycles.length === 0) return null;

    const cycle = cycles.find((c) => {
      const afterStart = displayDate >= c.start_date;
      const beforeEnd = c.end_date === null || displayDate <= c.end_date;
      return afterStart && beforeEnd;
    });

    if (!cycle) return null;

    const day = getDayDifference(cycle.start_date, displayDate) + 1;
    return day > 0 ? day : null;
  }, [cycles, displayDate]);

  // Formats the selected date into a readable string for the info card title
  const infoTitle = useMemo(() => {
    const date = new Date(`${displayDate}T00:00:00`);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, [displayDate]);

  const selectedDayLog = periodLogsByDate[displayDate];
  const isPeriodDate = periodDates.includes(displayDate);
  const dailyLog = dailyLogsByDate[displayDate];

  // Builds the list of saved symptoms for the selected date
  const savedSymptoms: SavedSymptom[] = useMemo(() => {
    if (!dailyLog?.daily_symptoms) return [];
    return dailyLog.daily_symptoms
      .map((ds) => {
        const name = ds.symptom?.name;
        if (!name) return null;
        const category =
          ds.symptom?.category?.name ??
          categories.find((c) => c.symptoms.some((s) => s.name === name))
            ?.name ??
          "Symptoms";
        return { name, category };
      })
      .filter(Boolean) as SavedSymptom[];
  }, [dailyLog, categories]);

  const dateHasNoData =
    !selectedDayLog && !isPeriodDate && savedSymptoms.length === 0;

  // Returns the title for the cycle day info card
  function getCycleTitle(): string {
    if (hasAnyData === false) return "Nothing logged yet";
    if (!cycleDay) return "No cycle data for this date";
    return `Cycle Day ${cycleDay}`;
  }

  // Returns the subtitle for the period info card based on what's logged for the selected date
  function getPeriodSubtitle(): string {
    if (hasAnyData === false) {
      return "Start logging your cycle on the home page to see your data here.";
    }
    if (dateHasNoData) {
      return "Nothing logged for this date yet.";
    }
    if (selectedDayLog) {
      const { flow, has_clots } = selectedDayLog;
      // Capitalise the flow value from the API e.g. "heavy" → "Heavy"
      const capitalised = flow.charAt(0).toUpperCase() + flow.slice(1);
      return has_clots
        ? `${capitalised} flow with blood clots`
        : `${capitalised} flow`;
    }
    if (isPeriodDate) return "Period recorded for this date";
    return "Nothing logged for this date yet.";
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-8">
          {/* Cycle day info card */}
          <View className="mt-5 mb-4">
            <InfoCard title={getCycleTitle()} />
          </View>

          {/* Main calendar */}
          <CalendarCard
            todayString={todayString}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            periodDates={periodDates}
            sexDates={sexDates}
          />

          {/* Calendar legend */}
          <View className="mt-4">
            <Legend
              items={[
                { label: "Today", color: theme.primary },
                { label: "Period Day", color: theme.accent, icon: "water" },
                {
                  label: "Sex & Sex Drive",
                  color: theme.secondary,
                  icon: "heart",
                },
              ]}
            />
          </View>

          {/* Selected date info card with symptoms and log button */}
          <View className="mt-5">
            <InfoCard
              title={infoTitle}
              subtitle={getPeriodSubtitle()}
              symptoms={savedSymptoms}
              onLogPress={() =>
                router.navigate({
                  pathname: "/(tabs)/home",
                  params: { date: displayDate },
                })
              }
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
