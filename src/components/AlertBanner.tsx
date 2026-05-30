import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/theme';
import type { AlertLevel } from '@/types';

interface AlertBannerProps {
  level: AlertLevel;
  text: string;
}

/** Inline amber (warn) or neutral (info) banner used across the app. */
export function AlertBanner({ level, text }: AlertBannerProps) {
  const isWarn = level === 'warn';
  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: isWarn ? colors.warnLight : colors.greenLight,
          borderColor: isWarn ? colors.warnBorder : colors.greenBorder,
        },
      ]}
    >
      <Text style={[styles.text, { color: isWarn ? colors.warn : colors.greenDark }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  text: { fontSize: 12, lineHeight: 18 },
});

export default AlertBanner;
