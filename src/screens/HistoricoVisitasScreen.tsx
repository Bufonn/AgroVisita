import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, Alert, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';
import GpsAccuracyChip from '../components/GpsAccuracyChip';
import { EstadoVazio, EstadoCarregando } from '../components/EstadosUI';
import { listarVisitas, removerVisita } from '../services/storage';
import { formatarDataHora } from '../utils/formatters';
import type { AuditoriaVisita } from '../types/visit';

export default function HistoricoVisitasScreen() {
  const [visitas, setVisitas] = useState<AuditoriaVisita[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    const dados = await listarVisitas();
    setVisitas(dados);
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleRefresh = useCallback(async () => {
    setAtualizando(true);
    const dados = await listarVisitas();
    setVisitas(dados);
    setAtualizando(false);
  }, []);

  const handleDelete = useCallback((visita: AuditoriaVisita) => {
    Alert.alert(
      'Excluir auditoria',
      `Deseja excluir a auditoria ${visita.protocolo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await removerVisita(visita.id);
            setVisitas(prev => prev.filter(v => v.id !== visita.id));
          },
        },
      ]
    );
  }, []);

  const renderItem = useCallback(({ item }: { item: AuditoriaVisita }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onLongPress={() => handleDelete(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.protocolo}>{item.protocolo}</Text>
        <Text style={styles.data}>{formatarDataHora(item.criadaEm)}</Text>
      </View>
      <View style={styles.cardBody}>
        {item.gps && (
          <GpsAccuracyChip accuracy={item.gps.accuracy} />
        )}
        <View style={styles.detalhes}>
          {item.produtor && (
            <View style={styles.detalheLinha}>
              <Ionicons name="person-outline" size={14} color={colors.cinzaNeutro} />
              <Text style={styles.detalheTexto}>{item.produtor.nome}</Text>
            </View>
          )}
          {item.instabilidadeDetectada && (
            <View style={styles.detalheLinha}>
              <Ionicons name="warning-outline" size={14} color={colors.terracota} />
              <Text style={[styles.detalheTexto, { color: colors.terracota }]}>Instabilidade detectada</Text>
            </View>
          )}
        </View>
      </View>
      {item.fotoUri && (
        <Image source={{ uri: item.fotoUri }} style={styles.thumbnail} resizeMode="cover" />
      )}
    </Pressable>
  ), [handleDelete]);

  const keyExtractor = useCallback((item: AuditoriaVisita) => item.id, []);

  if (carregando) {
    return (
      <View style={styles.container}>
        <EstadoCarregando mensagem="Carregando histórico..." />
      </View>
    );
  }

  if (visitas.length === 0) {
    return (
      <View style={styles.container}>
        <EstadoVazio mensagem="Nenhuma auditoria registrada ainda" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={visitas}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.lista}
        refreshing={atualizando}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.begePapel,
  },
  lista: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.begeCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.linha,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  protocolo: {
    fontFamily: fontFamilies.tituloMedium,
    fontSize: fontSizes.md,
    color: colors.verdeTerra,
  },
  data: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.xs,
    color: colors.cinzaNeutro,
  },
  cardBody: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  detalhes: {
    gap: spacing.xs,
  },
  detalheLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detalheTexto: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.sm,
    color: colors.grafiteSuave,
  },
  thumbnail: {
    width: '100%',
    height: 120,
  },
});
