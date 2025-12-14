import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";

// 1. Import UI Components (lowercase/kebab-case)
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

// 2. Import Page Specific Components (PascalCase)
import { DashboardHeader } from "./_components/DashboardHeader";

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header Component */}
        <View className="flex-row justify-between items-start">
          <DashboardHeader title="Overview" />
          <TouchableOpacity
            onPress={() => supabase.auth.signOut()}
            className="mt-2"
          >
            <Ionicons name="log-out-outline" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View className="gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <Text className="text-2xl font-bold text-foreground">
                $45,231.89
              </Text>
            </CardHeader>
            <CardContent>
              <Text className="text-xs text-muted-foreground">
                +20.1% from last month
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Subscriptions
              </CardTitle>
              <Text className="text-2xl font-bold text-foreground">+2350</Text>
            </CardHeader>
            <CardContent>
              <Text className="text-xs text-muted-foreground">
                +180.1% from last month
              </Text>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
