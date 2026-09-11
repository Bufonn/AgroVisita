import React from 'react';
import { View, Text, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';

interface CampoTextoProps extends TextInputProps {
  label: string;
  erro?: string;
}

export default function CampoTexto({ label, erro, ...props }: CampoTextoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, erro && styles.inputErro, props.multiline && styles.multiline]}
        placeholderTextColor={colors.cinzaNeutro}
        {...props}
      />
      {erro && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: fontFamilies.corpoMedium,
    fontSize: fontSizes.sm,
    color: colors.grafite,
    marginBottom: spacing.xs,
  },
  input: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.md,
    color: colors.grafite,
    backgroundColor: colors.branco,
    borderWidth: 1,
    borderColor: colors.linha,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputErro: {
    borderColor: colors.alertaVermelho,
  },
  erro: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.xs,
    color: colors.alertaVermelho,
    marginTop: spacing.xs,
  },
});
