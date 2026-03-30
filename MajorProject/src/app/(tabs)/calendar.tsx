import { useEffect, useMemo, useState } from "react";
import { ScrollView, useColorScheme, View } from "react-native";

import api from "@/lib/axios";
import { CalendarCard } from "../../components/custom/calendar-card";
import { InfoCard } from "../../components/custom/info-card";
import { Legend } from "../../components/custom/legend";
import { Colors } from "../../constants/theme";

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

interface DailySymptom {
  id: number;
  symptom?: {
    id: number;
    name: string;
  };
}

interface DailyLog {
  id: number;
  date: string;
  daily_symptoms?: DailySymptom[];
}

function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const todayString = formatDateString(new Date());

export default function CalendarPage() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [periodDates, setPeriodDates] = useState<string[]>([]);
  const [periodLogsByDate, setPeriodLogsByDate] = useState<
    Record<string, PeriodDay>
  >({});
  const [dailyLogsByDate, setDailyLogsByDate] = useState<
    Record<string, DailyLog>
  >({});
  const [cycleDay, setCycleDay] = useState<number | null>(null);

  const displayDate = selectedDate ?? todayString;

  useEffect(() => {
    fetchCalendarData();
    fetchCurrentCycle();
    fetchAllDailyLogs();
  }, []);

  function getDatesInRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const current = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    while (current <= end) {
      dates.push(formatDateString(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  function getDayDifference(startDate: string, endDate: string): number {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    return Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
  }

  async function fetchCurrentCycle() {
    try {
      const response = await api.get("/cycles");
      const cycles: Cycle[] = response.data ?? [];
      const activeCycle = cycles.find((cycle) => cycle.end_date === null);
      if (!activeCycle) return setCycleDay(null);
      const day = getDayDifference(activeCycle.start_date, todayString) + 1;
      setCycleDay(day > 0 ? day : null);
    } catch (error) {
      console.error("Failed to fetch cycles:", error);
      setCycleDay(null);
    }
  }

  async function fetchCalendarData() {
    try {
      const periodsResponse = await api.get("/periods");
      const periods: Period[] = periodsResponse.data ?? [];

      if (periods.length === 0) {
        setPeriodDates([]);
        setPeriodLogsByDate({});
        return;
      }

      const allMarkedDates = periods.flatMap((period) =>
        period.end_date
          ? getDatesInRange(period.start_date, period.end_date)
          : [period.start_date],
      );
      setPeriodDates([...new Set(allMarkedDates)].sort());

      const singlePeriodResponses = await Promise.all(
        periods.map((period) => api.get(`/periods/${period.id}`)),
      );

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

  const symptomNames: string[] =
    dailyLog?.daily_symptoms
      ?.map((ds) => ds.symptom?.name)
      .filter((name): name is string => Boolean(name)) ?? [];

  function getPeriodSubtitle(): string {
    if (selectedDayLog) {
      const { flow, has_clots } = selectedDayLog;
      const capitalised = flow.charAt(0).toUpperCase() + flow.slice(1);
      return has_clots
        ? `${capitalised} flow with blood clots`
        : `${capitalised} flow`;
    }
    if (isPeriodDate) return "Period recorded for this date";
    return "You haven't added anything for this date";
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-8">
          <View className="mt-5 mb-4">
            <InfoCard
              title={cycleDay ? `Cycle Day ${cycleDay}` : "No active cycle"}
            />
          </View>

          <CalendarCard
            todayString={todayString}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            periodDates={periodDates}
          />

          <View className="mt-4">
            <Legend
              items={[
                { label: "Today", color: theme.primaryPressed },
                { label: "Period Day", color: theme.accent },
              ]}
            />
          </View>

          <View className="mt-5">
            <InfoCard
              title={infoTitle}
              subtitle={getPeriodSubtitle()}
              symptoms={symptomNames}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
