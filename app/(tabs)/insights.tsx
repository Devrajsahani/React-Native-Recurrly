import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSubscriptions } from '@/lib/SubscriptionContext';
import { formatCurrency } from '@/lib/utils';
import SubscriptionCard from '@/components/SubscriptionCard';
import clsx from 'clsx';

const SafeAreaView = styled(RNSafeAreaView)

const CHART_DATA = [
  { day: 'Mon', value: 35 },
  { day: 'Tue', value: 30 },
  { day: 'Wed', value: 25 },
  { day: 'Thr', value: 40 },
  { day: 'Fri', value: 33 },
  { day: 'Sat', value: 20 },
  { day: 'Sun', value: 28 },
];

const Insights = () => {
  const router = useRouter();
  const { subscriptions } = useSubscriptions();
  const [selectedIndex, setSelectedIndex] = useState(3); // Default to Thursday (index 3)

  // For the History list, we'll just show the first few subscriptions
  const historyItems = subscriptions.slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-5 py-4 flex-row items-center justify-between">
        <Pressable 
          onPress={() => router.push('/')}
          className="size-11 rounded-full border border-border items-center justify-center bg-white shadow-sm"
        >
          <Ionicons name="chevron-back" size={22} color="black" />
        </Pressable>
        <Text className="text-xl font-sans-bold text-primary">Monthly Insights</Text>
        <Pressable className="size-11 rounded-full border border-border items-center justify-center bg-white shadow-sm">
          <Ionicons name="ellipsis-horizontal" size={22} color="black" />
        </Pressable>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      >
        {/* Upcoming Section */}
        <View className="flex-row items-center justify-between mt-6">
          <Text className="text-2xl font-sans-bold text-primary">Upcoming</Text>
          <Pressable className="bg-border/20 px-4 py-2 rounded-2xl border border-border/10">
            <Text className="text-xs font-sans-semibold text-primary">View all</Text>
          </Pressable>
        </View>

        {/* Custom Interactive Bar Chart Card */}
        <View className="mt-5 bg-[#fcf8f2] rounded-[36px] p-6 border border-[#f0e4d4]">
          <View className="flex-row items-end justify-between h-52 relative">
            {/* Grid Background Lines */}
            <View className="absolute inset-x-0 inset-y-0 justify-between opacity-10 py-2">
                {[45, 35, 25, 5, 0].map(val => (
                   <View key={val} className="border-t border-dashed border-primary" />
                ))}
            </View>

            {CHART_DATA.map((item, index) => (
              <Pressable 
                key={index} 
                onPress={() => setSelectedIndex(index)}
                className="items-center flex-1 z-10"
              >
                {selectedIndex === index && (
                  <View className="bg-[#ea7a53] px-2 py-1.5 rounded-xl absolute -top-12 items-center shadow-lg">
                    <Text className="text-white text-[11px] font-sans-bold">${item.value}</Text>
                    <View className="bg-[#ea7a53] size-2.5 rotate-45 absolute -bottom-1" />
                  </View>
                )}
                <View 
                  style={{ height: `${(item.value / 45) * 100}%` }}
                  className={clsx(
                    "w-[14px] rounded-full transition-all duration-300",
                    selectedIndex === index ? "bg-[#ea7a53]" : "bg-primary"
                  )} 
                />
                <Text className={clsx(
                  "mt-4 text-[10px] uppercase",
                  selectedIndex === index ? "font-sans-bold text-primary" : "font-sans-medium text-muted-foreground"
                )}>
                  {item.day}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Expenses Summary Card */}
        <View className="mt-4 bg-white rounded-[28px] p-5 border border-border flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-sans-bold text-primary">Expenses</Text>
            <Text className="text-xs font-sans-medium text-muted-foreground mt-1">March 2026</Text>
          </View>
          <View className="items-end">
            <Text className="text-xl font-sans-bold text-primary">-$424.63</Text>
            <Text className="text-xs font-sans-semibold text-[#ea7a53] mt-1">+12%</Text>
          </View>
        </View>

        {/* History Section */}
        <View className="flex-row items-center justify-between mt-8">
          <Text className="text-2xl font-sans-bold text-primary">History</Text>
          <Pressable className="bg-border/20 px-4 py-2 rounded-2xl border border-border/10">
            <Text className="text-xs font-sans-semibold text-primary">View all</Text>
          </Pressable>
        </View>

        <View className="mt-4 gap-4">
          {historyItems.map((item) => (
            <SubscriptionCard 
              key={item.id} 
              {...item} 
              expanded={false} 
              onPress={() => {}}
            />
          ))}
          {historyItems.length === 0 && (
            <Text className="text-center font-sans-medium text-muted-foreground py-10">
              No recent history
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Insights