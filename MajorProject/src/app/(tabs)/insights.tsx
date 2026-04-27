import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";

import { useTheme } from "@/context/ThemeContext";
import api from "@/lib/axios";
import { QuoteCard } from "../../components/custom/quote-card";
import { StatCard } from "../../components/custom/stat-card";
import { SymptomsCard } from "../../components/custom/symptom-stat-card";
import { Colors } from "../../constants/theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const H_PADDING = 20;
const CARD_INNER_WIDTH = SCREEN_WIDTH - H_PADDING * 2;
const CHART_WIDTH = CARD_INNER_WIDTH - 40;

interface Period {
  id: number;
  cycle_id: number;
  start_date: string;
  end_date: string | null;
}

interface Cycle {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string | null;
  cycle_length: number | null;
  periods: Period[];
}

interface Journal {
  id: number;
  daily_log_id: number;
  feeling: "great" | "good" | "okay" | "low" | "awful" | null;
  daily_log?: {
    id: number;
    cycle_id: number;
    date: string;
  };
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

type ChartPoint = {
  value: number;
  label: string;
};

const FEELING_SCORE: Record<string, number> = {
  awful: 1,
  low: 2,
  okay: 3,
  good: 4,
  great: 5,
};

export default function Insights() {
  const { themeName, setTheme } = useTheme();
  const theme = Colors[themeName];

  const [quote, setQuote] = useState("Patterns take time — keep logging.");

  const [avgCycleLength, setAvgCycleLength] = useState<string>("—");
  const [avgPeriodLength, setAvgPeriodLength] = useState<string>("—");
  const [topSymptoms, setTopSymptoms] = useState<SymptomItem[]>([]);

  const [cycleLengthData, setCycleLengthData] = useState<ChartPoint[]>([]);
  const [periodLengthData, setPeriodLengthData] = useState<ChartPoint[]>([]);
  const [moodData, setMoodData] = useState<ChartPoint[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [activeChart, setActiveChart] = useState(0);

  const carouselRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchQuote();
    fetchCycleStats();
    fetchSymptomStats();
    fetchMoodStats();
  }, []);

  async function fetchCycleStats() {
    try {
      const response = await api.get("/cycles");
      const cycles: Cycle[] = response.data ?? [];

      if (cycles.length === 0) {
        setShowModal(true);
        return;
      }

      const cyclesWithLength = cycles.filter((c) => c.cycle_length !== null);

      if (cyclesWithLength.length > 0) {
        const total = cyclesWithLength.reduce(
          (sum, c) => sum + (c.cycle_length as number),
          0,
        );
        setAvgCycleLength((total / cyclesWithLength.length).toFixed(1));
      }

      const periodLengths: number[] = [];
      const periodChartPoints: ChartPoint[] = [];

      for (const cycle of cycles) {
        for (const period of cycle.periods) {
          if (period.start_date && period.end_date) {
            const start = new Date(period.start_date);
            const end = new Date(period.end_date);
            const days =
              Math.round(
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
              ) + 1;
            if (days > 0) {
              periodLengths.push(days);
              periodChartPoints.push({
                value: days,
                label: start.toLocaleDateString("en-GB", { month: "short" }),
              });
            }
          }
        }
      }

      if (periodLengths.length > 0) {
        const total = periodLengths.reduce((sum, d) => sum + d, 0);
        setAvgPeriodLength((total / periodLengths.length).toFixed(1));
      }

      setPeriodLengthData(periodChartPoints.slice(-6));

      const chartPoints = cyclesWithLength.slice(-6).map((c) => ({
        value: c.cycle_length as number,
        label: new Date(`${c.start_date}T00:00:00`).toLocaleDateString(
          "en-GB",
          { month: "short" },
        ),
      }));
      setCycleLengthData(chartPoints);
    } catch (error) {
      console.error("Failed to fetch cycle stats:", error);
    }
  }

  async function fetchMoodStats() {
    try {
      const response = await api.get("/journals");
      const journals: Journal[] = response.data ?? [];

      const points: ChartPoint[] = journals
        .filter((j) => j.feeling && j.daily_log?.date)
        .reverse()
        .slice(-6)
        .map((j) => ({
          value: FEELING_SCORE[j.feeling!] ?? 3,
          label: new Date(`${j.daily_log!.date}T00:00:00`).toLocaleDateString(
            "en-GB",
            { month: "short", day: "numeric" },
          ),
        }));

      setMoodData(points);
    } catch (error) {
      console.error("Failed to fetch mood stats:", error);
    }
  }

