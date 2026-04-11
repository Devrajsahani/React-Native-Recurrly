import {View, Text, Image, Pressable, Alert} from 'react-native'
import React from 'react'
import {formatCurrency, formatStatusLabel, formatSubscriptionDateTime} from "@/lib/utils";
import clsx from "clsx";
import { useSubscriptions } from '@/lib/SubscriptionContext';

const SubscriptionCard = ({ id, name, price, currency, icon, billing, color, category, plan, renewalDate, expanded, onPress, paymentMethod, startDate, status}: SubscriptionCardProps) => {
    const { removeSubscription } = useSubscriptions();

    const handleCancel = () => {
        Alert.alert(
            "Cancel Subscription",
            `Are you sure you want to cancel ${name}? This will remove it from your records permanently.`,
            [
                { text: "No", style: "cancel" },
                { 
                    text: "Yes, Cancel", 
                    style: "destructive", 
                    onPress: () => removeSubscription(id) 
                }
            ]
        );
    };

    return (
        <Pressable 
            onPress={onPress} 
            className={clsx('sub-card', expanded ? 'sub-card-expanded border-none shadow-none' : 'bg-card')} 
            style={!expanded && color ? { backgroundColor: color } : undefined}
        >
            <View className="sub-head">
                <View className="sub-main">
                    <Image source={icon} className="sub-icon" />
                    <View className="sub-copy">
                        <Text numberOfLines={1} className="sub-title">
                            {name}
                        </Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
                            {category?.trim() || plan?.trim() || (renewalDate ? formatSubscriptionDateTime(renewalDate) : '')}
                        </Text>
                    </View>
                </View>

                <View className="sub-price-box">
                    <Text className="sub-price">{formatCurrency(price, currency)}</Text>
                    <Text className="sub-billing">{billing}</Text>
                </View>
            </View>

            {expanded && (
                <View className="sub-body">
                    <View className="sub-details">
                        {/* Row 1: Payment info with Manage button */}
                        <View className="sub-row flex-row items-center justify-between">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Payment info:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                                    {paymentMethod?.trim() ?? '*****8530'}
                                </Text>
                            </View>
                            <Pressable className="bg-background/80 px-4 py-1.5 rounded-xl border border-border">
                                <Text className="text-xs font-sans-semibold text-primary">Manage</Text>
                            </Pressable>
                        </View>

                        {/* Row 2: Plan details with Change button */}
                        <View className="sub-row flex-row items-center justify-between">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Plan details:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                                    {(category?.trim() || plan?.trim()) ?? 'Premium'}
                                </Text>
                            </View>
                            <Pressable className="bg-background/80 px-4 py-1.5 rounded-xl border border-border">
                                <Text className="text-xs font-sans-semibold text-primary">Change</Text>
                            </Pressable>
                        </View>

                        {/* Standard detail rows */}
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Started:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                                    {startDate ? formatSubscriptionDateTime(startDate) : 'Not provided'}
                                </Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Renewal date:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                                    {renewalDate ? formatSubscriptionDateTime(renewalDate) : 'Not provided'}
                                </Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Status:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                                    {status ? formatStatusLabel(status) : 'Not provided'}
                                </Text>
                            </View>
                        </View>

                        {/* Cancel Button */}
                        <Pressable 
                            onPress={handleCancel}
                            className="mt-6 bg-primary py-4 rounded-2xl items-center"
                        >
                            <Text className="text-white font-sans-bold text-base">Cancel Subscription</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </Pressable>
    )
}
export default SubscriptionCard