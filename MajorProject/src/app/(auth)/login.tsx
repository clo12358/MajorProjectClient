import { Link, router } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Text, useColorScheme, View } from "react-native";

import { LargeButton } from "@/components/custom/large-button";
import { Input } from "../../components/ui/input";
import { Colors } from "../../constants/theme";

export default function Login() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0;
  }, [email, password]);

  function handleLogin() {
    router.replace("/(tabs)/home");
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View className="px-7 pt-12">
        {/* Logo */}
        <View className="items-center mt-1 mb-1">
          <Image
            source={require("../../assets/logo.png")}
            style={{
              width: 400,
              height: 400,
              resizeMode: "contain",
            }}
          />
        </View>

        {/* Form */}
        <View className="gap-5">
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

          {/* Log In Button */}
          <View className="mt-6">
            <LargeButton
              title="Log In"
              onPress={handleLogin}
              // disabled={!canSubmit}
            />
          </View>

          {/* Register link */}
          <Text
            className="text-sm text-center"
            style={{ color: theme.textSecondary }}
          >
            Don’t have an account?{" "}
            <Link
              href="/(auth)/register"
              className="font-semibold"
              style={{ color: theme.primary }}
            >
              Create one
            </Link>
          </Text>
        </View>
      </View>
    </View>
  );
}
