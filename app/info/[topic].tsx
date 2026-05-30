import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { footer } from '@/content/legal';
import { getInfoArticle } from '@/content/infoArticles';
import { openExternal } from '@/lib/external';
import { colors, radius, spacing, typography } from '@/theme/theme';

export default function InfoArticleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const article = getInfoArticle(topic);

  if (!article) {
    return (
      <View style={[styles.flex, styles.center]}>
        <Text style={styles.missing}>Article not found.</Text>
        <Button label="Back" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

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

      <Text style={[typography.h1, styles.title]}>{article.title}</Text>
      {article.body.map((p, i) => (
        <Text key={i} style={styles.para}>{p}</Text>
      ))}

      {article.links?.length ? (
        <View style={styles.links}>
          {article.links.map((l) => (
            <Button key={l.url} label={l.label} variant="secondary" onPress={() => openExternal(l.url)} />
          ))}
        </View>
      ) : null}

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
  title: { marginBottom: spacing.lg },
  para: { fontSize: 15, lineHeight: 24, color: colors.textMid, marginBottom: spacing.lg },
  links: { gap: spacing.sm, marginTop: spacing.sm },
  footer: { fontSize: 11, color: colors.textLight, textAlign: 'center', marginTop: spacing.xl },
});
