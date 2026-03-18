import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Image, Text, useColorScheme, View } from "react-native";

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

  // The useMemo watches the fields and only returns true when all fields have some text in them.
  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      password.trim().length > 0
    );
  }, [name, email, password]);

  async function handleRegister() {
    if (!canSubmit) return;
    // setLoading(true) prevents user from pressing the button more than once. And shows the "Creating Account..." text on the button.
    setLoading(true);
    //This gets the URL from the lib/axios.ts file and adds the /register endpoint to it.
    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
      });

      //Token gets stored in AsyncStorage so it can be used later.
      const token = response.data.token;
      await AsyncStorage.setItem("auth_token", token);

      //Then navigate to the home screen.
      router.replace("/(tabs)/home");
    } catch (error: any) {
      const errors = error.response?.data?.errors;

      //This checks if there is any errors and returns a message to the user.
      if (errors) {
        const firstError = Object.values(errors)[0] as string[];
        Alert.alert("Registration Failed", firstError[0]);
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View className="px-7 pt-7">
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
            label="Name (first and last name)"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

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
