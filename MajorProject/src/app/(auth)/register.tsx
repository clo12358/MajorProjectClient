import { Link, router } from "expo-router";
import { useMemo, useState } from "react";
import { Text, useColorScheme, View } from "react-native";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Colors } from "../../constants/theme";

export default function Register() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      password.trim().length > 0
    );
  }, [name, email, password]);

  function handleRegister() {
    router.replace("/(tabs)/home");
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View className="px-7 pt-12">
        {/* Logo */}
        <View className="items-center mt-10 mb-10">
          <Text
            className="mt-4 text-5xl font-extrabold"
            style={{ color: theme.primary }}
          >
            Mira
          </Text>
        </View>

        {/* Form */}
        <View className="gap-5">
          {/* Name */}
          <View className="gap-2">
            <Text
              className="text-sm font-semibold"
              style={{ color: theme.text }}
            >
              Name
            </Text>

            <View
              className="rounded-2xl px-4 py-2 border"
              style={{
                backgroundColor: theme.backgroundElement,
                borderColor: theme.backgroundSelected,
              }}
            >
              <Input
                placeholder="Your name"
                value={name}
                onChangeText={setName}
                className="border-0 bg-transparent"
              />
            </View>
          </View>

          {/* Email */}
          <View className="gap-2">
            <Text
              className="text-sm font-semibold"
              style={{ color: theme.text }}
            >
              Email
            </Text>

            <View
              className="rounded-2xl px-4 py-2 border"
              style={{
                backgroundColor: theme.backgroundElement,
                borderColor: theme.backgroundSelected,
              }}
            >
              <Input
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                className="border-0 bg-transparent"
              />
            </View>
          </View>

          {/* Password */}
          <View className="gap-2">
            <Text
              className="text-sm font-semibold"
              style={{ color: theme.text }}
            >
              Password
            </Text>

            <View
              className="rounded-2xl px-4 py-2 border"
              style={{
                backgroundColor: theme.backgroundElement,
                borderColor: theme.backgroundSelected,
              }}
            >
              <Input
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="border-0 bg-transparent"
              />
            </View>
          </View>

          {/* Register Button */}
          <Button
            className="w-full rounded-2xl py-4"
            style={{ backgroundColor: theme.primary }}
            onPress={handleRegister}
            disabled={!canSubmit}
          >
            <Text
              className="font-semibold text-base"
              style={{ color: theme.text }}
            >
              Create Account
            </Text>
          </Button>

          {/* Login Link */}
          <Text
            className="text-sm text-center"
            style={{ color: theme.textSecondary }}
          >
            Already have an account?{" "}
            <Link
              href="/(auth)/login"
              className="font-semibold"
              style={{ color: theme.primary }}
            >
              Log in
            </Link>
          </Text>
        </View>
      </View>
    </View>
  );
}
