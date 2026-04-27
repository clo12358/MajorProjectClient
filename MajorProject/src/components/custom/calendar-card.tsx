import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../../constants/theme";

type CalendarCardProps = {
  todayString: string;
  selectedDate: string | null;
  onSelectDate: (dateString: string) => void;
  periodDates?: string[];
  sexDates?: string[];
};

export function CalendarCard({
  todayString,
  selectedDate,
  onSelectDate,
  periodDates = [],
  sexDates = [],
}: CalendarCardProps) {
  const { themeName, setTheme } = useTheme();
  const theme = Colors[themeName];
  const [calendarKey, setCalendarKey] = useState(0);
  const [visibleMonth, setVisibleMonth] = useState(todayString.slice(0, 7));

  const todayMonth = todayString.slice(0, 7);
  const isOnTodayMonth = visibleMonth === todayMonth;

  function handleGoToToday() {
    onSelectDate(todayString);
    setVisibleMonth(todayMonth);
    setCalendarKey((k) => k + 1);
  }

  return (
    <View
      className="rounded-3xl border p-4"
      aria-label="Calendar"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundSelected,
      }}
    >
      <Calendar
        key={calendarKey}
        current={todayString}
        onDayPress={(day) => onSelectDate(day.dateString)}
        onMonthChange={(month) => setVisibleMonth(month.dateString.slice(0, 7))}
        hideExtraDays={false}
        firstDay={0}
        enableSwipeMonths
        renderHeader={(date) => {
          const monthYear = new Date(date).toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
          });

          return (
            <View
              style={{ width: "100%", paddingHorizontal: 28, marginBottom: 4 }}
            >
              <Text
                style={{ fontSize: 22, fontWeight: "700", color: theme.text }}
              >
                {monthYear}
              </Text>
              {!isOnTodayMonth && (
                <Pressable
                  onPress={handleGoToToday}
                  style={{
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    backgroundColor: theme.primary,
                    borderRadius: 999,
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    marginTop: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: theme.text,
                      letterSpacing: 0.2,
                    }}
                  >
                    Back to Today
                  </Text>
                </Pressable>
              )}
            </View>
          );
        }}
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
          const isPeriodDay = periodDates.includes(date.dateString);
          const isSexDay = sexDates.includes(date.dateString);

          let backgroundColor = "transparent";
          let borderWidth = 0;
          let borderColor = "transparent";
          let textColor = theme.text;

          if (isPeriodDay) backgroundColor = theme.accent;
          if (isToday) backgroundColor = theme.primary;

          if (isSelected) {
            borderWidth = 2;
            borderColor = theme.text;
            if (isToday) backgroundColor = theme.primary;
            else if (isPeriodDay) backgroundColor = theme.accent;
            else backgroundColor = theme.backgroundSelected;
          }

          return (
            <Pressable
              onPress={() => onSelectDate(date.dateString)}
              className="items-center justify-center"
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: isPeriodDay ? "transparent" : backgroundColor,
                borderWidth,
                borderColor,
                marginVertical: 4,
              }}
            >
              {isPeriodDay && (
                <Ionicons
                  name="water"
                  size={34}
                  color={theme.accent}
                  style={{ position: "absolute" }}
                />
              )}
              <Text style={{ color: textColor, fontWeight: "500" }}>
                {date.day}
              </Text>
              {isSexDay && (
                <View
                  style={{
                    position: "absolute",
                    top: -3,
                    right: -3,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: theme.backgroundElement,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="heart" size={10} color={theme.secondary} />
                </View>
              )}
            </Pressable>
          );
        }}
        style={{ borderRadius: 20 }}
      />
    </View>
  );
}
