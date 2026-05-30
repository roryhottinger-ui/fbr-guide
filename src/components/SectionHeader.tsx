import { StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/theme/theme';

interface SectionHeaderProps {
  emoji: string;
  title: string;
  done: number;
  count: number;
}

export function SectionHeader({ emoji, title, done, count }: SectionHeaderProps) {
  const complete = count > 0 && done === count;
  return (
    <View style={styles.row}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <View
        style={[
          styles.badge,
          {
            backgroundColor: complete ? colors.greenLight : '#F0EDE7',
            borderColor: complete ? colors.greenBorder : colors.border,
          },
        ]}
      >
        <Text style={[styles.badgeText, { color: complete ? colors.green : colors.textLight }]}>
          {done}/{count}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, marginBottom: 8 },
  emoji: { fontSize: 18 },
  title: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.textMid, letterSpacing: 0.2 },
  badge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: radius.md, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: '700' },
});

export default SectionHeader;
