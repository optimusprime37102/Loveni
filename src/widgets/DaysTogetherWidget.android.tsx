import { Box, Column, Row, Text } from '@expo/ui/jetpack-compose';
import {
  background,
  border,
  cornerRadius,
  fillMaxHeight,
  fillMaxSize,
  padding,
  paddingAll,
  size,
  weight,
  width,
} from '@expo/ui/jetpack-compose/modifiers';
import { createWidget } from 'expo-widgets';

type DaysTogetherWidgetProps = {
  brand: string;
  title: string;
  meInitial: string;
  partnerInitial: string;
  daysCount: string;
  daysCaption: string;
};

const DaysTogetherWidgetLayout = (props: DaysTogetherWidgetProps) => {
  'widget';
  const brand = props.brand || 'Loveni';
  const meInitial = props.meInitial || 'Y';
  const partnerInitial = props.partnerInitial || 'P';
  const daysCount = props.daysCount || '0';
  const daysCaption = props.daysCaption || 'days together';

  return (
    <Row
      modifiers={[
        fillMaxSize(),
        background('#5B3A7A'),
        cornerRadius(24),
        border(1.5, '#C9A6E8'),
        paddingAll(14),
      ]}
    >
      <Column modifiers={[weight(1.35), fillMaxHeight(), padding(0, 0, 10, 0)]}>
        <Row>
          <Text color="#FFFFFF" style={{ fontSize: 12 }}>
            ♡∞
          </Text>
          <Text color="#FFFFFF" style={{ fontSize: 13, fontWeight: '600' }}>
            {`  ${brand}`}
          </Text>
        </Row>

        <Row modifiers={[padding(0, 12, 0, 0)]}>
          <Box
            modifiers={[
              size(38, 38),
              cornerRadius(19),
              background('#3A2458'),
              paddingAll(8),
            ]}
          >
            <Text
              color="#FFFFFF"
              style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}
            >
              {meInitial}
            </Text>
          </Box>

          <Text color="#FF8FBF" style={{ fontSize: 11 }}>
            {'  ··· ♡ ···  '}
          </Text>

          <Box
            modifiers={[
              size(38, 38),
              cornerRadius(19),
              background('#3A2458'),
              paddingAll(8),
            ]}
          >
            <Text
              color="#FFFFFF"
              style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}
            >
              {partnerInitial}
            </Text>
          </Box>
        </Row>
      </Column>

      <Column modifiers={[fillMaxHeight(), padding(0, 8, 0, 8)]}>
        <Box modifiers={[width(1), fillMaxHeight(), background('#66FFFFFF')]} />
      </Column>

      <Column modifiers={[weight(1), fillMaxHeight(), padding(12, 2, 0, 2)]}>
        <Text color="#FF8FBF" style={{ fontSize: 14, textAlign: 'center' }}>
          ♡♡
        </Text>
        <Text
          color="#FFFFFF"
          style={{ fontSize: 34, fontWeight: 'bold', textAlign: 'center' }}
        >
          {daysCount}
        </Text>
        <Text color="#D4B8E8" style={{ fontSize: 11, textAlign: 'center' }}>
          {daysCaption}
        </Text>
      </Column>
    </Row>
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
