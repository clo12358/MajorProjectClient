import { router } from "expo-router";
import { Text, View } from "react-native";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

export default function Home() {
  function handleLogout() {
    router.replace("/(auth)/login");
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-blue-600 px-6 pt-16 pb-10">
        <View className="max-w-md self-center w-full">
          <Text className="text-3xl font-extrabold text-white">Mira</Text>
          <Text className="mt-2 text-base text-white/90">
            You’re logged in!!
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 mt-6">
        <View className="max-w-md self-center w-full gap-5">
          {/* Quick actions */}
          <Text className="text-sm font-semibold text-slate-700 px-1">
            Quick actions
          </Text>

          <View className="gap-3">
            <Card className="rounded-3xl p-5 bg-white shadow-sm border border-slate-200">
              <Text className="text-base font-semibold text-slate-900">
                Log symptoms
              </Text>
              <Text className="mt-1 text-sm text-slate-600">
                Add today’s symptoms and notes.
              </Text>
            </Card>

            <Card className="rounded-3xl p-5 bg-white shadow-sm border border-slate-200">
              <Text className="text-base font-semibold text-slate-900">
                Add period dates
              </Text>
              <Text className="mt-1 text-sm text-slate-600">
                Track your start and end dates.
              </Text>
            </Card>
          </View>

          {/* Logout */}
          <Button
            className="w-full rounded-2xl py-4 bg-blue-600"
            onPress={handleLogout}
          >
            <Text className="text-white font-semibold text-base">Logout</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
