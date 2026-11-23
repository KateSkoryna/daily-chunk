import { View } from 'react-native';

import {
  RecordButton,
  type RecordButtonState,
} from '../RecordButton/RecordButton';

type RecordControlsProps = {
  state: RecordButtonState;
  recordLabel: string;
  stopLabel: string;
  playRecordingLabel: string;
  recordAgainLabel: string;
  onRecord: () => void;
  onPlayRecording: () => void;
};

function RecordControls({
  state,
  recordLabel,
  stopLabel,
  playRecordingLabel,
  recordAgainLabel,
  onRecord,
  onPlayRecording,
}: RecordControlsProps) {
  if (state === 'done') {
    return (
      <View className="flex-row items-center justify-center gap-6">
        <RecordButton
          state="done"
          accessibilityLabel={playRecordingLabel}
          onPress={onPlayRecording}
        />
        <RecordButton
          state="idle"
          accessibilityLabel={recordAgainLabel}
          onPress={onRecord}
        />
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-center">
      <RecordButton
        state={state}
        accessibilityLabel={state === 'recording' ? stopLabel : recordLabel}
        onPress={onRecord}
      />
    </View>
  );
}

export { RecordControls };
export type { RecordControlsProps };
