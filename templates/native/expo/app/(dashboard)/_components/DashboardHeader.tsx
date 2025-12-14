import { View, Text } from "react-native";

export function DashboardHeader({ title }: { title: string }) {
  return (
    <View className="flex-row items-center justify-between border-b border-border pb-4 mb-4">
      <Text className="text-3xl font-bold tracking-tight text-foreground">
        {title}
      </Text>
      <View className="flex-row items-center space-x-2">
        {/* Placeholder for UserAvatar or Actions */}
      </View>
    </View>
  );
}
