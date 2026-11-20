import { Box, Column, Row, Spacer, Text } from '@expo/ui/jetpack-compose';
import {
  background,
  cornerRadius,
  fillMaxHeight,
  fillMaxSize,
  fillMaxWidth,
  padding,
  paddingAll,
  size,
  weight,
  width,
} from '@expo/ui/jetpack-compose/modifiers';
import { createWidget } from 'expo-widgets';

type MoodTodayWidgetProps = {
  title: string;
  moodLabel: string;
  caption: string;
};

const MoodTodayWidgetLayout = (props: MoodTodayWidgetProps) => {
  'widget';
  const title = props.title || "Partner's Mood";
  const moodLabel = props.moodLabel || 'Happy';
  const caption = props.caption || 'Feeling really good today! ♡';

  return (
    <Row
      verticalAlignment="center"
      modifiers={[
        fillMaxSize(),
        background('#2A1A24'),
        cornerRadius(20),
        paddingAll(10),
      ]}
    >
      <Box
        modifiers={[
          size(40, 40),
          cornerRadius(12),
          background('#FFB0C4'),
          paddingAll(8),
        ]}
      >
        <Text color="#1A1014" style={{ fontSize: 18, textAlign: 'center' }}>
          ☺
        </Text>
      </Box>

      <Column modifiers={[fillMaxHeight(), padding(8, 6, 8, 6)]}>
        <Box modifiers={[width(1), fillMaxHeight(), background('#55FFFFFF')]} />
      </Column>

      <Column modifiers={[padding(0, 0, 8, 0)]}>
        <Text color="#D9C4CF" style={{ fontSize: 12 }}>
          {title}
        </Text>
        <Text color="#FFFFFF" style={{ fontSize: 17, fontWeight: 'bold' }}>
          {moodLabel}
        </Text>
      </Column>

      <Column modifiers={[fillMaxHeight(), padding(0, 6, 8, 6)]}>
        <Box modifiers={[width(1), fillMaxHeight(), background('#55FFFFFF')]} />
      </Column>

      <Row verticalAlignment="center" modifiers={[weight(1), fillMaxWidth()]}>
        <Text color="#FF8FBF" style={{ fontSize: 11 }}>
          ✦✦{' '}
        </Text>
        <Text color="#FFFFFF" style={{ fontSize: 13 }} maxLines={2} overflow="ellipsis">
          {caption}
        </Text>
        <Spacer modifiers={[weight(1)]} />
      </Row>
    </Row>
  );
};

export default createWidget('MoodTodayWidget', MoodTodayWidgetLayout, {
  title: "Aeni's Mood",
  moodLabel: 'Happy',
  caption: 'Feeling really good today! ♡',
});
