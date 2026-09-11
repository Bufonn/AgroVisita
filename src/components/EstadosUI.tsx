import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';

export function EstadoCarregando({ mensagem }: { mensagem?: string }) {
  return (
    <View style={styles.centro}>
      <Ionicons name="hourglass-outline" size={40} color={colors.cinzaNeutro} />
      <Text style={styles.texto}>{mensagem || 'Carregando...'}</Text>
    </View>
  );
}

export function EstadoErro({ mensagem }: { mensagem: string }) {
  return (
    <View style={styles.centro}>
      <Ionicons name="warning-outline" size={40} color={colors.alertaVermelho} />
      <Text style={styles.textoErro}>{mensagem}</Text>
    </View>
  );
}

export function EstadoIndisponivel({ mensagem }: { mensagem: string }) {
  return (
    <View style={styles.centro}>
      <Ionicons name="phone-portrait-outline" size={40} color={colors.cinzaNeutro} />
      <Text style={styles.tituloIndisponivel}>Recurso indisponível</Text>
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

export function EstadoVazio({ mensagem }: { mensagem: string }) {
  return (
    <View style={styles.centro}>
      <Ionicons name="document-text-outline" size={40} color={colors.cinzaNeutro} />
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  texto: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.md,
    color: colors.cinzaNeutro,
    textAlign: 'center',
  },
  textoErro: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.md,
    color: colors.alertaVermelho,
    textAlign: 'center',
  },
  tituloIndisponivel: {
    fontFamily: fontFamilies.tituloMedium,
    fontSize: fontSizes.lg,
    color: colors.grafite,
  },
});
