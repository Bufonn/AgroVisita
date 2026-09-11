import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';

interface AppHeaderProps {
  titulo: string;
  subtitulo?: string;
  onVoltar?: () => void;
}

export default function AppHeader({ titulo, subtitulo, onVoltar }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      {onVoltar && (
        <Pressable onPress={onVoltar} style={styles.botaoVoltar}>
          <Ionicons name="arrow-back" size={24} color={colors.begePapel} />
        </Pressable>
      )}
      <View style={styles.textoContainer}>
        <Text style={styles.titulo}>{titulo}</Text>
        {subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.verdeTerra,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  botaoVoltar: {
    padding: spacing.xs,
  },
  textoContainer: {
    flex: 1,
  },
  titulo: {
    fontFamily: fontFamilies.tituloBold,
    fontSize: fontSizes.xxl,
    color: colors.begePapel,
  },
  subtitulo: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.sm,
    color: colors.begePapel,
    opacity: 0.8,
    marginTop: 2,
  },
});
