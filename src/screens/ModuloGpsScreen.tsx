import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';
import PermissionGate from '../components/PermissionGate';
import AppButton from '../components/AppButton';
import StatusCard from '../components/StatusCard';
import GpsAccuracyChip from '../components/GpsAccuracyChip';
import { EstadoIndisponivel } from '../components/EstadosUI';
import { useLocation } from '../hooks/useLocation';
import { solicitarPermissaoLocalizacao } from '../services/permissions';
import { formatarCoordenada } from '../utils/formatters';

export default function ModuloGpsScreen() {
  const { carregando, erro, captura, servicosAtivos, capturarCoordenadas, verificarServicos } = useLocation();

  useEffect(() => {
    verificarServicos();
  }, [verificarServicos]);

  return (
    <PermissionGate
      titulo="Permissão de localização"
      descricao="AgroVisita precisa acessar sua localização para georreferenciar propriedades."
      recursos={solicitarPermissaoLocalizacao}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
        {servicosAtivos === false && (
          <EstadoIndisponivel mensagem="Serviços de localização desativados. Ative o GPS nas configurações do dispositivo." />
        )}

        {servicosAtivos !== false && (
          <>
            <StatusCard
              titulo="Coordenadas atuais"
              icone="location-outline"
              corBorda={colors.verdeSinal}
            >
              <AppButton
                titulo="Obter coordenadas atuais"
                variante="sucesso"
                icone="location-outline"
                onPress={capturarCoordenadas}
                carregando={carregando}
                estilo={styles.botao}
              />
            </StatusCard>

            {erro && <Text style={styles.erro}>{erro}</Text>}

            {captura && (
              <StatusCard
                titulo="Resultado"
                icone="checkmark-circle-outline"
                corBorda={colors.verdeBroto}
              >
                <GpsAccuracyChip accuracy={captura.accuracy} />
                <View style={styles.dados}>
                  <View style={styles.linha}>
                    <Text style={styles.label}>Latitude</Text>
                    <Text style={styles.valor}>{formatarCoordenada(captura.latitude)}</Text>
                  </View>
                  <View style={styles.linha}>
                    <Text style={styles.label}>Longitude</Text>
                    <Text style={styles.valor}>{formatarCoordenada(captura.longitude)}</Text>
                  </View>
                  {captura.altitude != null && (
                    <View style={styles.linha}>
                      <Text style={styles.label}>Altitude</Text>
                      <Text style={styles.valor}>{captura.altitude.toFixed(1)}m</Text>
                    </View>
                  )}
                </View>
              </StatusCard>
            )}
          </>
        )}
      </ScrollView>
    </PermissionGate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.begePapel,
  },
  conteudo: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  botao: {
    marginTop: spacing.md,
  },
  erro: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.sm,
    color: colors.alertaVermelho,
  },
  dados: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: fontFamilies.corpoMedium,
    fontSize: fontSizes.sm,
    color: colors.grafiteSuave,
  },
  valor: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    color: colors.grafite,
  },
});
