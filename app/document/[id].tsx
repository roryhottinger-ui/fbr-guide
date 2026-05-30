import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { getDocument } from '@/content/documents';
import { footer } from '@/content/legal';
import { COUNTRY_LABELS, getHowToLink } from '@/content/links';
import { openExternal } from '@/lib/external';
import { colors, radius, spacing, typography } from '@/theme/theme';
import type { CountryCode } from '@/types';

function Bullets({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {items.map((t, i) => (
        <View key={i} style={styles.bullet}>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.bulletText}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

export default function DocumentDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, country } = useLocalSearchParams<{ id: string; country?: string }>();
  const def = getDocument(id);

  if (!def) {
    return (
      <View style={[styles.flex, styles.center]}>
        <Text style={styles.missing}>Document not found.</Text>
        <Button label="Back" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  const countryCode = (country || undefined) as CountryCode | undefined;
  const link = getHowToLink(def.linkKind, countryCode);
  const countryLabel = countryCode ? COUNTRY_LABELS[countryCode] : undefined;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xxl },
      ]}
    >
      <Pressable accessibilityLabel="Back" onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backArrow}>←</Text>
      </Pressable>

      <Text style={[typography.h1, styles.title]}>{def.name}</Text>
      <Text style={styles.description}>{def.description}</Text>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Who needs it</Text>
        <Text style={styles.para}>{def.whoNeedsIt}</Text>
      </View>

      {/* How to get it (country-specific) */}
      <View style={styles.howCard}>
        <Text style={styles.howTitle}>
          How to get it{countryLabel ? ` — ${countryLabel}` : ''}
        </Text>
        <Text style={styles.howText}>{link.instruction}</Text>
        <Button label="Open official source →" variant="secondary" onPress={() => openExternal(link.url)} />
      </View>

      <Bullets title="Critical rules" items={def.criticalRules} />
      <Bullets title="Common pitfalls" items={def.commonPitfalls} />

      <Text style={styles.footer}>{footer.notAdvice}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  missing: { fontSize: 15, color: colors.textMid },
  content: { paddingHorizontal: spacing.xl },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  backArrow: { fontSize: 18, color: colors.textMid },
  title: { marginBottom: spacing.md },
  description: { fontSize: 15, lineHeight: 23, color: colors.textMid },
  block: { marginTop: spacing.xl },
  blockTitle: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: spacing.sm, letterSpacing: 0.2 },
  para: { fontSize: 14, lineHeight: 21, color: colors.textMid },
  bullet: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  dot: { fontSize: 14, color: colors.green, lineHeight: 20 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 20, color: colors.textMid },
  howCard: {
    backgroundColor: colors.greenLight,
    borderWidth: 1.5,
    borderColor: colors.greenBorder,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  howTitle: { fontSize: 14, fontWeight: '700', color: colors.greenDark },
  howText: { fontSize: 13, lineHeight: 20, color: colors.textMid },
  footer: { fontSize: 11, color: colors.textLight, textAlign: 'center', marginTop: spacing.xxl },
});
