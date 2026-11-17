import { Redirect, Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ComponentProps } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { fonts } from '@/src/theme/typography';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

function TabIcon({
  focused,
  activeName,
  inactiveName,
  fallback,
}: {
  focused: boolean;
  activeName: SymbolName;
  inactiveName: SymbolName;
  fallback: string;
}) {
  const { colors } = useTheme();
  const tint = focused ? colors.iconActive : colors.iconInactive;

  return (
    <View style={[styles.iconWrap, focused && { backgroundColor: colors.tabActive }]}>
      <SymbolView
        name={focused ? activeName : inactiveName}
        size={22}
        tintColor={tint}
        weight={focused ? 'semibold' : 'regular'}
        fallback={<Text style={{ fontSize: 18, color: tint }}>{fallback}</Text>}
      />
    </View>
  );
}

export default function TabsLayout() {
  const { user, profile, loading } = useAuth();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);
  const tabHeight = 58 + bottomPad;

  if (!loading && !user) return <Redirect href="/(onboarding)/welcome" />;
  if (!loading && user && !profile?.onboardingComplete) {
    return <Redirect href="/(onboarding)/profile-setup" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.iconActive,
        tabBarInactiveTintColor: colors.iconInactive,
        tabBarLabelStyle: {
          fontFamily: fonts.bodyMedium,
          fontSize: 11,
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingTop: 6,
        },
        tabBarStyle: {
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
          borderTopWidth: 0,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          height: tabHeight,
          paddingTop: 6,
          paddingBottom: bottomPad,
          overflow: 'hidden',
          ...Platform.select({
            ios: {
              shadowColor: '#CE2457',
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 0.12,
              shadowRadius: 18,
            },
            android: {
              elevation: 18,
            },
            default: {},
          }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeName={{ ios: 'house.fill', android: 'home', web: 'home' }}
              inactiveName={{ ios: 'house', android: 'home', web: 'home' }}
              fallback="⌂"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeName={{
                ios: 'envelope.fill',
                android: 'mail',
                web: 'mail',
              }}
              inactiveName={{
                ios: 'envelope',
                android: 'mail_outline',
                web: 'mail',
              }}
              fallback="✉"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mood"
        options={{
          title: 'Moods',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeName={{
                ios: 'face.smiling',
                android: 'sentiment_satisfied',
                web: 'mood',
              }}
              inactiveName={{
                ios: 'face.smiling',
                android: 'sentiment_satisfied',
                web: 'mood',
              }}
              fallback="☺"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeName={{
                ios: 'gearshape.fill',
                android: 'settings',
                web: 'settings',
              }}
              inactiveName={{
                ios: 'gearshape',
                android: 'settings',
                web: 'settings',
              }}
              fallback="⚙"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    minWidth: 48,
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
