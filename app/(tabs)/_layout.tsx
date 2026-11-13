import { Redirect, Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { radii } from '@/src/theme/spacing';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.iconWrap,
        focused && { backgroundColor: colors.surfaceMuted },
      ]}
    >
      <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.7 }}>{emoji}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const { user, profile, loading } = useAuth();
  const { colors } = useTheme();

  if (!loading && !user) return <Redirect href="/(onboarding)/welcome" />;
  if (!loading && user && !profile?.onboardingComplete) {
    return <Redirect href="/(onboarding)/profile-setup" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: {
          fontFamily: 'DMSans_500Medium',
          fontSize: 11,
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ focused }) => <TabIcon emoji="💌" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="mood"
        options={{
          title: 'Mood',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🥰" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 36,
    height: 28,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