  async function fetchSymptomStats() {
    try {
      const response = await api.get("/daily-logs");
      const logs: DailyLog[] = response.data ?? [];

      const countMap: Record<string, number> = {};
      for (const log of logs) {
        for (const ds of log.daily_symptoms ?? []) {
          const name = ds.symptom?.name;
          if (name) {
            countMap[name] = (countMap[name] ?? 0) + 1;
          }
        }
      }

      const sorted = Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

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

  function getLineBounds(data: ChartPoint[]) {
    const values = data.map((d) => d.value);
    return {
      max: Math.max(...values) + 4,
      min: Math.max(0, Math.min(...values) - 4),
    };
  }

  function handleCarouselScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveChart(index);
  }

  const charts = [
    {
      title: "Cycle Length Trend",
      subtitle: `Last ${cycleLengthData.length} cycles (days)`,
      data: cycleLengthData,
      type: "line" as const,
    },
    {
      title: "Period Length Trend",
      subtitle: `Last ${periodLengthData.length} periods (days)`,
      data: periodLengthData,
      type: "line" as const,
    },
    {
      title: "Mood Over Time",
      subtitle: "How you've been feeling",
      data: moodData,
      type: "bar" as const,
    },
  ].filter((c) => c.data.length > 0);

  return (
    <>
      {/* No data modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View
          className="flex-1 items-center justify-center px-8"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <View
            className="rounded-3xl p-7 w-full"
            style={{ backgroundColor: theme.backgroundElement }}
          >
            <View
              className="h-16 w-16 rounded-full items-center justify-center mb-5 self-center"
              style={{ backgroundColor: theme.primary + "33" }}
            ></View>

            <Text
              className="text-2xl font-bold text-center mb-3"
              style={{ color: theme.text }}
            >
              Your insights are on their way
            </Text>

            <Text
              className="text-sm text-center leading-6 mb-2"
              style={{ color: theme.textSecondary }}
            >
              Once you start logging your cycle, symptoms, and daily notes, your
              personal insights will appear here.
            </Text>

            <Text
              className="text-sm text-center leading-6 mb-7"
              style={{ color: theme.textSecondary }}
            >
              After your first full cycle, you'll start to see trends like
              average cycle length, period duration, and your most common
              symptoms.
            </Text>

            <Pressable
              onPress={() => setShowModal(false)}
              className="rounded-2xl py-4 items-center"
              style={{ backgroundColor: theme.primary }}
            >
              <Text
                className="font-semibold text-base"
                style={{ color: theme.background }}
              >
                Got it
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={{ paddingTop: 32, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* Top stats */}
        <View className="flex-row gap-4 px-5">
          <StatCard title="Avg Cycle" value={avgCycleLength} label="days" />
          <StatCard title="Avg Period" value={avgPeriodLength} label="days" />
        </View>

        {/* Quote Card */}
        <View className="mt-5 px-5">
          <QuoteCard quote={quote} />
        </View>

        {/* Chart carousel */}
        {charts.length > 0 && (
          <View className="mt-5">
            <ScrollView
              ref={carouselRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleCarouselScroll}
              scrollEventThrottle={16}
              decelerationRate="fast"
            >
              {charts.map((chart, index) => {
                const bounds =
                  chart.type === "line" ? getLineBounds(chart.data) : null;

                return (
                  <View
                    key={index}
                    style={{
                      width: SCREEN_WIDTH,
                      paddingHorizontal: H_PADDING,
                    }}
                  >
                    <View
                      className="rounded-3xl p-5"
                      style={{
                        backgroundColor: theme.backgroundElement,
                        borderColor: theme.backgroundSelected,
                        borderWidth: 1,
                      }}
                    >
                      <Text
                        className="text-2xl font-semibold mb-1"
                        style={{ color: theme.text }}
                      >
                        {chart.title}
                      </Text>
                      <Text
                        className="text-sm mb-5"
                        style={{ color: theme.textSecondary }}
                      >
                        {chart.subtitle}
                      </Text>

                      {chart.type === "line" && bounds && (
                        <LineChart
                          data={chart.data}
                          width={CHART_WIDTH}
                          height={160}
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
                          yAxisTextStyle={{
                            color: theme.textSecondary,
                            fontSize: 11,
                          }}
                          xAxisLabelTextStyle={{
                            color: theme.textSecondary,
                            fontSize: 11,
                          }}
                          rulesColor={theme.backgroundSelected}
                          rulesType="dashed"
                          yAxisColor="transparent"
                          xAxisColor="transparent"
                          noOfSections={4}
                          maxValue={bounds.max}
                          mostNegativeValue={bounds.min}
                          backgroundColor={theme.backgroundElement}
                          initialSpacing={10}
                          endSpacing={10}
                          isAnimated
                        />
                      )}

                      {chart.type === "bar" && (
                        <BarChart
                          data={chart.data.map((d) => ({
                            value: d.value,
                            label: d.label,
                            frontColor:
                              d.value >= 4
                                ? theme.primary
                                : d.value === 3
                                  ? theme.secondary
                                  : theme.accent,
                          }))}
                          width={CHART_WIDTH}
                          height={160}
                          barWidth={26}
                          barBorderRadius={6}
                          yAxisTextStyle={{
                            color: theme.textSecondary,
                            fontSize: 11,
                          }}
                          xAxisLabelTextStyle={{
                            color: theme.textSecondary,
                            fontSize: 9,
                          }}
                          rulesColor={theme.backgroundSelected}
                          rulesType="dashed"
                          yAxisColor="transparent"
                          xAxisColor="transparent"
                          noOfSections={4}
                          maxValue={5}
                          yAxisLabelTexts={[
                            "",
                            "Awful",
                            "Low",
                            "Okay",
                            "Good",
                            "Great",
                          ]}
                          backgroundColor={theme.backgroundElement}
                          isAnimated
                        />
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            {/* Dot indicators */}
            {charts.length > 1 && (
              <View className="flex-row justify-center gap-2 mt-3">
                {charts.map((_, i) => (
                  <View
                    key={i}
                    style={{
                      width: i === activeChart ? 16 : 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor:
                        i === activeChart
                          ? theme.primary
                          : theme.backgroundSelected,
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Symptoms */}
        {topSymptoms.length > 0 && (
          <View className="mt-5 px-5">
            <SymptomsCard title="Most Logged Symptoms" symptoms={topSymptoms} />
          </View>
        )}
      </ScrollView>
    </>
  );
}
