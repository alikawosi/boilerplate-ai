import { View, Text, ViewProps } from "react-native";
import { cn } from "../../lib/utils";

function Card({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}: ViewProps & { children: React.ReactNode }) {
  return (
    <Text
      className={cn(
        "font-semibold leading-none tracking-tight text-card-foreground text-2xl",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: ViewProps) {
  return <View className={cn("p-6 pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardContent };
