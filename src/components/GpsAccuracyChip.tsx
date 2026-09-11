import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';
import { classificarPrecisaoGps, ROTULO_PRECISAO, type PrecisaoGps } from '../utils/gpsAccuracy';
import { formatarPrecisaoMetros } from '../utils/formatters';

interface GpsAccuracyChipProps {
  accuracy: number | null | undefined;
}

const COR_PRECISAO: Record<PrecisaoGps, string> = {
  alta: colors.verdeSinal,
  media: colors.amareloCampo,
  baixa: colors.alertaVermelho,
  indisponivel: colors.cinzaNeutro,
};

export default function GpsAccuracyChip({ accuracy }: GpsAccuracyChipProps) {
  const classificacao = classificarPrecisaoGps(accuracy);
  const cor = COR_PRECISAO[classificacao];
  const rotulo = ROTULO_PRECISAO[classificacao];
  const metros = formatarPrecisaoMetros(accuracy);

  return (
    <View style={[styles.chip, { borderColor: cor }]}>
      <View style={[styles.dot, { backgroundColor: cor }]} />
      <Text style={[styles.rotulo, { color: cor }]}>{rotulo}</Text>
      <Text style={styles.metros}>{metros}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rotulo: {
    fontFamily: fontFamilies.corpoMedium,
    fontSize: fontSizes.xs,
  },
  metros: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xs,
    color: colors.grafiteSuave,
  },
});
