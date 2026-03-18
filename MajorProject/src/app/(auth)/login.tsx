import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Image, Text, useColorScheme, View } from "react-native";

import { FormInput } from "@/components/custom/form-input";
import { LargeButton } from "@/components/custom/large-button";
import api from "@/lib/axios";
import { Colors } from "../../constants/theme";

export default function Login() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0;
  }, [email, password]);

  async function handleLogin() {
    if (!canSubmit) return;

    setLoading(true);
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      console.log("Login response:", response.data);

      // Uses the saved token from AsyncStorage
      const token = response.data.token;
      await AsyncStorage.setItem("auth_token", token);

      router.replace("/(tabs)/home");
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      const message = error.response?.data?.message;

      if (errors) {
        // Laravel validation error.
        const firstError = Object.values(errors)[0] as string[];
        Alert.alert("Login Failed", firstError[0]);
      } else if (message) {
        // Laravel auth error.
        Alert.alert("Login Failed", message);
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
          <FormInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FormInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View className="mt-6">
            <LargeButton
              title={loading ? "Logging in..." : "Log In"}
              onPress={handleLogin}
              disabled={!canSubmit || loading}
            />
          </View>

          <Text
            className="text-sm text-center"
            style={{ color: theme.textSecondary }}
          >
            Don't have an account?{" "}
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
