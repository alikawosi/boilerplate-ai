import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { View, ActivityIndicator } from "react-native";
import { supabase } from "../lib/supabase";
import "../global.css";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
      })
      .catch((error) => {
        console.error("Error checking session:", error);
      })
      .finally(() => {
        setInitialized(true);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (session && inAuthGroup) {
      router.replace("/(dashboard)");
    } else if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
  }, [session, segments, initialized]);

  if (!initialized) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return <Slot />;
}
