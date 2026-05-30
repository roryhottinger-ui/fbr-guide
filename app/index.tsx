import { useRouter } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { fees } from '@/content/fees';
import { lastVerified, onboardingDisclaimer } from '@/content/legal';
import { timelines } from '@/content/timelines';
import { useAppStore } from '@/store/useAppStore';
import { colors, radius, spacing, typography } from '@/theme/theme';

const STEPS = [
  { emoji: '✅', title: 'Check eligibility', text: 'Answer a few questions to see if you qualify and via which route.' },
  { emoji: '📋', title: 'Build your checklist', text: 'Get a personalised document list for your exact situation.' },
  { emoji: '📦', title: 'Gather & submit', text: 'Track what you’ve collected, then post it with confidence.' },
];

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const hydrated = useAppStore((s) => s._hydrated);
  const eligibilityResult = useAppStore((s) => s.eligibilityResult);
  const eligibilityAnswers = useAppStore((s) => s.eligibilityAnswers);
  const checklistAnswers = useAppStore((s) => s.checklistAnswers);
  const disclaimerAccepted = useAppStore((s) => s.disclaimerAccepted);
  const acceptDisclaimer = useAppStore((s) => s.acceptDisclaimer);
  const setEligibilityResult = useAppStore((s) => s.setEligibilityResult);

  if (!hydrated) return <View style={styles.flex} />;

  const isEligible = eligibilityResult?.outcome === 'ELIGIBLE';
  const inProgress = Object.keys(eligibilityAnswers).length > 0 && !eligibilityResult;
  const hasChecklistAnswers = Object.keys(checklistAnswers).length > 0;

  const startEligibility = () => router.push('/eligibility/born_ireland');
  const goChecklist = () =>
    router.push(hasChecklistAnswers ? '/checklist' : '/checklist/questions');
  const skipToChecklist = () => {
    // Most applicants use the grandparent route; default to it when skipping.
    if (!eligibilityResult) setEligibilityResult({ outcome: 'ELIGIBLE', route: 'ROUTE_A' });
    router.push('/checklist/questions');
  };

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xxl }]}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>IRISH CITIZENSHIP</Text>
          <Text style={styles.heroTitle}>Foreign Birth Registration, made clear</Text>
          <Text style={styles.heroSub}>
            A free, private guide to checking your eligibility and building the exact document checklist for your application.
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{fees.adultLabel}</Text>
              <Text style={styles.statLabel}>adult fee</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{timelines.typicalRangeLabel}</Text>
              <Text style={styles.statLabel}>typical wait</Text>
            </View>
          </View>
          <Text style={styles.heroVerified}>Information last verified {lastVerified}</Text>
        </View>

        {/* Resume banner */}
        {(isEligible || inProgress) && (
          <View style={styles.resume}>
            <Text style={styles.resumeText}>
              {isEligible ? 'You’re likely eligible — pick up where you left off.' : 'You have an eligibility check in progress.'}
            </Text>
            <Button
              label={isEligible ? 'Resume my checklist →' : 'Resume eligibility check →'}
              onPress={isEligible ? goChecklist : startEligibility}
            />
          </View>
        )}

        {/* Steps */}
        <View style={styles.steps}>
          {STEPS.map((s, i) => (
            <View key={s.title} style={styles.step}>
              <Text style={styles.stepEmoji}>{s.emoji}</Text>
              <View style={styles.flex}>
                <Text style={styles.stepTitle}>{i + 1}. {s.title}</Text>
                <Text style={styles.stepText}>{s.text}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Primary CTAs */}
        <View style={styles.ctas}>
          {!isEligible && <Button label="Check my eligibility →" onPress={startEligibility} />}
          <Button
            label={isEligible ? 'View my checklist →' : 'Skip to the checklist'}
            variant={isEligible ? 'primary' : 'secondary'}
            onPress={isEligible ? goChecklist : skipToChecklist}
          />
          <Button label="Browse info & FAQ" variant="ghost" onPress={() => router.push('/info')} />
        </View>

        <Text style={styles.footer}>
          Independent &amp; unofficial — not affiliated with the Irish Government or DFA. Not legal advice. All your answers stay on this device — no account, no data collected. Works fully offline.
        </Text>
        <Pressable onPress={() => router.push('/legal')} hitSlop={8}>
          <Text style={styles.footerLink}>Privacy &amp; Terms</Text>
        </Pressable>
      </ScrollView>

      {/* First-run disclaimer */}
      <Modal visible={hydrated && !disclaimerAccepted} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Before you start</Text>
            {onboardingDisclaimer.map((p, i) => (
              <Text key={i} style={styles.modalText}>{p}</Text>
            ))}
            <Button label="I understand — continue" onPress={acceptDisclaimer} />
            <Pressable onPress={() => { acceptDisclaimer(); router.push('/legal'); }} hitSlop={8}>
              <Text style={styles.modalLink}>Read full Privacy &amp; Terms</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.xl },
  hero: {
    backgroundColor: colors.green,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  heroEyebrow: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },
  heroTitle: { fontFamily: typography.h1.fontFamily, fontSize: 28, lineHeight: 34, color: colors.white, fontWeight: '700', letterSpacing: -0.5 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 21, marginTop: 12 },
  heroStats: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xl, gap: spacing.xl },
  stat: {},
  statValue: { color: colors.white, fontSize: 18, fontWeight: '700' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.25)' },
  heroVerified: { color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: spacing.md },
  resume: {
    backgroundColor: colors.greenLight,
    borderWidth: 1.5,
    borderColor: colors.greenBorder,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  resumeText: { fontSize: 14, color: colors.greenDark, fontWeight: '600' },
  steps: { gap: spacing.md, marginBottom: spacing.xl },
  step: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  stepEmoji: { fontSize: 22 },
  stepTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  stepText: { fontSize: 13, lineHeight: 19, color: colors.textMid, marginTop: 2 },
  ctas: { gap: spacing.sm, marginBottom: spacing.xl },
  footer: { fontSize: 11, lineHeight: 16, color: colors.textLight, textAlign: 'center' },
  footerLink: { fontSize: 12, color: colors.green, fontWeight: '600', textAlign: 'center', marginTop: spacing.sm },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: spacing.xl },
  modalCard: { backgroundColor: colors.card, borderRadius: radius.xxl, padding: spacing.xl, gap: spacing.md },
  modalTitle: { fontFamily: typography.h2.fontFamily, fontSize: 21, fontWeight: '700', color: colors.text },
  modalText: { fontSize: 13, lineHeight: 20, color: colors.textMid },
  modalLink: { fontSize: 12, color: colors.green, fontWeight: '600', textAlign: 'center' },
});
