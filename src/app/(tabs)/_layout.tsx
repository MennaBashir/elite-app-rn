import { Colors } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { House, Settings } from 'lucide-react-native';

export default function TabLayout() {
  const colors = Colors.light;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.tabInactive,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: 'white',
          borderRadius: 20,
          height: 60,
          position: 'absolute',
          bottom: 10,
          left: 10,
          right: 10,
          shadowColor: colors.shadow,
          width: '95%',
          transform: [{ translateX: 10 }],
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <House color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
