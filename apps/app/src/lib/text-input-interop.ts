import { cssInterop } from 'nativewind';
import { TextInput } from 'react-native';

cssInterop(TextInput, {
  className: { target: 'style' },
  placeholderClassName: {
    target: false,
    nativeStyleToProp: { color: 'placeholderTextColor' },
  },
});

export const placeholderProps = {
  placeholderClassName: 'text-muted-foreground',
};
