import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function useHaptics() {
  const enabled = Platform.OS !== 'web';

  return {
    light: () => {
      if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    medium: () => {
      if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
    success: () => {
      if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    error: () => {
      if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
    selection: () => {
      if (enabled) Haptics.selectionAsync();
    },
  };
}
