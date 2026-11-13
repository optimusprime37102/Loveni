import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/src/components/ui/Text';
import { getAvatar } from '@/src/constants/avatars';
import { AvatarId } from '@/src/types/models';
import { useTheme } from '@/src/contexts/ThemeContext';

interface Props {
  avatarId?: AvatarId | null;
  name?: string;
  size?: number;
  ring?: boolean;
}

export function Avatar({ avatarId, name, size = 56, ring }: Props) {
  const { colors } = useTheme();
  const avatar = getAvatar(avatarId);
  const fontSize = size * 0.42;

  return (
    <View
      style={[
        styles.ring,
        {
          width: size + (ring ? 8 : 0),
          height: size + (ring ? 8 : 0),
          borderRadius: (size + (ring ? 8 : 0)) / 2,
          borderColor: ring ? colors.primary : 'transparent',
          borderWidth: ring ? 2 : 0,
        },
      ]}
    >
      <LinearGradient
        colors={avatar.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize, lineHeight: fontSize + 4 }}>{avatar.emoji}</Text>
      </LinearGradient>
      {name ? (
        <View style={[styles.badge, { backgroundColor: colors.surface }]}>
          <Text variant="caption" color={colors.text} numberOfLines={1}>
            {name.split(' ')[0]}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: -6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
});
