import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../../constants/theme";

const SCREEN_WIDTH = Dimensions.get("window").width - 40;

type DayItem = {
  day: string;
  fullDate: Date;
  active: boolean;
};

type DateChipsProps = {
  days: DayItem[];
  selectedDate: string;
  onSelectDate: (dateString: string) => void;
};

export type DateChipsRef = {
  scrollToToday: () => void;
};

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const todayString = formatDate(new Date());

function getWeekLabel(week: DayItem[]): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const firstMonth = week[0].fullDate.getMonth();
  const lastMonth = week[week.length - 1].fullDate.getMonth();
  const year = week[0].fullDate.getFullYear();

  if (firstMonth === lastMonth) {
    return `${months[firstMonth]} ${year}`;
  }

  const lastYear = week[week.length - 1].fullDate.getFullYear();
  if (year !== lastYear) {
    return `${months[firstMonth]} ${year} / ${months[lastMonth]} ${lastYear}`;
  }

  return `${months[firstMonth]} / ${months[lastMonth]} ${year}`;
}

export const DateChips = forwardRef<DateChipsRef, DateChipsProps>(
  function DateChips({ days, selectedDate, onSelectDate }, ref) {
    const { isDark } = useTheme();
    const theme = Colors[isDark ? "dark" : "light"];
    const scrollRef = useRef<ScrollView>(null);

    const weeks = Array.from({ length: Math.ceil(days.length / 7) }, (_, i) =>
      days.slice(i * 7, i * 7 + 7),
    );

    const totalWeeks = weeks.length;

    const todayWeekIndex = weeks.findIndex((week) =>
      week.some((item) => formatDate(item.fullDate) === todayString),
    );

    const [currentWeek, setCurrentWeek] = useState(
      todayWeekIndex !== -1 ? todayWeekIndex : totalWeeks - 1,
    );

    useEffect(() => {
      const startWeek = todayWeekIndex !== -1 ? todayWeekIndex : totalWeeks - 1;
      scrollRef.current?.scrollTo({
        x: startWeek * SCREEN_WIDTH,
        animated: false,
      });
    }, []);

    useImperativeHandle(ref, () => ({
      scrollToToday() {
        const index = todayWeekIndex !== -1 ? todayWeekIndex : totalWeeks - 1;
        scrollRef.current?.scrollTo({
          x: index * SCREEN_WIDTH,
          animated: true,
        });
        setCurrentWeek(index);
      },
    }));

    function getChipBackground(dateString: string, isSelected: boolean) {
      if (dateString === todayString) return theme.primary;
      if (isSelected) return theme.secondaryPressed;
      return theme.secondary;
    }

    const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

    const weekLabel = weeks[currentWeek]
      ? getWeekLabel(weeks[currentWeek])
      : "";
    const labelParts = weekLabel.split(" ");
    const monthPart = labelParts[0];
    const restPart = labelParts.slice(1).join(" ");

    return (
      <View className="mb-5">
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: theme.textSecondary,
              letterSpacing: 0.2,
            }}
          >
            {monthPart} <Text style={{ fontWeight: "400" }}>{restPart}</Text>
          </Text>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const page = Math.round(
              e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
            );
            if (page !== currentWeek) setCurrentWeek(page);
          }}
          scrollEventThrottle={16}
          snapToInterval={SCREEN_WIDTH}
          decelerationRate="fast"
        >
          {weeks.map((week, weekIndex) => (
            <View
              key={weekIndex}
              style={{ width: SCREEN_WIDTH }}
              className="flex-row justify-between"
            >
              {week.map((item) => {
                const dateString = formatDate(item.fullDate);
                const isSelected = dateString === selectedDate;

                return (
                  <TouchableOpacity
                    key={item.fullDate.toISOString()}
                    onPress={() => onSelectDate(dateString)}
                    style={{ alignItems: "center", gap: 4 }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "500",
                        color: theme.textSecondary,
                      }}
                    >
                      {DAY_LABELS[item.fullDate.getDay()]}
                    </Text>
                    <View
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: getChipBackground(
                          dateString,
                          isSelected,
                        ),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight:
                            isSelected || dateString === todayString
                              ? "700"
                              : "500",
                          color: theme.text,
                        }}
                      >
                        {item.day}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>

        <View className="flex-row justify-center mt-2" style={{ gap: 4 }}>
          {weeks.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === currentWeek ? 16 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor:
                  i === currentWeek ? theme.primary : theme.secondary,
              }}
            />
          ))}
        </View>
      </View>
    );
  },
);
