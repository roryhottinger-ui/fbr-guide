import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { infoArticles } from '@/content/infoArticles';
import { colors, radius, spacing, typography } from '@/theme/theme';

export default function InfoHub() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const priority = infoArticles.filter((a) => a.priority);
  const rest = infoArticles.filter((a) => !a.priority);

  const Card = ({ id, title, summary, highlight }: { id: string; title: string; summary: string; highlight?: boolean }) => (
    <Pressable
      onPress={() => router.push({ pathname: '/info/[topic]', params: { topic: id } })}
      style={[styles.card, highlight && { borderColor: colors.warnBorder, backgroundColor: colors.warnLight }]}
    >
      <Text style={[styles.cardTitle, highlight && { color: colors.warn }]}>{title}</Text>
      <Text style={styles.cardSummary}>{summary}</Text>
    </Pressable>
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xxl },
      ]}
    >
      <View style={styles.headerRow}>
        <Pressable accessibilityLabel="Back" onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={[typography.h2, styles.headerTitle]}>Info & FAQ</Text>
      </View>

      {priority.length > 0 ? (
        <>
          <Text style={typography.label}>Read these first</Text>
          <View style={styles.group}>
            {priority.map((a) => (
              <Card key={a.id} id={a.id} title={a.title} summary={a.summary} highlight />
            ))}
          </View>
        </>
      ) : null}

      <Text style={typography.label}>All topics</Text>
      <View style={styles.group}>
        {rest.map((a) => (
          <Card key={a.id} id={a.id} title={a.title} summary={a.summary} />
        ))}
      </View>

      <Pressable onPress={() => router.push('/legal')} style={styles.legalRow}>
        <Text style={styles.legalText}>Privacy &amp; Terms · Disclaimer →</Text>
      </Pressable>
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
  group: { marginTop: spacing.sm, marginBottom: spacing.lg, gap: spacing.sm },
  legalRow: { paddingVertical: spacing.md, alignItems: 'center' },
  legalText: { fontSize: 13, color: colors.green, fontWeight: '600' },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  cardSummary: { fontSize: 13, lineHeight: 19, color: colors.textMid, marginTop: 4 },
});
