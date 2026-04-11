import { Tabs, Redirect } from "expo-router";
import { View } from "react-native";
import { useAuth } from '@clerk/expo';
import { colors, components } from '@/constants/theme';
import { Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { appTabs } from "@/constants/data";


const tabBar = components.tabBar;

const TabIcon = ({ focused, icon }: TabIconProps) => {
    return (
        <View style={{
            height: tabBar.height,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 24,
                paddingVertical: 8,
                paddingHorizontal: 22,
                backgroundColor: focused ? colors.accent : 'transparent',
            }}>
                <Image
                    source={icon}
                    resizeMode="contain"
                    style={{
                        width: 25,
                        height: 30,
                        tintColor: focused ? '#ffffff' : '#9ca3af',
                    }}
                />
            </View>
        </View>
    );
};
const TabLayout = () => {
    const { isLoaded, isSignedIn } = useAuth();
    const insets = useSafeAreaInsets();

    if (!isLoaded) return null;

    if (!isSignedIn) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                // Disable automatic safe area insets to gain full manual control over centering
                safeAreaInsets: { bottom: 0, top: 0, left: 0, right: 0 }, 
                tabBarStyle: {
                    position: 'absolute',
                    bottom: Math.max(insets.bottom, tabBar.horizontalInset),
                    height: tabBar.height,
                    marginHorizontal: tabBar.horizontalInset,
                    borderRadius: tabBar.radius,
                    backgroundColor: colors.primary,
                    borderTopWidth: 0,
                    elevation: 0,
                    paddingBottom: 0, // Force clear bottom padding for Android gesture/button bars
                },
                tabBarItemStyle: {
                    height: tabBar.height,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 15, // Manual downward visual correction for Android
                    paddingBottom: 0,
                },
                tabBarIconStyle: {
                    width: 30,
                    height: 30,
                },
                tabBarLabelStyle: {
                    display: 'none',
                }
            }}
        >
            {appTabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} icon={tab.icon} />
                        )
                    }} />
            ))}
            {/* Explicitly hide the dynamic subscription details from the tab bar */}
            <Tabs.Screen 
                name="subscription/[id]" 
                options={{ 
                    href: null,
                }} 
            />
        </Tabs>
    )
}

export default TabLayout;