import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';
import type { ContatoResumido } from '../services/contactsService';

interface ContatoItemProps {
  contato: ContatoResumido;
  onSelect: (contato: ContatoResumido) => void;
}

function ContatoItemInner({ contato, onSelect }: ContatoItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onSelect(contato)}
    >
      <View style={styles.avatar}>
        <Ionicons name="person-outline" size={20} color={colors.cinzaNeutro} />
      </View>
      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={1}>{contato.nome}</Text>
        {contato.telefone && (
          <Text style={styles.telefone} numberOfLines={1}>{contato.telefone}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.cinzaNeutro} />
    </Pressable>
  );
}

const ContatoItem = React.memo(ContatoItemInner);

export default ContatoItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.linha,
    gap: spacing.md,
  },
  pressed: {
    backgroundColor: colors.begeCard,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.begePapel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  nome: {
    fontFamily: fontFamilies.corpoMedium,
    fontSize: fontSizes.md,
    color: colors.grafite,
  },
  telefone: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xs,
    color: colors.cinzaNeutro,
    marginTop: 2,
  },
});
