import AsyncStorage from '@react-native-async-storage/async-storage';

const keyFor = (uid: string) => `loveni.partnerPromptSkipped.${uid}`;

export async function hasSkippedPartnerPrompt(uid: string): Promise<boolean> {
  const value = await AsyncStorage.getItem(keyFor(uid));
  return value === '1';
}

export async function setPartnerPromptSkipped(uid: string, skipped: boolean): Promise<void> {
  if (skipped) {
    await AsyncStorage.setItem(keyFor(uid), '1');
  } else {
    await AsyncStorage.removeItem(keyFor(uid));
  }
}
