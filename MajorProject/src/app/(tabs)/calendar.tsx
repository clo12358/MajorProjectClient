import { useEffect, useMemo, useState } from "react";
import { useColorScheme, View } from "react-native";

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
  created_at?: string;
  updated_at?: string;
}

interface PeriodDay {
  id: number;
  period_id: number;
  date: string;
  flow: string;
  has_clots: boolean | number;
  created_at?: string;
  updated_at?: string;
}

interface SinglePeriodResponse {
  id: number;
  cycle_id: number;
  start_date: string;
  end_date: string | null;
  created_at?: string;
  updated_at?: string;
  cycle?: {
    id: number;
    user_id: number;
    start_date: string;
    end_date: string | null;
    cycle_length: number | null;
    created_at?: string;
    updated_at?: string;
  };
  days?: PeriodDay[];
}

interface Cycle {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string | null;
  cycle_length: number | null;
  created_at?: string;
  updated_at?: string;
  periods?: Period[];
}

export default function CalendarPage() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];
  const today = new Date();
  const todayString = formatDateString(today);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [periodDates, setPeriodDates] = useState<string[]>([]);
  const [periodLogsByDate, setPeriodLogsByDate] = useState<
    Record<string, PeriodDay>
  >({});
  const [cycleDay, setCycleDay] = useState<number | null>(null);

  const displayDate = selectedDate ?? todayString;

  useEffect(() => {
    fetchCalendarData();
    fetchCurrentCycle();
  }, []);

  function formatDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getDatesInRange(startDate: string, endDate: string) {
    const dates: string[] = [];
    const current = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    while (current <= end) {
      dates.push(formatDateString(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  function getDayDifference(startDate: string, endDate: string) {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    const diffMs = end.getTime() - start.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  async function fetchCurrentCycle() {
    try {
      const response = await api.get("/cycles");
      const cycles: Cycle[] = response.data ?? [];

      const activeCycle = cycles.find((cycle) => cycle.end_date === null);

      if (!activeCycle) {
        setCycleDay(null);
        return;
      }

      const currentCycleDay =
        getDayDifference(activeCycle.start_date, todayString) + 1;

      setCycleDay(currentCycleDay > 0 ? currentCycleDay : null);
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

      const allMarkedDates: string[] = [];

      periods.forEach((period) => {
        if (period.end_date) {
          allMarkedDates.push(
            ...getDatesInRange(period.start_date, period.end_date),
          );
        } else {
          allMarkedDates.push(period.start_date);
        }
      });

      const uniqueMarkedDates = [...new Set(allMarkedDates)].sort();
      setPeriodDates(uniqueMarkedDates);

      const singlePeriodResponses = await Promise.all(
        periods.map((period) => api.get(`/periods/${period.id}`)),
      );

      const allDays: PeriodDay[] = singlePeriodResponses.flatMap((response) => {
        const periodData: SinglePeriodResponse = response.data;
        return periodData.days ?? [];
      });

      const byDate: Record<string, PeriodDay> = {};
      allDays.forEach((day) => {
        byDate[day.date] = day;
      });

      setPeriodLogsByDate(byDate);
    } catch (error) {
      console.error("Failed to fetch calendar data:", error);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  const infoTitle = useMemo(() => formatDate(displayDate), [displayDate]);

  const selectedDayLog = periodLogsByDate[displayDate];
  const isPeriodDate = periodDates.includes(displayDate);

  function formatFlow(flow?: string, hasClots?: boolean | number) {
    if (!flow) return null;

    const capitalisedFlow = flow.charAt(0).toUpperCase() + flow.slice(1);

    if (hasClots) {
      return `${capitalisedFlow} flow with blood clots`;
    }

    return `${capitalisedFlow} flow`;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
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
            subtitle={
              selectedDayLog
                ? (formatFlow(selectedDayLog.flow, selectedDayLog.has_clots) ??
                  "Period logged for this date")
                : isPeriodDate
                  ? "Period recorded for this date"
                  : "You haven’t added anything for this date"
            }
          />
        </View>
      </View>
    </View>
  );
}
