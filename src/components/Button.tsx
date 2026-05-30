import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, radius } from '@/theme/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  loading = false,
  style,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary && { backgroundColor: disabled ? colors.border : colors.green },
        variant === 'secondary' && {
          backgroundColor: colors.card,
          borderWidth: 1.5,
          borderColor: colors.greenBorder,
        },
        isGhost && { backgroundColor: 'transparent', paddingVertical: 8 },
        pressed && !disabled && { opacity: 0.85 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.white : colors.green} />
      ) : (
        <Text
          style={[
            styles.label,
            isPrimary && { color: disabled ? colors.textLight : colors.white },
            variant === 'secondary' && { color: colors.green },
            isGhost && { color: colors.green },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});

export default Button;
