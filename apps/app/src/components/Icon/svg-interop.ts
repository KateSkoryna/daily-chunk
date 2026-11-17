import { cssInterop } from 'nativewind';
import Svg, { Path } from 'react-native-svg';

cssInterop(Svg, {
  className: { target: 'style', nativeStyleToProp: { color: 'color' } },
});

export { Path, Svg };
