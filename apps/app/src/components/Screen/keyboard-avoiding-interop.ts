import { cssInterop } from 'nativewind';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

cssInterop(KeyboardAvoidingView, { className: { target: 'style' } });

export { KeyboardAvoidingView };
