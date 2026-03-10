import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Colors } from "../../constants/theme";

export default function Home() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  const today = new Date();

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - 3 + index);

    return {
      day: date.getDate().toString(),
      fullDate: date,
      active: index === 3,
    };
  });

  const feelings = [
    "Happy",
    "Sad",
    "Energetic",
    "Relaxed",
    "Anxious",
    "Bored",
    "Tired",
    "Tense",
  ];

  const periodOptions = ["Light", "Medium", "Heavy", "Blood Clots"];

  const formattedToday = today.toLocaleDateString("en-GB", {
    month: "long",
    day: "numeric",
  });

  const cycleStartDate = new Date(today);
  cycleStartDate.setDate(today.getDate() - 9);

  const cycleDay =
    Math.floor(
      (today.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1;

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
      {/* Date chips */}
      <View className="flex-row justify-between mb-5">
        {days.map((item) => (
          <View
            key={item.fullDate.toISOString()}
            className="h-8 w-8 rounded-full items-center justify-center"
            style={{
              backgroundColor: item.active ? theme.primary : theme.secondary,
            }}
          >
            <Text className="text-xs font-medium" style={{ color: theme.text }}>
              {item.day}
            </Text>
          </View>
        ))}
      </View>

      {/* Day card */}
      <Card
        className="rounded-3xl p-6 items-center mb-4 border"
        style={{
          backgroundColor: theme.backgroundElement,
          borderColor: theme.backgroundSelected,
        }}
      >
        <Text className="text-4xl font-bold" style={{ color: theme.primary }}>
          {formattedToday}
        </Text>
        <Text className="mt-2 text-base" style={{ color: theme.text }}>
          Day {cycleDay} of cycle
        </Text>
      </Card>

      {/* Quote card */}
      <View className="rounded-3xl overflow-hidden mb-4">
        <View className="px-5 py-6" style={{ backgroundColor: theme.accent }}>
          <Text className="text-center italic" style={{ color: theme.text }}>
            “The best is yet to come”
          </Text>
        </View>
      </View>

      {/* Feelings */}
      <Card
        className="rounded-3xl p-4 mb-4 border"
        style={{
          backgroundColor: theme.backgroundElement,
          borderColor: theme.backgroundSelected,
        }}
      >
        <Text
          className="text-lg font-semibold mb-3"
          style={{ color: theme.text }}
        >
          How are you feeling?
        </Text>

        <View className="flex-row flex-wrap gap-2">
          {feelings.map((feeling) => {
            const isSelected = selectedFeeling === feeling;

            return (
              <Pressable
                key={feeling}
                onPress={() => setSelectedFeeling(feeling)}
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: isSelected
                    ? theme.secondaryPressed
                    : theme.secondary,
                }}
              >
                <Text className="text-xs" style={{ color: theme.text }}>
                  {feeling}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="items-end mt-4">
          <View
            className="rounded-full px-4 py-2"
            style={{ backgroundColor: theme.primary }}
          >
            <Text className="text-xs" style={{ color: theme.text }}>
              Log more...
            </Text>
          </View>
        </View>
      </Card>

      {/* Period Tracking */}
      <Card
        className="rounded-3xl p-4 mb-4 border"
        style={{
          backgroundColor: theme.backgroundElement,
          borderColor: theme.backgroundSelected,
        }}
      >
        <Text
          className="text-lg font-semibold mb-3"
          style={{ color: theme.text }}
        >
          Period Tracking
        </Text>

        <View className="flex-row flex-wrap gap-2 mb-4">
          {periodOptions.map((option) => {
            const isSelected = selectedPeriod === option;

            return (
              <Pressable
                key={option}
                onPress={() => setSelectedPeriod(option)}
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: isSelected ? "#abbed4" : theme.secondary,
                }}
              >
                <Text className="text-xs" style={{ color: theme.text }}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Button
          className="w-full rounded-2xl py-4"
          style={{ backgroundColor: theme.primary }}
        >
          <Text
            className="font-semibold text-base"
            style={{ color: theme.text }}
          >
            Log Period
          </Text>
        </Button>
      </Card>

      {/* Journal */}
      <Card
        className="rounded-3xl p-4 border"
        style={{
          backgroundColor: theme.backgroundElement,
          borderColor: theme.backgroundSelected,
        }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-semibold" style={{ color: theme.text }}>
            Journal
          </Text>
          <Text className="text-xs" style={{ color: theme.textSecondary }}>
            Latest Entry
          </Text>
        </View>

        <Text className="text-sm mb-4" style={{ color: theme.textSecondary }}>
          Today I felt more energized than usual. Took a nice walk...
        </Text>

        <Button
          className="w-full rounded-2xl py-4"
          style={{ backgroundColor: theme.primary }}
          onPress={() => router.push("/journal")}
        >
          <Text
            className="font-semibold text-base"
            style={{ color: theme.text }}
          >
            Open Journal
          </Text>
        </Button>
      </Card>
    </ScrollView>
  );
}
