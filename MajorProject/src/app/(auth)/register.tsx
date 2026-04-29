import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Text, View, useColorScheme } from "react-native";

import { FormInput } from "@/components/custom/form-input";
import { LargeButton } from "@/components/custom/large-button";
import api from "@/lib/axios";
import { Colors } from "../../constants/theme";

export default function Register() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // Checks whether the form can be submitted
  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      password.trim().length > 0
    );
  }, [name, email, password]);

  // Clears all error messages
  function clearErrors() {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setGeneralError("");
  }

  async function handleRegister() {
    if (!canSubmit) return;
    setLoading(true);
    clearErrors();
    try {
      // Send a POST request to the register endpoint with the user's details
      const response = await api.post("/register", {
        name,
        email,
        password,
      });

      const token = response.data.token;
      //saves the auth token to keep the user logged in
      await AsyncStorage.setItem("auth_token", token);

      router.replace("/(tabs)/home");
    } catch (error: any) {
      const errors = error.response?.data?.errors;

      if (errors) {
        // Displays errors above each field
        if (errors.name) setNameError(errors.name[0]);
        if (errors.email) setEmailError(errors.email[0]);
        if (errors.password) setPasswordError(errors.password[0]);
      } else {
        setGeneralError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View className="px-7 pt-4">
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
              label="Name (first and last name)"
              placeholder="Your name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) setNameError("");
              }}
              autoCapitalize="words"
            />
            {nameError ? (
              <Text
                className="text-sm mt-1 ml-1"
                style={{ color: theme.dangerText }}
              >
                {nameError}
              </Text>
            ) : null}
          </View>

          <View>
            <FormInput
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError("");
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
              title={loading ? "Creating Account..." : "Create Account"}
              onPress={handleRegister}
              disabled={!canSubmit || loading}
            />
          </View>

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
