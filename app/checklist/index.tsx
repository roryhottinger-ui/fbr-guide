import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AlertBanner } from '@/components/AlertBanner';
import { BlockerBanner } from '@/components/BlockerBanner';
import { Button } from '@/components/Button';
import { ChainVisualiser } from '@/components/ChainVisualiser';
import { ChecklistItem } from '@/components/ChecklistItem';
import { SectionHeader } from '@/components/SectionHeader';
import { coerceAnswers } from '@/content/checklistQuestions';
import { footer } from '@/content/legal';
import { buildChecklist, checklistProgress } from '@/engine/checklist';
import { scheduleStatusReminder } from '@/lib/notifications';
import { useAppStore } from '@/store/useAppStore';
import { colors, radius, spacing, typography } from '@/theme/theme';
import type { ChecklistItem as Item, ChecklistSection } from '@/types';

const SECTIONS: { key: ChecklistSection; emoji: string; label: string }[] = [
  { key: 'grandparent', emoji: '🧓', label: 'Your grandparent' },
  { key: 'parent', emoji: '👤', label: 'Your parent' },
  { key: 'you', emoji: '🙋', label: 'You' },
];

const COUNTRY_KEY: Record<ChecklistSection, string> = {
  grandparent: 'gp_birth_country',
  parent: 'parent_birth_country',
  you: 'applicant_birth_country',
};

export default function ChecklistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const route = useAppStore((s) => s.eligibilityResult?.route ?? null);
  const rawAnswers = useAppStore((s) => s.checklistAnswers);
  const checked = useAppStore((s) => s.checked);
  const toggleChecked = useAppStore((s) => s.toggleChecked);
  const submittedDate = useAppStore((s) => s.submittedDate);
  const setSubmittedDate = useAppStore((s) => s.setSubmittedDate);

  const [showChain, setShowChain] = useState(true);

  const markSubmitted = async () => {
    const iso = new Date().toISOString();
    setSubmittedDate(iso);
    await scheduleStatusReminder(iso);
  };

  const answers = useMemo(() => coerceAnswers(rawAnswers), [rawAnswers]);
  const { items, alerts } = useMemo(() => buildChecklist(route, answers), [route, answers]);
  const progress = checklistProgress(items, checked);
  const allDone = !progress.hasBlocker && progress.done === progress.total && progress.total > 0;

  const openDetail = (item: Item) => {
    const country = rawAnswers[COUNTRY_KEY[item.section]];
    router.push({
      pathname: '/document/[id]',
      params: { id: item.documentDefId ?? '', country: country ?? '' },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xxl },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable accessibilityLabel="Back" onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={[typography.h3, styles.headerTitle]}>Your document checklist</Text>
        <Pressable onPress={() => router.push('/checklist/questions')} hitSlop={8}>
          <Text style={styles.edit}>Edit</Text>
        </Pressable>
      </View>

      {progress.hasBlocker ? <BlockerBanner /> : null}

      {/* Progress */}
      <View style={styles.progressCard}>
        <View style={styles.progressTop}>
          <Text style={styles.progressLabel}>{progress.done} of {progress.total} gathered</Text>
          <Text style={[styles.progressPct, { color: progress.hasBlocker ? colors.block : colors.green }]}>
            {progress.hasBlocker ? '⚠ Blocker' : `${progress.pct}%`}
          </Text>
        </View>
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              { width: `${progress.pct}%`, backgroundColor: progress.hasBlocker ? colors.block : colors.green },
            ]}
          />
        </View>
      </View>

      {/* Chain toggle */}
      <Pressable
        onPress={() => setShowChain((v) => !v)}
        style={[styles.chainToggle, { backgroundColor: showChain ? colors.greenLight : colors.card, borderColor: showChain ? colors.greenBorder : colors.border }]}
      >
        <Text style={styles.chainToggleText}>🔗  View document chain</Text>
        <Text style={styles.chainToggleHint}>{showChain ? '▲ Hide' : '▼ Show'}</Text>
      </Pressable>
      {showChain ? <ChainVisualiser answers={answers} route={route} /> : null}

      {/* Always-on marriage cert warning */}
      <View style={styles.marriageWarn}>
        <Text style={styles.marriageWarnText}>
          ⚠️ Marriage certificates are required for every marriage — even if the person's name didn't change. Skipping one is the most common cause of 3–6 month delays.
        </Text>
      </View>

      {/* Other alerts (Group 7) */}
      {alerts.filter((a) => a.id !== 'parent_marriage' && a.id !== 'gp_marriage').map((a) => (
        <AlertBanner key={a.id} level={a.level} text={a.text} />
      ))}

      {/* Sections */}
      {SECTIONS.map((sec) => {
        const secItems = items.filter((i) => i.section === sec.key);
        if (secItems.length === 0) return null;
        const total = secItems.filter((i) => i.type !== 'block').length;
        const done = secItems.filter((i) => i.type !== 'block' && checked[i.id]).length;
        return (
          <View key={sec.key}>
            <SectionHeader emoji={sec.emoji} title={sec.label} done={done} count={total} />
            {secItems.map((item) => (
              <ChecklistItem
                key={item.id}
                item={item}
                checked={!!checked[item.id]}
                onToggle={toggleChecked}
                onOpenDetail={item.documentDefId ? openDetail : undefined}
              />
            ))}
          </View>
        );
      })}

      {/* All-done celebration */}
      {allDone ? (
        <View style={styles.done}>
          <Text style={styles.doneEmoji}>🎉</Text>
          <Text style={styles.doneTitle}>Everything gathered!</Text>
          <Text style={styles.doneText}>
            Send via recorded post to the FBR PO Box in Balbriggan, Co. Dublin. Include the Eircode K32 AE72 on the envelope.
          </Text>
          <View style={styles.doneAction}>
            {submittedDate ? (
              <Text style={styles.doneReminder}>
                ✓ Reminder set — we'll nudge you to check your status around the 9-month mark.
              </Text>
            ) : (
              <Button label="I've posted it — remind me to check status" variant="secondary" onPress={markSubmitted} />
            )}
          </View>
        </View>
      ) : null}

      <Text style={styles.footer}>{footer.notAdvice}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
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
  headerTitle: { flex: 1 },
  edit: { fontSize: 13, color: colors.green, fontWeight: '600' },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  progressLabel: { fontSize: 12, fontWeight: '700', color: colors.textMid },
  progressPct: { fontSize: 12, fontWeight: '700' },
  track: { height: 5, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  chainToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.lg,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  chainToggleText: { fontSize: 12, fontWeight: '700', color: colors.textMid },
  chainToggleHint: { fontSize: 11, color: colors.textLight },
  marriageWarn: {
    backgroundColor: colors.warnLight,
    borderWidth: 1.5,
    borderColor: colors.warnBorder,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  marriageWarnText: { fontSize: 12, lineHeight: 18, color: colors.warn },
  done: {
    backgroundColor: colors.green,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  doneEmoji: { fontSize: 30, marginBottom: spacing.sm },
  doneTitle: { fontFamily: typography.h2.fontFamily, fontSize: 18, fontWeight: '700', color: colors.white, marginBottom: 6 },
  doneText: { fontSize: 12, lineHeight: 18, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  doneAction: { marginTop: spacing.lg, width: '100%' },
  doneReminder: { fontSize: 12, lineHeight: 18, color: colors.white, textAlign: 'center', fontWeight: '600' },
  footer: { fontSize: 11, color: colors.textLight, textAlign: 'center', marginTop: spacing.xl },
});
