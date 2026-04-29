import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Text, View, useColorScheme } from "react-native";

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
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // Checks wether the form can be submitted
  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0;
  }, [email, password]);

  // Clears all error messages
  function clearErrors() {
    setEmailError("");
    setPasswordError("");
    setGeneralError("");
  }

  async function handleLogin() {
    if (!canSubmit) return;

    clearErrors();
    setLoading(true);
    try {
      // Send a POST request to the login endpoint with the email and password
      const response = await api.post("/login", {
        email,
        password,
      });

      // Stores the auth token to keep user logged in
      const token = response.data.token;
      await AsyncStorage.setItem("auth_token", token);

      router.replace("/(tabs)/home");
    } catch (error: any) {
      const errors = error.response?.data?.errors;

      //If the error is password related it shows the error under the field, if not it shows a generic error message.
      if (errors?.password) {
        setPasswordError(errors.password[0]);
      } else {
        setGeneralError(
          "The email or password you entered is incorrect. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View className="px-7 pt-6">
        {/* Logo */}
        <View className="items-center mt-0 mb-0">
          <Image
            source={require("../../assets/logo.png")}
            style={{
              width: 220,
              height: 220,
              resizeMode: "contain",
            }}
          />
        </View>

        {/* Form */}
        <View className="gap-5">
          <View>
            <FormInput
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError("");
                if (generalError) setGeneralError("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? (
              <Text
                className="text-sm mt-1 ml-1"
                style={{ color: theme.dangerText }}
              >
                {emailError}
              </Text>
            ) : null}
          </View>

          <View>
            <FormInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError("");
                if (generalError) setGeneralError("");
              }}
              secureTextEntry
            />
            {passwordError ? (
              <Text
                className="text-sm mt-1 ml-1"
                style={{ color: theme.dangerText }}
              >
                {passwordError}
              </Text>
            ) : null}
          </View>

          {/* General error */}
          {generalError ? (
            <View
              className="rounded-lg px-4 py-3"
              style={{ backgroundColor: theme.danger }}
            >
              <Text className="text-sm" style={{ color: theme.dangerText }}>
                {generalError}
              </Text>
            </View>
          ) : null}

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
