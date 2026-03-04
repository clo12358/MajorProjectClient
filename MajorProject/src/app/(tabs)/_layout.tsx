import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarShowLabel: true,

        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#6B7280",

        tabBarStyle: {
          height: 75,
          paddingTop: 6,
          paddingBottom: 8,
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
        },

        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
        },

        tabBarIcon: ({ color, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          if (route.name === "home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "calendar") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "insights") {
            iconName = focused ? "trending-up" : "trending-up-outline";
          } else if (route.name === "profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="calendar" options={{ title: "Calendar" }} />
      <Tabs.Screen name="insights" options={{ title: "Insights" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
