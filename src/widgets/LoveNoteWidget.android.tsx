import { Box, Column, Row, Text } from '@expo/ui/jetpack-compose';
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

type LoveNoteWidgetProps = {
  title: string;
  line: string;
};

const LoveNoteWidgetLayout = (props: LoveNoteWidgetProps) => {
  'widget';
  const title = props.title || "Today's Note";
  const line = props.line || "Can't wait to see you ♡";

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
        <Text color="#1A1014" style={{ fontSize: 16, textAlign: 'center' }}>
          ✉
        </Text>
      </Box>

      <Column modifiers={[fillMaxHeight(), padding(8, 6, 8, 6)]}>
        <Box modifiers={[width(1), fillMaxHeight(), background('#55FFFFFF')]} />
      </Column>

      <Column modifiers={[weight(1), fillMaxWidth(), padding(0, 0, 6, 0)]}>
        <Text color="#D9C4CF" style={{ fontSize: 12 }}>
          {title}
        </Text>
        <Text
          color="#FFFFFF"
          style={{ fontSize: 16, fontWeight: 'bold' }}
          maxLines={2}
          overflow="ellipsis"
        >
          {line}
        </Text>
      </Column>

      <Text color="#FF8FBF" style={{ fontSize: 22 }}>
        ♡
      </Text>
    </Row>
  );
};

export default createWidget('LoveNoteWidget', LoveNoteWidgetLayout, {
  title: "Today's Note",
  line: "Can't wait to see you ♡",
});
