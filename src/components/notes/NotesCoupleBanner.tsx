import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { HeartOutlineIcon } from '@/src/components/illustrations/OutlineIcons';
import { Avatar } from '@/src/components/ui/Avatar';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { AvatarId } from '@/src/types/models';
import { fonts } from '@/src/theme/typography';
import { spacing } from '@/src/theme/spacing';

interface Props {
  myAvatarId?: AvatarId | null;
  partnerAvatarId?: AvatarId | null;
}

const AVATAR = 56;

export function NotesCoupleBanner({ myAvatarId, partnerAvatarId }: Props) {
  const { colors, isDark } = useTheme();
  const line = isDark ? 'rgba(255, 158, 192, 0.45)' : 'rgba(101, 12, 52, 0.22)';
  const labelColor = isDark ? colors.brand : '#B0124A';
  const ruleStrong = isDark ? 'rgba(255, 141, 176, 0.55)' : 'rgba(176, 18, 74, 0.45)';

  return (
    <View style={styles.wrap}>
      <View style={styles.avatars}>
        <Avatar avatarId={myAvatarId} size={AVATAR} ring />

        <View style={styles.link}>
          <Svg width={72} height={28} viewBox="0 0 72 28" style={styles.linkSvg}>
            <Path
              d="M 0 16 Q 36 4 72 16"
              stroke={line}
              strokeWidth={1.6}
              strokeDasharray="1.5 4.5"
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
          <View
            style={[
              styles.heartBadge,
              {
                backgroundColor: isDark ? colors.surface : '#FFFFFF',
                borderColor: isDark ? colors.border : 'rgba(242, 95, 130, 0.35)',
              },
            ]}
          >
            <HeartOutlineIcon size={14} color={colors.primary} />
          </View>
        </View>

        <Avatar avatarId={partnerAvatarId} size={AVATAR} ring />
      </View>

      <View style={styles.section}>
        <LinearGradient
          colors={['transparent', ruleStrong]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.rule}
        />
        <HeartOutlineIcon size={12} color={labelColor} />
        <Text color={labelColor} style={styles.label}>
          OUR LOVE NOTES
        </Text>
        <HeartOutlineIcon size={12} color={labelColor} />
        <LinearGradient
          colors={[ruleStrong, 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.rule}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    width: 72,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -4,
  },
  linkSvg: {
    position: 'absolute',
  },
  heartBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    width: '100%',
    paddingHorizontal: spacing.xs,
  },
  rule: {
    flex: 1,
    height: 1.5,
    borderRadius: 1,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.8,
  },
});
