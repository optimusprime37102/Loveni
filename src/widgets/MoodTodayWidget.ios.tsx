import { Divider, HStack, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  background,
  clipShape,
  containerBackground,
  font,
  foregroundStyle,
  frame,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

type MoodTodayWidgetProps = {
  title: string;
  moodLabel: string;
  caption: string;
};

const MoodTodayWidgetLayout = (
  props: MoodTodayWidgetProps,
  _environment: WidgetEnvironment
) => {
  'widget';
  const title = props.title || "Partner's Mood";
  const moodLabel = props.moodLabel || 'Happy';
  const caption = props.caption || 'Feeling really good today! ♡';

  return (
    <HStack
      modifiers={[
        containerBackground('#2A1A24', 'widget'),
        padding({ all: 10 }),
        frame({ maxWidth: 999, maxHeight: 999 }),
      ]}
    >
      <Text
        modifiers={[
          font({ size: 18 }),
          foregroundStyle('#1A1014'),
          frame({ width: 40, height: 40 }),
          background('#FFB0C4'),
          clipShape('roundedRectangle', 12),
          padding({ all: 8 }),
        ]}
      >
        ☺
      </Text>

      <Divider
        modifiers={[
          padding({ horizontal: 8, vertical: 4 }),
          foregroundStyle('#55FFFFFF'),
        ]}
      />

      <VStack>
        <Text modifiers={[font({ size: 12 }), foregroundStyle('#D9C4CF')]}>{title}</Text>
        <Text modifiers={[font({ weight: 'bold', size: 17 }), foregroundStyle('#FFFFFF')]}>
          {moodLabel}
        </Text>
      </VStack>

      <Divider
        modifiers={[
          padding({ horizontal: 8, vertical: 4 }),
          foregroundStyle('#55FFFFFF'),
        ]}
      />

      <HStack modifiers={[frame({ maxWidth: 999 })]}>
        <Text modifiers={[font({ size: 11 }), foregroundStyle('#FF8FBF')]}>✦✦ </Text>
        <Text modifiers={[font({ size: 13 }), foregroundStyle('#FFFFFF')]}>{caption}</Text>
        <Spacer />
      </HStack>
    </HStack>
  );
};

export default createWidget('MoodTodayWidget', MoodTodayWidgetLayout, {
  title: "Aeni's Mood",
  moodLabel: 'Happy',
  caption: 'Feeling really good today! ♡',
});
