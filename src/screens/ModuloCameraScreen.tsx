import React from 'react';
import { View, Image, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';
import PermissionGate from '../components/PermissionGate';
import AppButton from '../components/AppButton';
import { useImageCapture } from '../hooks/useImageCapture';
import { solicitarPermissaoCamera, solicitarPermissaoGaleria } from '../services/permissions';

export default function ModuloCameraScreen() {
  const { fotoUri, carregando, erro, capturarFoto, escolherGaleria } = useImageCapture();

  return (
    <PermissionGate
      titulo="Permissão de câmera"
      descricao="AgroVisita precisa de acesso à câmera e galeria para registrar evidências fotográficas."
      recursos={async () => {
        const cam = await solicitarPermissaoCamera();
        if (!cam.concedida) return cam;
        return solicitarPermissaoGaleria();
      }}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
        <Text style={styles.instrucao}>
          Capture fotos ou selecione imagens da galeria para evidências de auditoria.
        </Text>

        <View style={styles.botoes}>
          <AppButton
            titulo="Capturar foto"
            variante="primaria"
            icone="camera-outline"
            onPress={capturarFoto}
            carregando={carregando}
            estilo={styles.botao}
          />
          <AppButton
            titulo="Escolher da galeria"
            variante="outline"
            icone="images-outline"
            onPress={escolherGaleria}
            carregando={carregando}
            estilo={styles.botao}
          />
        </View>

        {erro && <Text style={styles.erro}>{erro}</Text>}

        {fotoUri && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Evidência capturada:</Text>
            <Image source={{ uri: fotoUri }} style={styles.preview} resizeMode="cover" />
          </View>
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
    gap: spacing.lg,
  },
  instrucao: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.md,
    color: colors.grafiteSuave,
    lineHeight: 22,
  },
  botoes: {
    gap: spacing.md,
  },
  botao: {
    width: '100%',
  },
  erro: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.sm,
    color: colors.alertaVermelho,
  },
  previewContainer: {
    gap: spacing.sm,
  },
  previewLabel: {
    fontFamily: fontFamilies.corpoMedium,
    fontSize: fontSizes.sm,
    color: colors.grafite,
  },
  preview: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: colors.begeCard,
  },
});
