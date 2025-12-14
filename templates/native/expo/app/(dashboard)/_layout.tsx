import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
