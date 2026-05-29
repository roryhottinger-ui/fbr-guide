import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnswerOption } from '@/components/AnswerOption';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { colors, radius, spacing, typography } from '@/theme/theme';

export interface QuestionOption {
  value: string;
  label: string;
  sub?: string;
}

interface QuestionScreenProps {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  help?: string;
  options: QuestionOption[];
  selected?: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  /** Force-disable Continue even when an option is selected (e.g. "not sure"). */
  nextDisabled?: boolean;
  /** Auto-expand the help drawer (used when the answer needs clarification). */
  forceHelpOpen?: boolean;
}

export function QuestionScreen({
  step,
  total,
  title,
  subtitle,
  help,
  options,
  selected,
  onSelect,
  onNext,
  onBack,
  nextLabel = 'Continue →',
  nextDisabled = false,
  forceHelpOpen = false,
}: QuestionScreenProps) {
  const [showHelp, setShowHelp] = useState(false);
  const insets = useSafeAreaInsets();
  const helpVisible = showHelp || forceHelpOpen;

  return (
    <View style={styles.flex}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          {onBack ? (
            <Pressable accessibilityLabel="Go back" onPress={onBack} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
          ) : null}
          <View style={styles.flex}>
            <ProgressBar step={step} total={total} />
            <Text style={typography.label}>Step {step} of {total}</Text>
          </View>
        </View>

        <Text style={[typography.h2, styles.title]}>{title}</Text>

        {subtitle ? (
          <View style={styles.subtitle}>
            <Text style={styles.subtitleText}>{subtitle}</Text>
          </View>
        ) : null}

        {help ? (
          <View style={styles.helpWrap}>
            <Pressable onPress={() => setShowHelp((v) => !v)} accessibilityRole="button">
              <Text style={styles.helpToggle}>{helpVisible ? '▲ Hide help' : '▼ Not sure? Tap for help'}</Text>
            </Pressable>
            {helpVisible ? <Text style={styles.helpText}>{help}</Text> : null}
          </View>
        ) : null}

        <View style={styles.options}>
          {options.map((opt) => (
            <AnswerOption
              key={opt.value}
              label={opt.label}
              sub={opt.sub}
              selected={selected === opt.value}
              onPress={() => onSelect(opt.value)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button label={nextLabel} onPress={onNext} disabled={!selected || nextDisabled} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg, marginTop: spacing.md },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { fontSize: 18, color: colors.textMid },
  title: { marginBottom: spacing.md },
  subtitle: {
    backgroundColor: colors.goldLight,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  subtitleText: { fontSize: 13, lineHeight: 19, color: colors.textMid },
  helpWrap: { marginBottom: spacing.lg },
  helpToggle: { fontSize: 13, color: colors.green, fontWeight: '600' },
  helpText: { fontSize: 13, lineHeight: 20, color: colors.textMid, marginTop: spacing.sm },
  options: { marginTop: spacing.xs },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
});

export default QuestionScreen;
