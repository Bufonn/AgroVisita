import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Linking, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';
import AppButton from './AppButton';
import type { ResultadoPermissao } from '../services/permissions';

type EstadoPermissao = 'verificando' | 'concedido' | 'negado' | 'negado-permanente';

interface PermissionGateProps {
  titulo: string;
  descricao: string;
  recursos: () => Promise<ResultadoPermissao>;
  children: React.ReactNode;
}

export default function PermissionGate({ titulo, descricao, recursos, children }: PermissionGateProps) {
  const [estado, setEstado] = useState<EstadoPermissao>('verificando');
  const [erro, setErro] = useState<string | null>(null);

  const verificar = async () => {
    setEstado('verificando');
    setErro(null);
    try {
      const resultado = await recursos();
      if (resultado.erro) {
        setErro(resultado.erro);
        setEstado('negado');
        return;
      }
      if (resultado.concedida) {
        setEstado('concedido');
      } else if (resultado.podePerguntarNovamente) {
        setEstado('negado');
      } else {
        setEstado('negado-permanente');
      }
    } catch {
      setErro('Erro ao verificar permissões');
      setEstado('negado');
    }
  };

  useEffect(() => {
    verificar();
  }, []);

  if (estado === 'verificando') {
    return (
      <View style={styles.centro}>
        <Ionicons name="shield-checkmark-outline" size={48} color={colors.cinzaNeutro} />
        <Text style={styles.textoCentro}>Verificando permissões...</Text>
      </View>
    );
  }

  if (estado === 'concedido') {
    return <>{children}</>;
  }

  if (estado === 'negado-permanente') {
    return (
      <View style={styles.centro}>
        <Ionicons name="close-circle-outline" size={48} color={colors.alertaVermelho} />
        <Text style={styles.tituloNegado}>Acesso negado permanentemente</Text>
        <Text style={styles.descricaoNegado}>
          Para usar este recurso, abra as configurações do sistema manualmente.
        </Text>
        <AppButton
          titulo="Abrir Configurações"
          variante="primaria"
          icone="settings-outline"
          onPress={() => Linking.openSettings()}
          estilo={styles.botaoSettings}
        />
      </View>
    );
  }

  return (
    <View style={styles.centro}>
      <Ionicons name="alert-circle-outline" size={48} color={colors.terracota} />
      <Text style={styles.tituloNegado}>{titulo}</Text>
      <Text style={styles.descricaoNegado}>{descricao}</Text>
      {erro && <Text style={styles.erro}>{erro}</Text>}
      <AppButton
        titulo="Tentar novamente"
        variante="primaria"
        icone="refresh-outline"
        onPress={verificar}
        estilo={styles.botaoRetry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.md,
  },
  textoCentro: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.md,
    color: colors.cinzaNeutro,
  },
  tituloNegado: {
    fontFamily: fontFamilies.tituloMedium,
    fontSize: fontSizes.lg,
    color: colors.grafite,
    textAlign: 'center',
  },
  descricaoNegado: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.sm,
    color: colors.grafiteSuave,
    textAlign: 'center',
    lineHeight: 20,
  },
  erro: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.sm,
    color: colors.alertaVermelho,
    textAlign: 'center',
  },
  botaoSettings: {
    marginTop: spacing.md,
  },
  botaoRetry: {
    marginTop: spacing.sm,
  },
});
