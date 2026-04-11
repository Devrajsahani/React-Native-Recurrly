import { FlatList, View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState, useMemo } from 'react'
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useSubscriptions } from "@/lib/SubscriptionContext";
import SubscriptionCard from "@/components/SubscriptionCard";
import { Ionicons } from '@expo/vector-icons';
import { Pressable} from 'react-native';

const SafeAreaView = styled(RNSafeAreaView)

const Subscription = () => {
  const { subscriptions } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, subscriptions]);

  const toggleExpand = (id: string) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <FlatList
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mb-4">
              <SubscriptionCard
                {...item}
                expanded={expandedId === item.id}
                onPress={() => {
                  Keyboard.dismiss();
                  toggleExpand(item.id);
                }}
              />
            </View>
          )}
          ListHeaderComponent={() => (
            <View className="pb-4">
              {/* Premium Header */}
              <View className="py-4 flex-row items-center justify-between mb-2">
                <Pressable 
                  onPress={() => router.push('/')}
                  className="size-11 rounded-full border border-border items-center justify-center bg-white shadow-sm"
                >
                  <Ionicons name="chevron-back" size={22} color="black" />
                </Pressable>
                <Text className="text-xl font-sans-bold text-primary">My Subscriptions</Text>
                <Pressable className="size-11 rounded-full border border-border items-center justify-center bg-white shadow-sm">
                  <Ionicons name="ellipsis-horizontal" size={22} color="black" />
                </Pressable>
              </View>

              <View className="flex-row items-center bg-card border border-border rounded-2xl px-4 py-3 mt-2">
                <Ionicons name="search" size={20} color="rgba(0,0,0,0.4)" />
                <TextInput
                  placeholder="Search your plans..."
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  className="flex-1 ml-3 font-sans-medium text-base text-primary"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                  clearButtonMode="while-editing"
                />
                {searchQuery.length > 0 && Platform.OS === 'android' && (
                  <TouchableWithoutFeedback onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="rgba(0,0,0,0.4)" />
                  </TouchableWithoutFeedback>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="items-center justify-center py-20">
              <Text className="text-lg font-sans-medium text-muted-foreground">
                No subscriptions found
              </Text>
            </View>
          )}
          contentContainerClassName="px-5 pb-40"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          onScrollBeginDrag={Keyboard.dismiss}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Subscription