import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Directory, Paths } from 'expo-file-system';
import type { AuditoriaVisita } from '../types/visit';

const STORAGE_KEY = 'agrovisita:visitas:v1';

export async function salvarVisita(visita: AuditoriaVisita): Promise<void> {
  const existentes = await listarVisitas();
  existentes.unshift(visita);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existentes));
}

export async function listarVisitas(): Promise<AuditoriaVisita[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function removerVisita(id: string): Promise<void> {
  const existentes = await listarVisitas();
  const filtradas = existentes.filter(v => v.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtradas));
}

export async function persistirFoto(caminhoCache: string): Promise<string> {
  const origem = new File(caminhoCache);
  const diretorio = new Directory(Paths.document, 'auditorias');
  if (!diretorio.exists) {
    diretorio.create({ intermediates: true });
  }
  const destino = new File(diretorio, origem.name);
  await origem.copy(destino);
  return destino.uri;
}