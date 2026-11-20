import { Divider, HStack, Text, VStack } from '@expo/ui/swift-ui';
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

type DaysTogetherWidgetProps = {
  brand: string;
  title: string;
  meInitial: string;
  partnerInitial: string;
  daysCount: string;
  daysCaption: string;
};

const DaysTogetherWidgetLayout = (
  props: DaysTogetherWidgetProps,
  _environment: WidgetEnvironment
) => {
  'widget';
  const brand = props.brand || 'Loveni';
  const meInitial = props.meInitial || 'Y';
  const partnerInitial = props.partnerInitial || 'P';
  const daysCount = props.daysCount || '128';
  const daysCaption = props.daysCaption || 'days together';

  return (
    <HStack
      modifiers={[
        containerBackground('#5B3A7A', 'widget'),
        padding({ all: 14 }),
      ]}
    >
      <VStack modifiers={[padding({ trailing: 10 })]}>
        <HStack>
          <Text modifiers={[font({ size: 12 }), foregroundStyle('#FFFFFF')]}>♡∞</Text>
          <Text
            modifiers={[font({ weight: 'semibold', size: 13 }), foregroundStyle('#FFFFFF')]}
          >
            {`  ${brand}`}
          </Text>
        </HStack>

        <HStack modifiers={[padding({ top: 12 })]}>
          <Text
            modifiers={[
              font({ weight: 'bold', size: 15 }),
              foregroundStyle('#FFFFFF'),
              frame({ width: 38, height: 38 }),
              background('#3A2458'),
              clipShape('circle'),
            ]}
          >
            {meInitial}
          </Text>
          <Text modifiers={[font({ size: 11 }), foregroundStyle('#FF8FBF')]}>
            {'  ··· ♡ ···  '}
          </Text>
          <Text
            modifiers={[
              font({ weight: 'bold', size: 15 }),
              foregroundStyle('#FFFFFF'),
              frame({ width: 38, height: 38 }),
              background('#3A2458'),
              clipShape('circle'),
            ]}
          >
            {partnerInitial}
          </Text>
        </HStack>
      </VStack>

      <Divider
        modifiers={[
          padding({ vertical: 6 }),
          foregroundStyle('#66FFFFFF'),
        ]}
      />

      <VStack modifiers={[padding({ leading: 12 })]}>
        <Text modifiers={[font({ size: 14 }), foregroundStyle('#FF8FBF')]}>♡♡</Text>
        <Text modifiers={[font({ weight: 'bold', size: 34 }), foregroundStyle('#FFFFFF')]}>
          {daysCount}
        </Text>
        <Text modifiers={[font({ size: 11 }), foregroundStyle('#D4B8E8')]}>{daysCaption}</Text>
      </VStack>
    </HStack>
  );
};

export default createWidget('DaysTogetherWidget', DaysTogetherWidgetLayout, {
  brand: 'Loveni',
  title: 'Days Together',
  meInitial: 'Y',
  partnerInitial: 'P',
  daysCount: '128',
  daysCaption: 'days together',
});
