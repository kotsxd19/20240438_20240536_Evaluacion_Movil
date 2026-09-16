import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

const VARIANT_STYLES = {
  primary: { container: 'primaryContainer', text: 'primaryText', iconColor: COLORS.white },
  outline: { container: 'outlineContainer', text: 'outlineText', iconColor: COLORS.accent },
  danger: { container: 'dangerContainer', text: 'dangerText', iconColor: COLORS.white },
};

const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const variantConfig = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variantConfig.container],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantConfig.iconColor} />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={variantConfig.iconColor}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, styles[variantConfig.text]]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryContainer: {
    backgroundColor: COLORS.accent,
  },
  primaryText: {
    color: COLORS.white,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  outlineText: {
    color: COLORS.accent,
  },
  dangerContainer: {
    backgroundColor: COLORS.text,
  },
  dangerText: {
    color: COLORS.white,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default CustomButton;
