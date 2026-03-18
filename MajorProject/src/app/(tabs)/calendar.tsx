import { useMemo, useState } from "react";
import { useColorScheme, View } from "react-native";

import { CalendarCard } from "../../components/custom/calendar-card";
import { InfoCard } from "../../components/custom/info-card";
import { Legend } from "../../components/custom/legend";
import { Colors } from "../../constants/theme";

export default function CalendarPage() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const displayDate = selectedDate ?? todayString;

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  const infoTitle = useMemo(() => formatDate(displayDate), [displayDate]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View className="px-5 pt-8">
        {/* Cycle Card */}
        <View className="mt-5 mb-4">
          <InfoCard title="Cycle Day 14" />
        </View>

        {/* Calendar Card */}
        <CalendarCard
          todayString={todayString}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Legend */}
        <View className="mt-4">
          <Legend
            items={[
              { label: "Today", color: theme.primary },
              { label: "Period Day", color: theme.secondary },
            ]}
          />
        </View>

        {/* Info Card */}
        <View className="mt-5">
          <InfoCard
            title={infoTitle}
            subtitle="You haven’t added anything for this date"
          />
        </View>
      </View>
    </View>
  );
}
