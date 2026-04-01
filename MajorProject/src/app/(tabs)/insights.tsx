import { useEffect, useState } from "react";
import { ScrollView, Text, useColorScheme, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

import api from "@/lib/axios";
import { QuoteCard } from "../../components/custom/quote-card";
import { StatCard } from "../../components/custom/stat-card";
import { SymptomsCard } from "../../components/custom/symptom-stat-card";
import { Colors } from "../../constants/theme";

interface Period {
  id: number;
  cycle_id: number;
  start_date: string;
  end_date: string | null;
  created_at?: string;
  updated_at?: string;
}

interface Cycle {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string | null;
  cycle_length: number | null;
  created_at?: string;
  updated_at?: string;
  periods: Period[];
}

interface Symptom {
  id: number;
  name: string;
  category_id: number;
}

interface DailySymptom {
  id: number;
  daily_log_id: number;
  symptom_id: number;
  symptom?: Symptom;
}

interface DailyLog {
  id: number;
  date: string;
  daily_symptoms?: DailySymptom[];
}

type SymptomItem = {
  rank: number;
  name: string;
  count: number;
  width: string;
};

export default function Insights() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [quote, setQuote] = useState("Patterns take time — keep logging.");
  const [chartWidth, setChartWidth] = useState(0);

  const [avgCycleLength, setAvgCycleLength] = useState<string>("—");
  const [avgPeriodLength, setAvgPeriodLength] = useState<string>("—");
  const [topSymptoms, setTopSymptoms] = useState<SymptomItem[]>([]);

  useEffect(() => {
    fetchQuote();
    fetchCycleStats();
    fetchSymptomStats();
  }, []);

  async function fetchCycleStats() {
    try {
      const response = await api.get("/cycles");
      const cycles: Cycle[] = response.data ?? [];

      const cyclesWithLength = cycles.filter((c) => c.cycle_length !== null);
      if (cyclesWithLength.length > 0) {
        const total = cyclesWithLength.reduce(
          (sum, c) => sum + (c.cycle_length as number),
          0,
        );
        setAvgCycleLength((total / cyclesWithLength.length).toFixed(1));
      }

      const periodLengths: number[] = [];
      for (const cycle of cycles) {
        for (const period of cycle.periods) {
          if (period.start_date && period.end_date) {
            const start = new Date(period.start_date);
            const end = new Date(period.end_date);
            const days =
              Math.round(
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
              ) + 1;
            if (days > 0) periodLengths.push(days);
          }
        }
      }

      if (periodLengths.length > 0) {
        const total = periodLengths.reduce((sum, d) => sum + d, 0);
        setAvgPeriodLength((total / periodLengths.length).toFixed(1));
      }
    } catch (error) {
      console.error("Failed to fetch cycle stats:", error);
    }
  }

  async function fetchSymptomStats() {
    try {
      const response = await api.get("/daily-logs");
      const logs: DailyLog[] = response.data ?? [];

      // Count how many times each symptom appears across all logs
      const countMap: Record<string, number> = {};
      for (const log of logs) {
        for (const ds of log.daily_symptoms ?? []) {
          const name = ds.symptom?.name;
          if (name) {
            countMap[name] = (countMap[name] ?? 0) + 1;
          }
        }
      }

      // Sort by count descending, take top 4
      const sorted = Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

      if (sorted.length === 0) {
        setTopSymptoms([]);
        return;
      }

      const maxCount = sorted[0][1];

      const items: SymptomItem[] = sorted.map(([name, count], index) => ({
        rank: index + 1,
        name,
        count,
        width: `${Math.round((count / maxCount) * 100)}%`,
      }));

      setTopSymptoms(items);
    } catch (error) {
      console.error("Failed to fetch symptom stats:", error);
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

  const chartData = [
    { value: 28, label: "Jan" },
    { value: 29, label: "Feb" },
    { value: 28, label: "Mar" },
    { value: 30, label: "Apr" },
    { value: 28, label: "May" },
    { value: 29, label: "Jun" },
  ];

  return (
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
      {/* Top stats */}
      <View className="flex-row gap-4">
        <StatCard title="Avg Cycle" value={avgCycleLength} label="days" />
        <StatCard title="Avg Period" value={avgPeriodLength} label="days" />
      </View>

      {/* Quote Card */}
      <View className="mt-5">
        <QuoteCard quote={quote} />
      </View>

      {/* Line chart */}
      <View
        className="mt-5 rounded-3xl p-5"
        style={{
          backgroundColor: theme.backgroundElement,
          borderColor: theme.backgroundSelected,
          borderWidth: 1,
        }}
        onLayout={(e) => setChartWidth(e.nativeEvent.layout.width - 40)}
      >
        <Text
          className="text-2xl font-semibold mb-1"
          style={{ color: theme.text }}
        >
          Cycle Length Trend
        </Text>
        <Text className="text-sm mb-5" style={{ color: theme.textSecondary }}>
          Last 6 cycles (days)
        </Text>

        {chartWidth > 0 && (
          <LineChart
            data={chartData}
            width={chartWidth}
            height={180}
            curved
            thickness={3}
            color={theme.primary}
            dataPointsColor={theme.primary}
            dataPointsRadius={5}
            startFillColor={theme.primary}
            endFillColor={theme.backgroundElement}
            startOpacity={0.2}
            endOpacity={0}
            areaChart
            yAxisTextStyle={{ color: theme.textSecondary, fontSize: 11 }}
            xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 11 }}
            rulesColor={theme.backgroundSelected}
            rulesType="dashed"
            yAxisColor="transparent"
            xAxisColor="transparent"
            noOfSections={4}
            maxValue={32}
            mostNegativeValue={26}
            backgroundColor={theme.backgroundElement}
            initialSpacing={10}
            endSpacing={10}
            isAnimated
          />
        )}
      </View>

      {/* Symptoms */}
      {topSymptoms.length > 0 && (
        <View className="mt-5">
          <SymptomsCard title="Most Logged Symptoms" symptoms={topSymptoms} />
        </View>
      )}
    </ScrollView>
  );
}
