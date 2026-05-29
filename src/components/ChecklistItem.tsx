import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/theme';
import type { ChecklistItem as Item } from '@/types';

interface ChecklistItemProps {
  item: Item;
  checked: boolean;
  onToggle: (id: string) => void;
  onOpenDetail?: (item: Item) => void;
}

export function ChecklistItem({ item, checked, onToggle, onOpenDetail }: ChecklistItemProps) {
  const [expanded, setExpanded] = useState(false);
  const isBlock = item.type === 'block';
  const isDone = checked && !isBlock;

  const borderColor = isBlock ? colors.blockBorder : isDone ? colors.greenBorder : colors.border;
  const background = isBlock ? colors.blockLight : isDone ? colors.greenLight : colors.card;

  return (
    <View style={[styles.card, { borderColor, backgroundColor: background }]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isDone, disabled: isBlock }}
        onPress={() => !isBlock && onToggle(item.id)}
        style={styles.row}
      >
        <View
          style={[
            styles.checkbox,
            {
              borderColor: isBlock ? colors.block : isDone ? colors.green : colors.border,
              backgroundColor: isDone ? colors.green : 'transparent',
            },
          ]}
        >
          {isDone ? <Text style={styles.tick}>✓</Text> : null}
          {isBlock ? <Text style={styles.bang}>!</Text> : null}
        </View>

        <View style={styles.textWrap}>
          <Text
            style={[
              styles.doc,
              { color: isBlock ? colors.block : isDone ? colors.greenDark : colors.text },
              isDone && styles.strike,
            ]}
          >
            {item.doc}
          </Text>

          <View style={styles.metaRow}>
            <Text style={[styles.person, { color: isBlock ? colors.block : colors.textLight }]}>
              For: {item.person}
            </Text>
            {item.warning ? (
              <View style={styles.warnTag}>
                <Text style={styles.warnText}>⚠ {item.warning}</Text>
              </View>
            ) : null}
          </View>

          {item.why ? <Text style={styles.why}>{item.why}</Text> : null}

          <View style={styles.actions}>
            {item.howToGet ? (
              <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={6}>
                <Text style={styles.action}>{expanded ? '▲ Less' : '▼ How to get this'}</Text>
              </Pressable>
            ) : null}
            {onOpenDetail ? (
              <Pressable onPress={() => onOpenDetail(item)} hitSlop={6}>
                <Text style={styles.action}>Full details →</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </Pressable>

      {expanded && item.howToGet ? (
        <View style={styles.expand}>
          <Text style={styles.expandText}>{item.howToGet}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, borderWidth: 1.5, marginBottom: 8, overflow: 'hidden' },
  row: { flexDirection: 'row', gap: 12, padding: spacing.md },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: { color: colors.white, fontSize: 11, fontWeight: '700' },
  bang: { color: colors.block, fontSize: 11, fontWeight: '700' },
  textWrap: { flex: 1 },
  doc: { fontSize: 13, fontWeight: '600', letterSpacing: -0.2 },
  strike: { textDecorationLine: 'line-through', opacity: 0.6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 3 },
  person: { fontSize: 10 },
  warnTag: { backgroundColor: colors.warnLight, paddingVertical: 1, paddingHorizontal: 6, borderRadius: 6 },
  warnText: { fontSize: 10, fontWeight: '700', color: colors.warn },
  why: { fontSize: 11, lineHeight: 16, color: colors.textMid, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 16, marginTop: 6 },
  action: { fontSize: 11, color: colors.green, fontWeight: '600' },
  expand: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingLeft: 46,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  expandText: { fontSize: 12, lineHeight: 18, color: colors.textMid },
});

export default ChecklistItem;
