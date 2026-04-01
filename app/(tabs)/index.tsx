import "@/global.css"
import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background gap-y-4">
      <Text className="text-xl font-bold text-success mb-4">
        Welcome to Nativewind!
      </Text>
      
      <Link href="/onboarding" className="rounded bg-black p-4 w-60 items-center">
        <Text className="text-white text-center text-lg font-semibold">Go to onboarding</Text>
      </Link>

      <Link href="/(auth)/sign-in" className="rounded bg-black p-4 w-60 items-center">
        <Text className="text-white text-center text-lg font-semibold">Go to sign in</Text>
      </Link>

      <Link href="/(auth)/sign-up" className="rounded bg-black p-4 w-60 items-center">
        <Text className="text-white text-center text-lg font-semibold">Go to sign up</Text>
      </Link>
    </View>
  );
}