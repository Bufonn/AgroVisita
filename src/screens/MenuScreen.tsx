import React, { useMemo } from 'react';
import { View, FlatList, Pressable, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';
import BrandMark from '../components/BrandMark';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Menu'>;
};

interface MenuItem {
  id: string;
  titulo: string;
  subtitulo: string;
  icone: keyof typeof Ionicons.glyphMap;
  rota: keyof RootStackParamList;
  corBorda: string;
  fullWidth?: boolean;
}

const ITENS: MenuItem[] = [
  {
    id: 'registro',
    titulo: 'Registrar Visita',
    subtitulo: 'Nova auditoria de campo',
    icone: 'navigate-outline',
    rota: 'RegistroVisita',
    corBorda: colors.verdeTerra,
    fullWidth: true,
  },
  {
    id: 'camera',
    titulo: 'Câmera e Galeria',
    subtitulo: 'Evidências fotográficas',
    icone: 'camera-outline',
    rota: 'Camera',
    corBorda: colors.verdeBroto,
  },
  {
    id: 'contatos',
    titulo: 'Contatos',
    subtitulo: 'Vínculo produtor',
    icone: 'people-outline',
    rota: 'Contatos',
    corBorda: colors.terracota,
  },
  {
    id: 'gps',
    titulo: 'GPS',
    subtitulo: 'Geolocalização do lote',
    icone: 'location-outline',
    rota: 'Gps',
    corBorda: colors.verdeSinal,
  },
  {
    id: 'sensores',
    titulo: 'Sensores',
    subtitulo: 'Acelerômetro e giroscópio',
    icone: 'speedometer-outline',
    rota: 'Sensores',
    corBorda: colors.amareloCampo,
  },
  {
    id: 'historico',
    titulo: 'Histórico',
    subtitulo: 'Auditorias anteriores',
    icone: 'time-outline',
    rota: 'HistoricoVisitas',
    corBorda: colors.grafite,
  },
];

type Linha = { tipo: 'full'; item: MenuItem } | { tipo: 'grid'; itens: MenuItem[] };

function montarLinhas(itens: MenuItem[], numColunas: number): Linha[] {
  const linhas: Linha[] = [];
  let linhaAtual: MenuItem[] = [];
  for (const item of itens) {
    if (item.fullWidth) {
      if (linhaAtual.length > 0) {
        linhas.push({ tipo: 'grid', itens: linhaAtual });
        linhaAtual = [];
      }
      linhas.push({ tipo: 'full', item });
    } else {
      linhaAtual.push(item);
      if (linhaAtual.length === numColunas) {
        linhas.push({ tipo: 'grid', itens: linhaAtual });
        linhaAtual = [];
      }
    }
  }
  if (linhaAtual.length > 0) {
    linhas.push({ tipo: 'grid', itens: linhaAtual });
  }
  return linhas;
}

export default function MenuScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const numColunas = width >= 600 ? 3 : 2;
  const linhas = useMemo(() => montarLinhas(ITENS, numColunas), [numColunas]);

  const renderCard = (item: MenuItem, fullWidth: boolean) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: item.corBorda },
        fullWidth && styles.cardFullWidth,
        pressed && styles.cardPressed,
      ]}
      onPress={() => navigation.navigate(item.rota as never)}
    >
      <Ionicons name={item.icone} size={28} color={item.corBorda} />
      <View style={styles.cardTexto}>
        <Text style={styles.cardTitulo}>{item.titulo}</Text>
        <Text style={styles.cardSubtitulo}>{item.subtitulo}</Text>
      </View>
    </Pressable>
  );

  const renderItem = ({ item: linha }: { item: Linha }) => {
    if (linha.tipo === 'full') {
      return renderCard(linha.item, true);
    }
    return (
      <View style={styles.linhaGrid}>
        {linha.itens.map(item => (
          <View key={item.id} style={styles.celula}>{renderCard(item, false)}</View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BrandMark size={40} />
        <View style={styles.headerTexto}>
          <Text style={styles.titulo}>AgroVisita</Text>
          <Text style={styles.subtitulo}>Auditoria de propriedades rurais</Text>
        </View>
      </View>
      <FlatList
        data={linhas}
        renderItem={renderItem}
        keyExtractor={(linha) =>
          linha.tipo === 'full' ? linha.item.id : linha.itens.map(i => i.id).join('-')
        }
        contentContainerStyle={styles.lista}
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
  header: {
    backgroundColor: colors.verdeTerra,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerTexto: {
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
  },
  lista: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  linhaGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  celula: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: colors.begeCard,
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: spacing.lg,
  },
  cardFullWidth: {
    width: '100%',
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardTexto: {
    marginTop: spacing.sm,
  },
  cardTitulo: {
    fontFamily: fontFamilies.tituloMedium,
    fontSize: fontSizes.md,
    color: colors.grafite,
  },
  cardSubtitulo: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.xs,
    color: colors.grafiteSuave,
    marginTop: 2,
  },
});