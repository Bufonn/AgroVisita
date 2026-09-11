import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';

interface StatusCardProps {
  titulo: string;
  descricao?: string;
  icone?: keyof typeof Ionicons.glyphMap;
  corBorda?: string;
  children?: React.ReactNode;
  estilo?: ViewStyle;
}

export default function StatusCard({
  titulo,
  descricao,
  icone,
  corBorda = colors.verdeTerra,
  children,
  estilo,
}: StatusCardProps) {
  return (
    <View style={[styles.container, { borderLeftColor: corBorda }, estilo]}>
      <View style={styles.header}>
        {icone && (
          <Ionicons name={icone} size={18} color={corBorda} style={styles.icone} />
        )}
        <Text style={styles.titulo}>{titulo}</Text>
      </View>
      {descricao && <Text style={styles.descricao}>{descricao}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.begeCard,
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  icone: {
    marginRight: spacing.sm,
  },
  titulo: {
    fontFamily: fontFamilies.tituloMedium,
    fontSize: fontSizes.md,
    color: colors.grafite,
    flex: 1,
  },
  descricao: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.sm,
    color: colors.grafiteSuave,
    marginBottom: spacing.sm,
  },
});
