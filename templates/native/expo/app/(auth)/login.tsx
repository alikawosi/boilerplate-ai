import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { Stack } from "expo-router";
import Constants from "expo-constants";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const projectName = Constants.expoConfig?.name || "Boilerplate App";

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert("Error", error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) Alert.alert("Error", error.message);
    else Alert.alert("Check your inbox", "Please verify your email.");
    setLoading(false);
  }

  return (
    <View className="flex-1 justify-center p-8 bg-white">
      <Stack.Screen options={{ title: "Login", headerShown: false }} />
      <Text className="text-3xl font-bold mb-8 text-center text-foreground">
        {projectName}
      </Text>

      <View className="gap-4">
        <TextInput
          className="border border-gray-300 rounded-lg p-4 bg-gray-50"
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
        />
        <TextInput
          className="border border-gray-300 rounded-lg p-4 bg-gray-50"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
        />

        <TouchableOpacity
          className="bg-black p-4 rounded-lg mt-4"
          onPress={signInWithEmail}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold">Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={signUpWithEmail} className="mt-2">
          <Text className="text-center text-gray-500">Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
