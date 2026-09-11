import React, { useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Modal, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';
import { useContactsPaged } from '../hooks/useContactsPaged';
import ContatoItem from './ContatoItem';
import { EstadoCarregando, EstadoErro, EstadoVazio } from './EstadosUI';
import type { ContatoResumido } from '../services/contactsService';

interface SeletorContatoModalProps {
  visivel: boolean;
  onFechar: () => void;
  onSelecionar: (contato: ContatoResumido) => void;
}

export default function SeletorContatoModal({ visivel, onFechar, onSelecionar }: SeletorContatoModalProps) {
  const {
    contatos,
    busca,
    carregandoPrimeira,
    carregandoMais,
    fim,
    erro,
    total,
    mudarBusca,
    carregarPrimeiraPagina,
    carregarMais,
  } = useContactsPaged();

  useEffect(() => {
    if (visivel) {
      carregarPrimeiraPagina('');
    }
  }, [visivel, carregarPrimeiraPagina]);

  const handleSelecionar = useCallback((contato: ContatoResumido) => {
    onSelecionar(contato);
    onFechar();
  }, [onSelecionar, onFechar]);

  const renderItem = useCallback(({ item }: { item: ContatoResumido }) => (
    <ContatoItem contato={item} onSelect={handleSelecionar} />
  ), [handleSelecionar]);

  const keyExtractor = useCallback((item: ContatoResumido) => item.id, []);

  return (
    <Modal
      visible={visivel}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onFechar}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Selecionar Contato</Text>
          <Pressable onPress={onFechar} style={styles.botaoFechar}>
            <Ionicons name="close" size={24} color={colors.grafite} />
          </Pressable>
        </View>
        <View style={styles.barraBusca}>
          <Ionicons name="search" size={18} color={colors.cinzaNeutro} />
          <TextInput
            style={styles.input}
            placeholder="Buscar contato..."
            placeholderTextColor={colors.cinzaNeutro}
            value={busca}
            onChangeText={mudarBusca}
            autoCorrect={false}
          />
        </View>
        {total > 0 && (
          <Text style={styles.contador}>{total} contatos encontrados</Text>
        )}
        {erro && <EstadoErro mensagem={erro} />}
        {!erro && carregandoPrimeira && contatos.length === 0 && (
          <EstadoCarregando mensagem="Carregando contatos..." />
        )}
        {!erro && !carregandoPrimeira && contatos.length === 0 && (
          <EstadoVazio mensagem="Nenhum contato encontrado" />
        )}
        <FlatList
          data={contatos}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={carregarMais}
          onEndReachedThreshold={0.3}
          windowSize={10}
          maxToRenderPerBatch={20}
          removeClippedSubviews
          ListFooterComponent={
            carregandoMais ? (
              <View style={styles.footer}>
                <Text style={styles.footerTexto}>Carregando mais...</Text>
              </View>
            ) : fim && contatos.length > 0 ? (
              <View style={styles.footer}>
                <Text style={styles.footerTexto}>Todos os contatos carregados</Text>
              </View>
            ) : null
          }
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.begePapel,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.linha,
  },
  titulo: {
    fontFamily: fontFamilies.titulo,
    fontSize: fontSizes.lg,
    color: colors.grafite,
  },
  botaoFechar: {
    padding: spacing.xs,
  },
  barraBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.branco,
    margin: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.linha,
  },
  input: {
    flex: 1,
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.md,
    color: colors.grafite,
    paddingVertical: spacing.md,
    marginLeft: spacing.sm,
  },
  contador: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.xs,
    color: colors.cinzaNeutro,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  footer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  footerTexto: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.xs,
    color: colors.cinzaNeutro,
  },
});
