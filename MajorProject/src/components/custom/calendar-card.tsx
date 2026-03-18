import { Pressable, Text, useColorScheme, View } from "react-native";
import { Calendar } from "react-native-calendars";

import { Colors } from "../../constants/theme";

type CalendarCardProps = {
  todayString: string;
  selectedDate: string | null;
  onSelectDate: (dateString: string) => void;
};

export function CalendarCard({
  todayString,
  selectedDate,
  onSelectDate,
}: CalendarCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      className="rounded-3xl border p-4"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundSelected,
      }}
    >
      <Calendar
        current={todayString}
        onDayPress={(day) => onSelectDate(day.dateString)}
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
          const textColor = theme.text;

          if (isSelected) {
            backgroundColor = theme.primaryPressed;
          } else if (isToday) {
            backgroundColor = theme.primary;
          }

          return (
            <Pressable
              onPress={() => onSelectDate(date.dateString)}
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
  );
}
