import React, { useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, Alert, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';
import StatusCard from '../components/StatusCard';
import GpsAccuracyChip from '../components/GpsAccuracyChip';
import CampoTexto from '../components/CampoTexto';
import AppButton from '../components/AppButton';
import SeletorContatoModal from '../components/SeletorContatoModal';
import { useLocation } from '../hooks/useLocation';
import { useImageCapture } from '../hooks/useImageCapture';
import { useAccelerometerGuard } from '../hooks/useAccelerometerGuard';
import { solicitarPermissaoCamera, solicitarPermissaoGaleria, solicitarPermissaoLocalizacao } from '../services/permissions';
import { salvarVisita, persistirFoto } from '../services/storage';
import { formatarCoordenada, gerarProtocolo } from '../utils/formatters';
import { dadosFaltantesParaFinalizar } from '../utils/validators';
import type { GpsCaptura, ProdutorVinculado } from '../types/visit';
import type { ContatoResumido } from '../services/contactsService';

export default function RegistroVisitaScreen() {
  const protocolo = useRef(gerarProtocolo()).current;
  const [observacoes, setObservacoes] = useState('');
  const [produtor, setProdutor] = useState<ProdutorVinculado | null>(null);
  const [modalContatoVisivel, setModalContatoVisivel] = useState(false);
  const [finalizando, setFinalizando] = useState(false);

  const { carregando: gpsCarregando, erro: gpsErro, captura: gpsCaptura, capturarCoordenadas } = useLocation();
  const { fotoUri, carregando: fotoCarregando, erro: fotoErro, capturarFoto, escolherGaleria, setFotoUri } = useImageCapture();
  const { disponivel: acelDisponivel, verificarEstabilidadeDuracao } = useAccelerometerGuard();

  const handleCapturarGps = useCallback(async () => {
    await capturarCoordenadas();
  }, [capturarCoordenadas]);

  const handleCapturarFoto = useCallback(async () => {
    await capturarFoto();
  }, [capturarFoto]);

  const handleEscolherGaleria = useCallback(async () => {
    await escolherGaleria();
  }, [escolherGaleria]);

  const handleSelecionarContato = useCallback((contato: ContatoResumido) => {
    setProdutor({
      contatoId: contato.id,
      nome: contato.nome,
      telefone: contato.telefone,
    });
  }, []);

  const handleFinalizar = useCallback(async () => {
    const faltando = dadosFaltantesParaFinalizar(gpsCaptura, fotoUri, produtor);
    if (faltando.length > 0) {
      Alert.alert(
        'Campos obrigatórios',
        `Os seguintes campos são obrigatórios: ${faltando.join(', ')}.`
      );
      return;
    }

    setFinalizando(true);
    try {
      let instabilidadeDetectada = false;

      if (acelDisponivel) {
        const estavel = await verificarEstabilidadeDuracao(2000);
        if (!estavel) {
          instabilidadeDetectada = true;
          Alert.alert(
            'Instabilidade Física Detectada',
            'Aguarde o dispositivo ficar parado para assinar.'
          );
          setFinalizando(false);
          return;
        }
      }

      let fotoPersistida: string | null = null;
      if (fotoUri) {
        fotoPersistida = await persistirFoto(fotoUri);
      }

      const agora = Date.now();
      await salvarVisita({
        id: `av-${agora}`,
        protocolo,
        gps: gpsCaptura,
        fotoUri: fotoPersistida,
        produtor,
        observacoes,
        criadaEm: agora,
        concluidaEm: agora,
        instabilidadeDetectada,
      });

      Alert.alert('Sucesso', 'Auditoria registrada com sucesso!', [
        { text: 'OK' },
      ]);

      setObservacoes('');
      setProdutor(null);
      setFotoUri(null);
    } catch {
      Alert.alert('Erro', 'Falha ao salvar a auditoria. Tente novamente.');
    } finally {
      setFinalizando(false);
    }
  }, [gpsCaptura, fotoUri, produtor, observacoes, protocolo, acelDisponivel, verificarEstabilidadeDuracao, setFotoUri]);

  const handleRemoveGps = useCallback(() => {
    Alert.alert('Remover GPS', 'Deseja remover a captura GPS?', [
      { text: 'Cancelar' },
      { text: 'Remover', style: 'destructive' },
    ]);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <View style={styles.header}>
        <Text style={styles.protocolo}>{protocolo}</Text>
        <Text style={styles.subtitulo}>Preencha os dados da auditoria</Text>
      </View>

      <StatusCard
        titulo="1. Georreferenciamento do Lote"
        descricao="Capture as coordenadas GPS da propriedade"
        icone="location-outline"
        corBorda={colors.verdeSinal}
      >
        {gpsCaptura ? (
          <View style={styles.resultadoGps}>
            <GpsAccuracyChip accuracy={gpsCaptura.accuracy} />
            <View style={styles.dadosGps}>
              <View style={styles.linha}>
                <Text style={styles.label}>Latitude</Text>
                <Text style={styles.valorMono}>{formatarCoordenada(gpsCaptura.latitude)}</Text>
              </View>
              <View style={styles.linha}>
                <Text style={styles.label}>Longitude</Text>
                <Text style={styles.valorMono}>{formatarCoordenada(gpsCaptura.longitude)}</Text>
              </View>
            </View>
          </View>
        ) : (
          <AppButton
            titulo="Capturar coordenadas GPS"
            variante="sucesso"
            icone="location-outline"
            onPress={handleCapturarGps}
            carregando={gpsCarregando}
          />
        )}
        {gpsErro && <Text style={styles.erro}>{gpsErro}</Text>}
      </StatusCard>

      <StatusCard
        titulo="2. Evidência Fotográfica"
        descricao="Capture ou selecione uma imagem como evidência"
        icone="camera-outline"
        corBorda={colors.verdeBroto}
      >
        {fotoUri ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: fotoUri }} style={styles.preview} resizeMode="cover" />
            <AppButton
              titulo="Alterar foto"
              variante="outline"
              icone="camera-outline"
              onPress={handleCapturarFoto}
              compact
              estilo={styles.botaoAlterar}
            />
          </View>
        ) : (
          <View style={styles.botoesFoto}>
            <AppButton
              titulo="Capturar foto"
              variante="primaria"
              icone="camera-outline"
              onPress={handleCapturarFoto}
              carregando={fotoCarregando}
              compact
            />
            <AppButton
              titulo="Escolher da galeria"
              variante="outline"
              icone="images-outline"
              onPress={handleEscolherGaleria}
              carregando={fotoCarregando}
              compact
            />
          </View>
        )}
        {fotoErro && <Text style={styles.erro}>{fotoErro}</Text>}
      </StatusCard>

      <StatusCard
        titulo="3. Vínculo Produtor/Representante"
        descricao="Vincule um contato da agenda"
        icone="people-outline"
        corBorda={colors.terracota}
      >
        {produtor ? (
          <View style={styles.produtorInfo}>
            <View style={styles.produtorAvatar}>
              <Ionicons name="person" size={20} color={colors.branco} />
            </View>
            <View style={styles.produtorDados}>
              <Text style={styles.produtorNome}>{produtor.nome}</Text>
              {produtor.telefone && (
                <Text style={styles.produtorTelefone}>{produtor.telefone}</Text>
              )}
            </View>
            <Pressable onPress={() => setProdutor(null)}>
              <Ionicons name="close-circle" size={22} color={colors.alertaVermelho} />
            </Pressable>
          </View>
        ) : (
          <AppButton
            titulo="Selecionar produtor"
            variante="atencao"
            icone="people-outline"
            onPress={() => setModalContatoVisivel(true)}
          />
        )}
      </StatusCard>

      <StatusCard
        titulo="4. Observações"
        descricao="Anote detalhes relevantes sobre a auditoria"
        icone="document-text-outline"
        corBorda={colors.cinzaNeutro}
      >
        <CampoTexto
          label="Observações da visita"
          placeholder="Descreva as condições encontradas, pendências, etc."
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
          numberOfLines={4}
        />
      </StatusCard>

      <AppButton
        titulo="Finalizar e Assinar Auditoria"
        variante="primaria"
        icone="checkmark-circle-outline"
        onPress={handleFinalizar}
        desabilitado={!!dadosFaltantesParaFinalizar(gpsCaptura, fotoUri, produtor).length && !finalizando}
        carregando={finalizando}
        estilo={styles.botaoFinalizar}
      />

      <SeletorContatoModal
        visivel={modalContatoVisivel}
        onFechar={() => setModalContatoVisivel(false)}
        onSelecionar={handleSelecionarContato}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.begePapel,
  },
  conteudo: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  protocolo: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xl,
    color: colors.verdeTerra,
  },
  subtitulo: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.sm,
    color: colors.grafiteSuave,
    marginTop: spacing.xs,
  },
  resultadoGps: {
    gap: spacing.sm,
  },
  dadosGps: {
    gap: spacing.xs,
    marginTop: spacing.sm,
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
  valorMono: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    color: colors.grafite,
  },
  erro: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.sm,
    color: colors.alertaVermelho,
    marginTop: spacing.sm,
  },
  botoesFoto: {
    gap: spacing.sm,
  },
  previewContainer: {
    gap: spacing.sm,
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: colors.begeCard,
  },
  botaoAlterar: {
    alignSelf: 'flex-start',
  },
  produtorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.branco,
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.linha,
  },
  produtorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.terracota,
    alignItems: 'center',
    justifyContent: 'center',
  },
  produtorDados: {
    flex: 1,
  },
  produtorNome: {
    fontFamily: fontFamilies.corpoMedium,
    fontSize: fontSizes.md,
    color: colors.grafite,
  },
  produtorTelefone: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xs,
    color: colors.cinzaNeutro,
  },
  botaoFinalizar: {
    marginTop: spacing.md,
  },
});
