import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { Platform } from 'react-native';
import { widgetsDirectory } from 'expo-widgets';

export type WidgetAssetUris = {
  daysBgUri: string;
  moodBgUri: string;
  notesBgUri: string;
};

async function ensureImageInSharedStorage(fileName: string, assetModule: number): Promise<string> {
  if (!widgetsDirectory) return '';
  const file = new File(widgetsDirectory, fileName);
  if (!file.exists) {
    const asset = await Asset.fromModule(assetModule).downloadAsync();
    if (!asset.localUri) return '';
    await new File(asset.localUri).copy(file);
  }
  return file.uri;
}

let cached: Promise<WidgetAssetUris> | null = null;

export function prepareWidgetAssets(): Promise<WidgetAssetUris> {
  if (Platform.OS === 'web') {
    return Promise.resolve({ daysBgUri: '', moodBgUri: '', notesBgUri: '' });
  }
  if (!cached) {
    cached = Promise.all([
      ensureImageInSharedStorage(
        'days_widget_bg.png',
        require('../../assets/images/days_widget_bg.png')
      ),
      ensureImageInSharedStorage(
        'mood_widget_bg.png',
        require('../../assets/images/mood_widget_bg.png')
      ),
      ensureImageInSharedStorage(
        'notes_widget_bg.png',
        require('../../assets/images/notes_widget_bg.png')
      ),
    ]).then(([daysBgUri, moodBgUri, notesBgUri]) => ({
      daysBgUri,
      moodBgUri,
      notesBgUri,
    }));
  }
  return cached;
}
