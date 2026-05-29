import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { dfaContact, outcomeContent, passportUrl } from '@/content/eligibilityFlow';
import { openExternal } from '@/lib/external';
import { useAppStore } from '@/store/useAppStore';
import { colors, radius, spacing, typography } from '@/theme/theme';

export default function EligibilityResult() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const result = useAppStore((s) => s.eligibilityResult);
  const resetEligibility = useAppStore((s) => s.resetEligibility);

  if (!result) {
    router.replace('/eligibility/born_ireland');
    return null;
  }

  // Route-specific copy for eligible outcomes; otherwise keyed by outcome.
  const key = result.outcome === 'ELIGIBLE' && result.route ? result.route : result.outcome;
  const c = outcomeContent[key];

  const onCta = () => {
    if (c.cta?.kind === 'passport') openExternal(passportUrl);
    else router.push('/checklist/questions');
  };

  const restart = () => {
    resetEligibility();
    router.replace('/eligibility/born_ireland');
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xxl },
      ]}
    >
      <Text style={styles.emoji}>{c.emoji}</Text>
      <Text style={[typography.h1, styles.headline]}>{c.headline}</Text>
      <Text style={styles.body}>{c.body}</Text>

      {c.note ? (
        <View style={styles.note}>
          <Text style={styles.noteText}>⚠️ {c.note}</Text>
        </View>
      ) : null}

      {c.alternatives ? (
        <View style={styles.alt}>
          <Text style={styles.altText}>{c.alternatives}</Text>
        </View>
      ) : null}

      {c.contact ? (
        <View style={styles.contact}>
          <Text style={styles.contactTitle}>Contact the DFA</Text>
          <Text style={styles.contactText}>📞 {dfaContact.phone}  ({dfaContact.hours})</Text>
          <Button label="Open DFA webchat →" variant="secondary" onPress={() => openExternal(dfaContact.webchat)} />
        </View>
      ) : null}

      <View style={styles.ctas}>
        {c.cta ? <Button label={c.cta.label} onPress={onCta} /> : null}
        <Button label="Start the check again" variant="ghost" onPress={restart} />
        <Button label="Back to home" variant="ghost" onPress={() => router.replace('/')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl },
  emoji: { fontSize: 44, marginBottom: spacing.md },
  headline: { marginBottom: spacing.md },
  body: { fontSize: 15, lineHeight: 23, color: colors.textMid },
  note: {
    backgroundColor: colors.warnLight,
    borderWidth: 1.5,
    borderColor: colors.warnBorder,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  noteText: { fontSize: 13, lineHeight: 20, color: colors.warn },
  alt: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  altText: { fontSize: 13, lineHeight: 20, color: colors.textMid },
  contact: {
    backgroundColor: colors.greenLight,
    borderWidth: 1.5,
    borderColor: colors.greenBorder,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  contactTitle: { fontSize: 14, fontWeight: '700', color: colors.greenDark },
  contactText: { fontSize: 13, color: colors.textMid, marginBottom: spacing.sm },
  ctas: { marginTop: spacing.xl, gap: spacing.sm },
});
