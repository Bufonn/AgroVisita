import React from 'react';
import { Text, Pressable, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';

type Variante = 'primaria' | 'sucesso' | 'atencao' | 'perigo' | 'outline';

interface AppButtonProps {
  titulo: string;
  variante?: Variante;
  icone?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  desabilitado?: boolean;
  carregando?: boolean;
  estilo?: ViewStyle;
  compact?: boolean;
}

const VARIANTE_CONFIG: Record<Variante, { bg: string; texto: string; borda: string }> = {
  primaria: { bg: colors.verdeTerra, texto: colors.branco, borda: colors.verdeTerra },
  sucesso: { bg: colors.verdeBroto, texto: colors.branco, borda: colors.verdeBroto },
  atencao: { bg: colors.amareloCampo, texto: colors.grafite, borda: colors.amareloCampo },
  perigo: { bg: colors.alertaVermelho, texto: colors.branco, borda: colors.alertaVermelho },
  outline: { bg: 'transparent', texto: colors.verdeTerra, borda: colors.verdeTerra },
};

export default function AppButton({
  titulo,
  variante = 'primaria',
  icone,
  onPress,
  desabilitado = false,
  carregando = false,
  estilo,
  compact = false,
}: AppButtonProps) {
  const cfg = VARIANTE_CONFIG[variante];
  const isDisabled = desabilitado || carregando;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: cfg.bg,
          borderColor: cfg.borda,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
        compact && styles.compact,
        estilo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={cfg.texto} size="small" />
      ) : (
        <>
          {icone && (
            <Ionicons
              name={icone}
              size={compact ? 16 : 20}
              color={cfg.texto}
              style={styles.icone}
            />
          )}
          <Text style={[styles.texto, { color: cfg.texto }]}>{titulo}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 1.5,
    minHeight: 48,
  },
  compact: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  icone: {
    marginRight: spacing.sm,
  },
  texto: {
    fontFamily: fontFamilies.corpoSemiBold,
    fontSize: fontSizes.md,
  },
});
