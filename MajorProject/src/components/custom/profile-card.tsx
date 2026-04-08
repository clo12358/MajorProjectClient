import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Linking, Platform, Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../../constants/theme";
import { LargeButton } from "./large-button";

type ProfileCardProps = {
  name: string;
  email: string;
  profileImage?: string | null;
  dob?: string | null;
  height?: string | null;
  weight?: string | null;
  buttonTitle?: string;
  onPressButton?: () => void;
};

function calculateAge(dob: string): number | null {
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age--;
  return age;
}

type BmiRange = {
  label: string;
  min: number;
  max: number;
  color: string;
};

const BMI_RANGES: BmiRange[] = [
  { label: "Underweight", min: 0, max: 18.5, color: "#93C5FD" },
  { label: "Normal", min: 18.5, max: 25, color: "#6EE7B7" },
  { label: "Overweight", min: 25, max: 30, color: "#FCD34D" },
  { label: "Obese", min: 30, max: 40, color: "#FCA5A5" },
];

function getBmiRange(bmi: number): BmiRange {
  return (
    BMI_RANGES.find((r) => bmi >= r.min && bmi < r.max) ??
    BMI_RANGES[BMI_RANGES.length - 1]
  );
}

export function ProfileCard({
  name,
  email,
  profileImage,
  dob,
  height,
  weight,
  buttonTitle = "Edit Profile",
  onPressButton,
}: ProfileCardProps) {
  const { isDark } = useTheme();
  const theme = Colors[isDark ? "dark" : "light"];

  const age = dob ? calculateAge(dob) : null;
  const [bmi, setBmi] = useState<string | null>(null);

  useEffect(() => {
    if (!weight || !height) return;

    async function fetchBmi() {
      try {
        const heightInMeters = parseFloat(height!) / 100;
        const weightInKg = parseFloat(weight!);
        if (isNaN(heightInMeters) || isNaN(weightInKg)) return;
        const response = await fetch(
          `https://bmicalculatorapi.vercel.app/api/bmi/${weightInKg}/${heightInMeters}`,
        );
        const data = await response.json();
        setBmi(data.bmi?.toFixed(1) ?? null);
      } catch (error) {
        console.error("Failed to fetch BMI:", error);
      }
    }

    fetchBmi();
  }, [weight, height]);

  const bmiNumber = bmi ? parseFloat(bmi) : null;
  const bmiRange = bmiNumber !== null ? getBmiRange(bmiNumber) : null;

  const stats = [
    { label: "Age", value: age !== null ? `${age}` : "—" },
    { label: "Height", value: height ? `${height}cm` : "—" },
    { label: "Weight", value: weight ? `${weight}kg` : "—" },
    { label: "BMI", value: bmi ?? "—" },
  ];

  return (
    <View
      className="rounded-3xl p-5 border"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundSelected,
      }}
    >
      <View className="flex-row items-center gap-4 mb-4">
        <View
          className="rounded-full items-center justify-center overflow-hidden"
          style={{
            backgroundColor: theme.backgroundSelected,
            width: 56,
            height: 56,
          }}
        >
          {profileImage ? (
            Platform.OS === "web" ? (
              <img
                src={profileImage}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <Image
                source={{ uri: profileImage }}
                style={{ width: 56, height: 56, borderRadius: 28 }}
              />
            )
          ) : (
            <Ionicons
              name="person-outline"
              size={26}
              color={theme.textSecondary}
            />
          )}
        </View>

        <View className="flex-1">
          <Text
            className="text-base font-semibold"
            style={{ color: theme.text }}
          >
            {name}
          </Text>
          <Text className="text-sm" style={{ color: theme.textSecondary }}>
            {email}
          </Text>
        </View>
      </View>

      {/* Stats row */}
      <View
        className="flex-row rounded-2xl mb-4"
        style={{ backgroundColor: theme.background }}
      >
        {stats.map((stat, index) => (
          <View
            key={stat.label}
            className="flex-1 items-center py-3"
            style={{
              borderRightWidth: index < stats.length - 1 ? 1 : 0,
              borderRightColor: theme.backgroundSelected,
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: theme.text }}
            >
              {stat.value}
            </Text>
            <Text
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              {stat.label}
            </Text>
            {stat.label === "BMI" && bmiRange && (
              <Pressable
                onPress={() =>
                  Linking.openURL("https://www.healthhero.ie/bmi-calculator")
                }
                style={{
                  backgroundColor: bmiRange.color + "33",
                  borderRadius: 999,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  marginTop: 4,
                }}
              >
                <Text
                  style={{
                    color: bmiRange.color,
                    fontSize: 9,
                    fontWeight: "700",
                  }}
                >
                  {bmiRange.label}
                </Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>

      <LargeButton title={buttonTitle} onPress={onPressButton} />
    </View>
  );
}
