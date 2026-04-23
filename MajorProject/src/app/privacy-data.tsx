import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { PrivacySection } from "../components/custom/privacy-data";
import { Colors } from "../constants/theme";

export default function PrivacyData() {
  const { themeName, setTheme } = useTheme();
  const theme = Colors[themeName];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        className="flex-row items-center px-5 pt-14 pb-4"
        style={{ backgroundColor: theme.background }}
      >
        <Pressable
          onPress={() => router.back()}
          className="mr-4 p-1"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>
        <Text className="text-2xl font-semibold" style={{ color: theme.text }}>
          Privacy & Data
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sm mb-5" style={{ color: theme.textSecondary }}>
          Last updated: January 2026
        </Text>

        <PrivacySection title="What We Collect">
          <Text
            className="text-sm leading-6"
            style={{ color: theme.textSecondary }}
          >
            We collect the information you provide directly, including your
            name, email address, date of birth, and health data such as cycle
            dates, symptoms, flow levels, and journal entries. This data is used
            solely to power your experience within the app.
          </Text>
        </PrivacySection>

        <PrivacySection title="How We Use Your Data">
          <Text
            className="text-sm leading-6"
            style={{ color: theme.textSecondary }}
          >
            Your data is used to display your cycle history, generate insights,
            and personalise your experience. We do not sell, share, or rent your
            personal information to third parties for marketing purposes.
          </Text>
        </PrivacySection>

        <PrivacySection title="Health Data">
          <Text
            className="text-sm leading-6"
            style={{ color: theme.textSecondary }}
          >
            Health and cycle data is particularly sensitive. All health
            information you log — including period dates, symptoms, and journal
            entries — is stored securely and is never shared with advertisers or
            external services. Only you can access your health data.
          </Text>
        </PrivacySection>

        <PrivacySection title="Data Storage & Security">
          <Text
            className="text-sm leading-6"
            style={{ color: theme.textSecondary }}
          >
            Your data is stored on secure servers and transmitted over encrypted
            connections (HTTPS). We use industry-standard security practices to
            protect your information from unauthorised access, loss, or misuse.
          </Text>
        </PrivacySection>

        <PrivacySection title="Data Retention">
          <Text
            className="text-sm leading-6"
            style={{ color: theme.textSecondary }}
          >
            We retain your data for as long as your account is active. If you
            delete your account, all personal data and health records associated
            with your account will be permanently deleted within 30 days.
          </Text>
        </PrivacySection>

        <PrivacySection title="Your Rights">
          <Text
            className="text-sm leading-6"
            style={{ color: theme.textSecondary }}
          >
            You have the right to access, correct, or delete your personal data
            at any time. You can export your data using the Export Data option
            in your profile settings, or contact us to request full deletion of
            your account and associated data.
          </Text>
        </PrivacySection>
      </ScrollView>
    </View>
  );
}
