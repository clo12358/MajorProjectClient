import { Link, router } from "expo-router";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0;
  }, [email, password]);

  function handleLogin() {
    router.replace("/(tabs)/home");
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-blue-600 px-6 pt-16 pb-12">
        <View className="max-w-md self-center w-full">
          <Text className="text-3xl font-extrabold text-white">Mira</Text>
          <Text className="mt-2 text-base text-white/90">
            Welcome back — sign in to continue
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 mt-6">
        <Card className="w-full max-w-md self-center rounded-3xl p-6 gap-5 bg-white shadow-md border border-slate-200">
          <View className="gap-1">
            <Text className="text-xl font-bold text-slate-900">Sign in</Text>
            <Text className="text-sm text-slate-500">
              Enter your details below.
            </Text>
          </View>

          {/* Email */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-slate-700">Email</Text>
            <Input
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-semibold text-slate-700">
                Password
              </Text>
              {/* 
              <Pressable>
                <Text className="text-sm text-blue-600 font-semibold">
                  Forgot?
                </Text>
              </Pressable> */}
            </View>

            <Input
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Button */}
          <Button
            className="w-full rounded-2xl py-4 bg-blue-600"
            onPress={handleLogin}
            disabled={!canSubmit}
          >
            <Text className="text-white font-semibold text-base">Sign in</Text>
          </Button>

          {/* Register */}
          <Text className="text-sm text-slate-600 text-center">
            Don’t have an account?{" "}
            <Link
              href="/(auth)/register"
              className="text-blue-600 font-semibold"
            >
              Register
            </Link>
          </Text>
        </Card>
      </View>
    </View>
  );
}
