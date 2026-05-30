import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/theme/theme';

interface AnswerOptionProps {
  label: string;
  sub?: string;
  selected: boolean;
  onPress: () => void;
}

export function AnswerOption({ label, sub, selected, onPress }: AnswerOptionProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        { borderColor: selected ? colors.green : colors.border, backgroundColor: selected ? colors.greenLight : colors.card },
        pressed && { opacity: 0.9 },
      ]}
    >
      <View style={[styles.radio, { borderColor: selected ? colors.green : colors.border, backgroundColor: selected ? colors.green : 'transparent' }]}>
        {selected && <Text style={styles.tick}>✓</Text>}
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.label}>{label}</Text>
        {sub ? <Text style={styles.sub}>{sub}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: { color: colors.white, fontSize: 12, fontWeight: '700' },
  textWrap: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, letterSpacing: -0.2 },
  sub: { fontSize: 12, color: colors.textLight, marginTop: 2 },
});

export default AnswerOption;
