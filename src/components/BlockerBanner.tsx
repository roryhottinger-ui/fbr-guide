import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/theme';

interface BlockerBannerProps {
  /** Optional override message; defaults to the expired-ID copy. */
  message?: string;
}

/** Red hard-blocker banner shown when a `type: "block"` item exists. */
export function BlockerBanner({ message }: BlockerBannerProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>🚫</Text>
      <View style={styles.body}>
        <Text style={styles.title}>Action needed before you post</Text>
        <Text style={styles.text}>
          {message ??
            "A living relative's photo ID is expired. The DFA will not accept it. Arrange renewal before submitting — this is the one thing that will get your whole application returned."}
        </Text>
        <Text style={styles.alt}>💡 Alternatives: valid driving licence · national ID card (EU) · renewed passport</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.blockLight,
    borderWidth: 1.5,
    borderColor: colors.blockBorder,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  icon: { fontSize: 20 },
  body: { flex: 1 },
  title: { fontSize: 13, fontWeight: '700', color: colors.block, marginBottom: 5 },
  text: { fontSize: 12, lineHeight: 18, color: colors.block },
  alt: { fontSize: 11, lineHeight: 16, color: colors.block, opacity: 0.8, marginTop: 10 },
});

export default BlockerBanner;
