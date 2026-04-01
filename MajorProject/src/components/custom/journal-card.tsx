import { Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "react-native";

export interface JournalEntry {
  id: number;
  daily_log_id: number;
  entry: string | null;
  feeling: "great" | "good" | "okay" | "low" | "awful" | null;
  created_at?: string;
  updated_at?: string;
  daily_log?: {
    id: number;
    cycle_id: number;
    date: string;
  };
}

interface JournalCardProps {
  journal: JournalEntry;
}

function formatDate(dateString?: string) {
  if (!dateString) return "Unknown date";
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatFeeling(
  feeling: JournalEntry["feeling"],
): "Great" | "Good" | "Okay" | "Low" | "Awful" | null {
  if (!feeling) return null;
  switch (feeling) {
    case "great":
      return "Great";
    case "good":
      return "Good";
    case "okay":
      return "Okay";
    case "low":
      return "Low";
    case "awful":
      return "Awful";
    default:
      return null;
  }
}

export function JournalCard({ journal }: JournalCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const feelingLabel = formatFeeling(journal.feeling);

  function getMoodColor(feeling: JournalEntry["feeling"]) {
    switch (feeling) {
      case "great":
        return theme.primary;
      case "good":
        return theme.primary;
      case "okay":
        return theme.secondary;
      case "low":
        return theme.secondary;
      case "awful":
        return theme.accent;
      default:
        return theme.backgroundSelected;
    }
  }

  return (
    <View
      className="rounded-3xl border p-4"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundSelected,
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <Text
          className="text-sm font-semibold flex-1 pr-3"
          style={{ color: theme.text }}
        >
          {formatDate(journal.daily_log?.date)}
        </Text>

        {feelingLabel && (
          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: getMoodColor(journal.feeling) }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: theme.background }}
            >
              {feelingLabel}
            </Text>
          </View>
        )}
      </View>

      <Text
        className="text-sm leading-6"
        style={{ color: theme.textSecondary }}
      >
        {journal.entry?.trim() || "No journal text for this entry."}
      </Text>
    </View>
  );
}
