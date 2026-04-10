import { Text, View, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useClerk, useUser } from '@clerk/expo';

const SafeAreaView = styled(RNSafeAreaView)

const settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <SafeAreaView className="flex-1 bg-background p-6">
      <View className="mb-8 mt-4">
        <Text className="text-3xl font-sans-bold text-foreground">Settings</Text>
      </View>

      <View className="bg-card rounded-2xl p-4 border border-border mb-6 flex-row items-center">
        <View className="w-12 h-12 rounded-full bg-primary items-center justify-center mr-4">
          <Text className="text-background font-sans-bold text-lg">
            {user?.emailAddresses[0]?.emailAddress?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <View>
          <Text className="text-foreground font-sans-semibold text-base mb-1">Signed in as</Text>
          <Text className="text-mutedForeground font-sans-regular text-sm">{user?.emailAddresses[0]?.emailAddress}</Text>
        </View>
      </View>

      <Pressable 
        className="w-full bg-card border border-border py-4 rounded-xl items-center"
        onPress={() => signOut()}
      >
        <Text className="text-destructive font-sans-bold text-base">Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default settings