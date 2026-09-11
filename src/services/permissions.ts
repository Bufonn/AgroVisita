import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';

export interface ResultadoPermissao {
  concedida: boolean;
  podePerguntarNovamente: boolean;
  erro?: string;
}

export async function solicitarPermissaoCamera(): Promise<ResultadoPermissao> {
  try {
    const result = await ImagePicker.requestCameraPermissionsAsync();
    return { concedida: result.granted, podePerguntarNovamente: result.canAskAgain };
  } catch {
    return { concedida: false, podePerguntarNovamente: false, erro: 'Erro ao solicitar permissão de câmera' };
  }
}

export async function solicitarPermissaoGaleria(): Promise<ResultadoPermissao> {
  try {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return { concedida: result.granted, podePerguntarNovamente: result.canAskAgain };
  } catch {
    return { concedida: false, podePerguntarNovamente: false, erro: 'Erro ao solicitar permissão de galeria' };
  }
}

export async function solicitarPermissaoLocalizacao(): Promise<ResultadoPermissao> {
  try {
    const result = await Location.requestForegroundPermissionsAsync();
    return { concedida: result.granted, podePerguntarNovamente: result.canAskAgain };
  } catch {
    return { concedida: false, podePerguntarNovamente: false, erro: 'Erro ao solicitar permissão de localização' };
  }
}

export async function solicitarPermissaoContatos(): Promise<ResultadoPermissao> {
  try {
    const result = await Contacts.requestPermissionsAsync();
    return { concedida: result.granted, podePerguntarNovamente: result.canAskAgain };
  } catch {
    return { concedida: false, podePerguntarNovamente: false, erro: 'Erro ao solicitar permissão de contatos' };
  }
}
