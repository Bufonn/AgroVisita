import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';

interface SensorReadoutProps {
  label: string;
  valor: string;
}

export default function SensorReadout({ label, valor }: SensorReadoutProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chip}>
        <Text style={styles.valor}>{valor}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  label: {
    fontFamily: fontFamilies.corpoMedium,
    fontSize: fontSizes.sm,
    color: colors.grafiteSuave,
  },
  chip: {
    backgroundColor: colors.branco,
    borderWidth: 1,
    borderColor: colors.linha,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    minWidth: 80,
    alignItems: 'center',
  },
  valor: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    color: colors.grafite,
  },
});
