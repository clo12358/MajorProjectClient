import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";

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

const MOOD_CONFIG: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; label: string }
> = {
  great: { icon: "heart-outline", label: "Great" },
  good: { icon: "happy-outline", label: "Good" },
  okay: { icon: "remove-circle-outline", label: "Okay" },
  low: { icon: "sad-outline", label: "Low" },
  awful: { icon: "skull-outline", label: "Awful" },
};

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

export function JournalCard({ journal }: JournalCardProps) {
  const { isDark } = useTheme();
  const theme = Colors[isDark ? "dark" : "light"];

  const mood = journal.feeling ? MOOD_CONFIG[journal.feeling] : null;

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

  const moodColor = getMoodColor(journal.feeling);

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

        {mood && (
          <View
            className="rounded-full p-2"
            style={{
              backgroundColor: moodColor + "33",
              borderWidth: 1,
              borderColor: moodColor + "66",
            }}
          >
            <Ionicons name={mood.icon} size={18} color={moodColor} />
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
