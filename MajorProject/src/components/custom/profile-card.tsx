import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Platform, Text, View } from "react-native";

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
  const [bmiCategory, setBmiCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!weight || !height) return;

    // Fetching BMI API
    async function fetchBmi() {
      try {
        const heightInMeters = parseFloat(height!) / 100; // Convert cm to m
        const weightInKg = parseFloat(weight!);

        if (isNaN(heightInMeters) || isNaN(weightInKg)) return;

        const response = await fetch(
          `https://bmicalculatorapi.vercel.app/api/bmi/${weightInKg}/${heightInMeters}`,
        );
        const data = await response.json();
        setBmi(data.bmi?.toFixed(1) ?? null);
        setBmiCategory(data.category ?? null);
      } catch (error) {
        console.error("Failed to fetch BMI:", error);
      }
    }

    fetchBmi();
  }, [weight, height]);

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
          </View>
        ))}
      </View>

      {/* BMI category badge */}
      {bmiCategory && (
        <View
          className="rounded-xl px-3 py-2 mb-4 items-center"
          style={{ backgroundColor: theme.background }}
        >
          <Text className="text-xs" style={{ color: theme.textSecondary }}>
            BMI Category:{" "}
            <Text style={{ color: theme.text, fontWeight: "600" }}>
              {bmiCategory}
            </Text>
          </Text>
        </View>
      )}

      <LargeButton title={buttonTitle} onPress={onPressButton} />
    </View>
  );
}
