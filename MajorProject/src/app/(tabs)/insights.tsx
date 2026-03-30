import { useEffect, useState } from "react";
import { ScrollView, Text, useColorScheme, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

import { QuoteCard } from "../../components/custom/quote-card";
import { StatCard } from "../../components/custom/stat-card";
import { SymptomsCard } from "../../components/custom/symptom-stat-card";
import { Colors } from "../../constants/theme";

export default function Insights() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [quote, setQuote] = useState("Patterns take time — keep logging.");
  const [chartWidth, setChartWidth] = useState(0);

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

  const symptoms = [
    { rank: 1, name: "Cramps", count: 8, width: "80%" },
    { rank: 2, name: "Mood Swings", count: 6, width: "60%" },
    { rank: 3, name: "Fatigue", count: 5, width: "50%" },
    { rank: 4, name: "Headache", count: 4, width: "40%" },
  ];

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
        <StatCard title="Avg Cycle" value="28.5" label="days" />
        <StatCard title="Avg Period" value="5.2" label="days" />
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
      <View className="mt-5">
        <SymptomsCard title="Most Logged Symptoms" symptoms={symptoms} />
      </View>
    </ScrollView>
  );
}
