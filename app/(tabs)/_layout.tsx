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
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
        }}>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor: focused ? colors.accent : 'transparent',
                }}>
                <Image
                    source={icon}
                    resizeMode="contain"
                    style={{
                        width: 22,
                        height: 22,
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
                tabBarStyle: {
                    position: 'absolute',
                    bottom: Math.max(insets.bottom, tabBar.horizontalInset),
                    height: tabBar.height,
                    marginHorizontal: tabBar.horizontalInset,
                    borderRadius: tabBar.radius,
                    backgroundColor: colors.primary,
                    borderTopWidth: 0,
                    elevation: 0,
                },
                tabBarItemStyle: {
                    height: tabBar.height,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 0,
                    paddingBottom: 0,
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
        </Tabs>
    )
}

export default TabLayout;