import { Link, router } from "expo-router";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export default function Register() {
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
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-blue-600 px-6 pt-16 pb-12">
        <View className="max-w-md self-center w-full">
          <Text className="text-3xl font-extrabold text-white">Mira</Text>
          <Text className="mt-2 text-base text-white/90">
            Create your account to get started
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 mt-6">
        <Card className="w-full max-w-md self-center rounded-3xl p-6 gap-5 bg-white shadow-md border border-slate-200">
          <View className="gap-1">
            <Text className="text-xl font-bold text-slate-900">
              Create account
            </Text>
            <Text className="text-sm text-slate-500">
              Fill in your details below.
            </Text>
          </View>

          {/* Name */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-slate-700">Name</Text>
            <Input
              placeholder="Your name"
              value={name}
              onChangeText={setName}
            />
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
            <Text className="text-sm font-semibold text-slate-700">
              Password
            </Text>
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
            onPress={handleRegister}
            disabled={!canSubmit}
          >
            <Text className="text-white font-semibold text-base">
              Create account
            </Text>
          </Button>

          {/* Login link */}
          <Text className="text-sm text-slate-600 text-center">
            Already have an account?{" "}
            <Link href="/(auth)/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </Text>
        </Card>
      </View>
    </View>
  );
}
