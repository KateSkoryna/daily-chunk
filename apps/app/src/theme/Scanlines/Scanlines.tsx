import { rem } from 'nativewind';
import { useWindowDimensions, View } from 'react-native';

import { lineGapInRem, lineThicknessInRem } from './scanline-metrics';

function Scanlines() {
  const { height } = useWindowDimensions();
  const rootFontSize = rem.get();
  const lineGap = lineGapInRem * rootFontSize;
  const lineThickness = lineThicknessInRem * rootFontSize;
  const lineCount = Math.ceil(height / lineGap);

  return (
    <View
      className="absolute inset-0 overflow-hidden opacity-5"
      pointerEvents="none"
    >
      {Array.from({ length: lineCount }, (_, lineIndex) => (
        <View
          key={lineIndex}
          className="bg-foreground"
          style={{
            height: lineThickness,
            marginBottom: lineGap - lineThickness,
          }}
        />
      ))}
    </View>
  );
}

export { Scanlines };
