import { router } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { LargeButton } from "../../components/custom/large-button";
import { QuoteCard } from "../../components/custom/quote-card";
import { Card } from "../../components/ui/card";
import { Colors } from "../../constants/theme";

export default function Home() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [showSymptomsModal, setShowSymptomsModal] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

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

  const symptomCategories = {
    Mood: [
      "Happy",
      "Sad",
      "Energetic",
      "Relaxed",
      "Anxious",
      "Bored",
      "Tired",
      "Tense",
    ],
    Symptoms: [
      "Cramps",
      "Bloating",
      "Headache",
      "Nausea",
      "Back Pain",
      "Breast Tenderness",
      "Acne",
      "Fatigue",
      "Mood Swings",
      "Insomnia",
      "Dizziness",
      "Hot Flushes",
      "Spotting",
    ],
    "Vaginal Discharge": [
      "Normal",
      "Watery",
      "Stretchy",
      "Thick",
      "Brown",
      "Yellow",
      "Unusual odor",
      "Excessive",
    ],
    "Energy Level": ["Very Low", "Low", "Normal", "High", "Very High"],
    Cravings: [
      "Sweet",
      "Salty",
      "Savory",
      "Chocolate",
      "Carbs",
      "Fruits",
      "Vegetables",
    ],
    "PCOS Symptoms": [
      "Irregular periods",
      "Weight gain",
      "Excess hair growth",
      "Thinning hair",
      "Dark skin patches",
      "Skin tags",
      "Fertility issues",
    ],
    "Endometriosis Symptoms": [
      "Severe cramps",
      "Chronic pelvic pain",
      "Heavy bleeding",
      "Painful intercourse",
      "Bowel symptoms",
      "Bladder symptoms",
    ],
  };

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
    <>
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
              <Text
                className="text-xs font-medium"
                style={{ color: theme.text }}
              >
                {item.day}
              </Text>
            </View>
          ))}
        </View>

        {/* Day card */}
        <Card
          className="rounded-3xl p-6 items-center border"
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

        {/* Quote Card */}
        <View className="mt-5">
          <QuoteCard quote="The best is yet to come" />
        </View>

        {/* Feelings */}
        <Card
          className="rounded-3xl p-4 mb-4 mt-5 border"
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
            <Pressable
              className="rounded-full px-4 py-2"
              style={{ backgroundColor: theme.primary }}
              onPress={() => setShowSymptomsModal(true)}
            >
              <Text className="text-xs" style={{ color: theme.text }}>
                Log more...
              </Text>
            </Pressable>
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
                    backgroundColor: isSelected
                      ? theme.secondaryPressed
                      : theme.secondary,
                  }}
                >
                  <Text className="text-xs" style={{ color: theme.text }}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <LargeButton title="Log Period" />
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
            <Text
              className="text-lg font-semibold"
              style={{ color: theme.text }}
            >
              Journal
            </Text>
            <Text className="text-xs" style={{ color: theme.textSecondary }}>
              Latest Entry
            </Text>
          </View>

          <Text className="text-sm mb-4" style={{ color: theme.textSecondary }}>
            Today I felt more energized than usual. Took a nice walk...
          </Text>

          <LargeButton
            title="Open Journal"
            onPress={() => router.push("/journal")}
          />
        </Card>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={showSymptomsModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSymptomsModal(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.25)",
          }}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setShowSymptomsModal(false)}
          />

          <View
            style={{
              backgroundColor: theme.backgroundElement,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 30,
              maxHeight: "90%",
            }}
          >
            <View className="items-center mb-4">
              <View
                style={{
                  width: 48,
                  height: 5,
                  borderRadius: 999,
                  backgroundColor: theme.backgroundSelected,
                }}
              />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <Text
                className="text-xl font-semibold mb-4"
                style={{ color: theme.text }}
              >
                Log more symptoms
              </Text>

              {Object.entries(symptomCategories).map(([category, symptoms]) => (
                <View key={category} className="mb-6">
                  <Text
                    className="text-base font-semibold mb-3"
                    style={{ color: theme.text }}
                  >
                    {category}
                  </Text>

                  <View className="flex-row flex-wrap gap-2">
                    {symptoms.map((symptom) => {
                      const isSelected = selectedSymptoms.includes(symptom);

                      return (
                        <Pressable
                          key={symptom}
                          onPress={() => {
                            if (isSelected) {
                              setSelectedSymptoms(
                                selectedSymptoms.filter((s) => s !== symptom),
                              );
                            } else {
                              setSelectedSymptoms([
                                ...selectedSymptoms,
                                symptom,
                              ]);
                            }
                          }}
                          className="rounded-full px-4 py-2"
                          style={{
                            backgroundColor: isSelected
                              ? theme.secondaryPressed
                              : theme.secondary,
                          }}
                        >
                          <Text
                            className="text-xs"
                            style={{ color: theme.text }}
                          >
                            {symptom}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}

              <LargeButton
                title="Done"
                onPress={() => {
                  setShowSymptomsModal(false);
                  setSelectedSymptoms([]);
                }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
