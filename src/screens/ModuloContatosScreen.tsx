import React, { useCallback, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';
import PermissionGate from '../components/PermissionGate';
import ContatoItem from '../components/ContatoItem';
import { EstadoCarregando, EstadoErro, EstadoVazio } from '../components/EstadosUI';
import { useContactsPaged } from '../hooks/useContactsPaged';
import { solicitarPermissaoContatos } from '../services/permissions';
import type { ContatoResumido } from '../services/contactsService';

export default function ModuloContatosScreen() {
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
    carregarPrimeiraPagina('');
  }, [carregarPrimeiraPagina]);

  const handleSelect = useCallback((_contato: ContatoResumido) => {}, []);

  const renderItem = useCallback(({ item }: { item: ContatoResumido }) => (
    <ContatoItem contato={item} onSelect={handleSelect} />
  ), [handleSelect]);

  const keyExtractor = useCallback((item: ContatoResumido) => item.id, []);

  return (
    <PermissionGate
      titulo="Permissão de contatos"
      descricao="AgroVisita precisa acessar seus contatos para vincular produtores e representantes às auditorias."
      recursos={solicitarPermissaoContatos}
    >
      <View style={styles.container}>
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
          contentContainerStyle={contatos.length === 0 && styles.listaVazia}
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
    </PermissionGate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.begePapel,
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
  listaVazia: {
    flexGrow: 1,
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