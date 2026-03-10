import { useMemo, useState } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { Calendar } from "react-native-calendars";

import { Colors } from "../../constants/theme";

export default function CalendarPage() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const displayDate = selectedDate ?? todayString;

  const darkerPrimary = "#9FBFBE";

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
        <View
          className="mt-5 rounded-3xl overflow-hidden mb-4"
          style={{ backgroundColor: theme.accent }}
        >
          <View className="p-4">
            <View
              className="rounded-2xl px-4 py-4"
              style={{
                backgroundColor: theme.accent,
              }}
            >
              <Text
                className="text-2xl font-semibold"
                style={{ color: theme.text }}
              >
                Cycle Day 14
              </Text>
            </View>
          </View>
        </View>

        {/* Calendar Card */}
        <View
          className="rounded-3xl border p-4"
          style={{
            backgroundColor: theme.backgroundElement,
            borderColor: theme.backgroundSelected,
          }}
        >
          <Calendar
            current={todayString}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            hideExtraDays={false}
            firstDay={0}
            enableSwipeMonths
            theme={{
              backgroundColor: theme.backgroundElement,
              calendarBackground: theme.backgroundElement,
              textSectionTitleColor: theme.textSecondary,
              monthTextColor: theme.text,
              dayTextColor: theme.text,
              textDisabledColor: theme.textSecondary,
              todayTextColor: theme.text,
              arrowColor: theme.text,
              textMonthFontSize: 22,
              textMonthFontWeight: "700",
              textDayFontSize: 15,
              textDayHeaderFontSize: 12,
              textDayFontWeight: "500",
              textDayHeaderFontWeight: "600",
            }}
            dayComponent={({ date }) => {
              if (!date) return null;

              const isToday = date.dateString === todayString;
              const isSelected = date.dateString === selectedDate;

              let backgroundColor = "transparent";
              let textColor = theme.text;

              if (isSelected) {
                backgroundColor = darkerPrimary;
              } else if (isToday) {
                backgroundColor = theme.primary;
              }

              return (
                <Pressable
                  onPress={() => setSelectedDate(date.dateString)}
                  className="items-center justify-center"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor,
                    marginVertical: 4,
                  }}
                >
                  <Text style={{ color: textColor, fontWeight: "500" }}>
                    {date.day}
                  </Text>
                </Pressable>
              );
            }}
            style={{
              borderRadius: 20,
            }}
          />
        </View>

        {/* Legend */}
        <View
          className="mt-4 rounded-2xl border px-4 py-5"
          style={{
            backgroundColor: theme.backgroundElement,
            borderColor: theme.backgroundSelected,
          }}
        >
          <View className="flex-row items-center">
            <View className="mr-6 flex-row items-center">
              <View
                className="h-3 w-3 rounded-full mr-2"
                style={{ backgroundColor: theme.primary }}
              />
              <Text style={{ color: theme.textSecondary }}>Today</Text>
            </View>

            <View className="flex-row items-center">
              <View
                className="h-3 w-3 rounded-full mr-2"
                style={{ backgroundColor: theme.secondary }}
              />
              <Text style={{ color: theme.textSecondary }}>Period Day</Text>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View
          className="mt-5 rounded-3xl overflow-hidden"
          style={{ backgroundColor: theme.accent }}
        >
          <View className="p-4">
            <View
              className="rounded-2xl px-4 py-4"
              style={{
                backgroundColor: theme.accent,
              }}
            >
              <Text
                className="text-2xl font-semibold"
                style={{ color: theme.text }}
              >
                {infoTitle}
              </Text>
              <Text
                className="mt-1 text-base"
                style={{ color: theme.textSecondary }}
              >
                You haven’t added anything for this date
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
