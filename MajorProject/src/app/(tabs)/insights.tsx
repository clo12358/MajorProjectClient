import { useEffect, useState } from "react";
import { ScrollView, Text, useColorScheme, View } from "react-native";

import { QuoteCard } from "../../components/custom/quote-card";
import { StatCard } from "../../components/custom/stat-card";
import { SymptomsCard } from "../../components/custom/symptom-stat-card";
import { Colors } from "../../constants/theme";

export default function Insights() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [quote, setQuote] = useState("Patterns take time — keep logging.");

  useEffect(() => {
    fetchQuote();
  }, []);

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

  const trendData = [
    { month: "Jan", value: 28 },
    { month: "Feb", value: 29 },
    { month: "Mar", value: 28 },
    { month: "Apr", value: 30 },
    { month: "May", value: 28 },
    { month: "Jun", value: 29 },
  ];

  const symptoms = [
    { rank: 1, name: "Cramps", count: 8, width: "80%" },
    { rank: 2, name: "Mood Swings", count: 6, width: "60%" },
    { rank: 3, name: "Fatigue", count: 5, width: "50%" },
    { rank: 4, name: "Headache", count: 4, width: "40%" },
  ];

  const chartHeight = 120;
  const minValue = 25;
  const maxValue = 32;

  const getY = (value: number) => {
    const range = maxValue - minValue;
    return chartHeight - ((value - minValue) / range) * chartHeight;
  };

  const points = trendData.map((item, index) => {
    const x = 30 + index * 44;
    const y = getY(item.value);
    return { ...item, x, y };
  });

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
        <StatCard title="Avg Cycle" value="28.5" label="days" />
        <StatCard title="Avg Period" value="5.2" label="days" />
      </View>

      {/* Quote Card*/}
      <View className="mt-5">
        <QuoteCard quote={quote} />
      </View>

      {/* Trend chart */}
      <View
        className="mt-5 rounded-3xl border p-5"
        style={{
          backgroundColor: theme.backgroundElement,
          borderColor: theme.backgroundSelected,
        }}
      >
        <Text
          className="text-3xl font-medium mb-5"
          style={{ color: theme.text }}
        >
          Cycle Length Trend
        </Text>

        <View className="flex-row">
          {/* Y axis labels */}
          <View
            className="justify-between mr-3"
            style={{ height: chartHeight }}
          >
            <Text style={{ color: theme.text }}>32</Text>
            <Text style={{ color: theme.text }}>29</Text>
            <Text style={{ color: theme.text }}>27</Text>
            <Text style={{ color: theme.text }}>25</Text>
          </View>

          {/* Chart area */}
          <View className="flex-1">
            <View style={{ height: chartHeight, position: "relative" }}>
              {points.slice(0, -1).map((point, index) => {
                const next = points[index + 1];
                const dx = next.x - point.x;
                const dy = next.y - point.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

                return (
                  <View
                    key={`line-${index}`}
                    style={{
                      position: "absolute",
                      left: point.x,
                      top: point.y,
                      width: length,
                      height: 3,
                      backgroundColor: theme.primary,
                      transform: [{ rotate: `${angle}deg` }],
                      transformOrigin: "left center" as any,
                      borderRadius: 999,
                    }}
                  />
                );
              })}

              {points.map((point, index) => (
                <View
                  key={`dot-${index}`}
                  style={{
                    position: "absolute",
                    left: point.x - 5,
                    top: point.y - 5,
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: theme.primary,
                  }}
                />
              ))}
            </View>

            <View className="flex-row justify-between mt-4 px-2">
              {trendData.map((item) => (
                <Text key={item.month} style={{ color: theme.text }}>
                  {item.month}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <Text
          className="text-center mt-6"
          style={{ color: theme.textSecondary }}
        >
          Last 6 cycles
        </Text>
      </View>

      {/* Symptoms */}
      <View className="mt-5">
        <SymptomsCard title="Most Logged Symptoms" symptoms={symptoms} />
      </View>
    </ScrollView>
  );
}
