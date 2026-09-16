import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import COLORS from '../theme/colors';

const LoadingOverlay = ({ visible, message = 'Cargando...' }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={COLORS.accent} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(245, 241, 227, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  message: {
    color: COLORS.text,
    fontSize: 15,
    marginTop: 12,
  },
});

export default LoadingOverlay;
