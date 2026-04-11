import { Text, View, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useClerk, useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SafeAreaView = styled(RNSafeAreaView)

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 py-4 flex-row items-center justify-between">
        <Pressable 
          onPress={() => router.push('/')}
          className="size-11 rounded-full border border-border items-center justify-center bg-white shadow-sm"
        >
          <Ionicons name="chevron-back" size={22} color="black" />
        </Pressable>
        <Text className="text-xl font-sans-bold text-primary">Settings</Text>
        <Pressable className="size-11 rounded-full border border-border items-center justify-center bg-white shadow-sm">
          <Ionicons name="ellipsis-horizontal" size={22} color="black" />
        </Pressable>
      </View>

      <View className="px-6 pt-4 flex-1">
        <View className="bg-card rounded-[28px] p-5 border border-border mb-6 flex-row items-center">
          <View className="w-14 h-14 rounded-full bg-primary items-center justify-center mr-4">
            <Text className="text-background font-sans-bold text-xl uppercase">
              {user?.emailAddresses[0]?.emailAddress?.charAt(0) || '?'}
            </Text>
          </View>
          <View>
            <Text className="text-foreground font-sans-semibold text-lg mb-0.5">Signed in as</Text>
            <Text className="text-mutedForeground font-sans-regular text-sm">{user?.emailAddresses[0]?.emailAddress}</Text>
          </View>
        </View>

        <Pressable 
          className="w-full bg-card border border-border py-4.5 rounded-2xl items-center shadow-sm"
          onPress={() => signOut()}
        >
          <Text className="text-destructive font-sans-bold text-base">Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default Settings