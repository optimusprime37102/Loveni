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

type LoveNoteWidgetProps = {
  title: string;
  line: string;
};

const LoveNoteWidgetLayout = (
  props: LoveNoteWidgetProps,
  _environment: WidgetEnvironment
) => {
  'widget';
  const title = props.title || "Today's Note";
  const line = props.line || "Can't wait to see you ♡";

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
          font({ size: 16 }),
          foregroundStyle('#1A1014'),
          frame({ width: 40, height: 40 }),
          background('#FFB0C4'),
          clipShape('roundedRectangle', 12),
          padding({ all: 8 }),
        ]}
      >
        ✉
      </Text>

      <Divider
        modifiers={[
          padding({ horizontal: 8, vertical: 4 }),
          foregroundStyle('#55FFFFFF'),
        ]}
      />

      <VStack modifiers={[frame({ maxWidth: 999 })]}>
        <Text modifiers={[font({ size: 12 }), foregroundStyle('#D9C4CF')]}>{title}</Text>
        <Text modifiers={[font({ weight: 'bold', size: 16 }), foregroundStyle('#FFFFFF')]}>
          {line}
        </Text>
      </VStack>

      <Spacer />
      <Text modifiers={[font({ size: 22 }), foregroundStyle('#FF8FBF')]}>♡</Text>
    </HStack>
  );
};

export default createWidget('LoveNoteWidget', LoveNoteWidgetLayout, {
  title: "Today's Note",
  line: "Can't wait to see you ♡",
});
