import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/theme';

interface ProgressBarProps {
  /** 1-based current step. */
  step: number;
  total: number;
}

/** Soft segmented progress bar (mockup style) for the question flows. */
export function ProgressBar({ step, total }: ProgressBarProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: Math.max(total, 1) }).map((_, i) => (
        <View
          key={i}
          style={[styles.seg, { backgroundColor: i < step ? colors.green : colors.border }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 3, marginBottom: 12 },
  seg: { flex: 1, height: 3, borderRadius: 2 },
});

export default ProgressBar;
