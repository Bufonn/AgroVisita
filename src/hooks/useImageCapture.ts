import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

export function useImageCapture() {
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const capturarFoto = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets[0]) {
        setFotoUri(result.assets[0].uri);
        return result.assets[0].uri;
      }
      return null;
    } catch {
      setErro('Erro ao capturar foto');
      return null;
    } finally {
      setCarregando(false);
    }
  }, []);

  const escolherGaleria = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets[0]) {
        setFotoUri(result.assets[0].uri);
        return result.assets[0].uri;
      }
      return null;
    } catch {
      setErro('Erro ao selecionar imagem da galeria');
      return null;
    } finally {
      setCarregando(false);
    }
  }, []);

  const limpar = useCallback(() => {
    setFotoUri(null);
    setErro(null);
  }, []);

  return { fotoUri, carregando, erro, capturarFoto, escolherGaleria, limpar, setFotoUri };
}
