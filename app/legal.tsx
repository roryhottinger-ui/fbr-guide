import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { legalSections } from '@/content/legal';
import { colors, radius, spacing, typography } from '@/theme/theme';

export default function LegalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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

      <Text style={[typography.h1, styles.title]}>Privacy & Terms</Text>

      {legalSections.map((s) => (
        <View key={s.heading} style={styles.section}>
          <Text style={styles.heading}>{s.heading}</Text>
          {s.paragraphs.map((p, i) => (
            <Text key={i} style={styles.para}>{p}</Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  section: { marginBottom: spacing.xl },
  heading: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  para: { fontSize: 14, lineHeight: 22, color: colors.textMid, marginBottom: spacing.md },
});
