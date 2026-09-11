import type { GpsCaptura, ProdutorVinculado } from '../types/visit';

export function isNumeroValido(v: unknown): boolean {
  return typeof v === 'number' && Number.isFinite(v);
}

export function dadosFaltantesParaFinalizar(
  gps: GpsCaptura | null | undefined,
  fotoUri: string | null | undefined,
  produtor: ProdutorVinculado | null | undefined
): string[] {
  const faltando: string[] = [];
  if (!gps || !isNumeroValido(gps.latitude) || !isNumeroValido(gps.longitude)) {
    faltando.push('Geolocalização');
  }
  if (!fotoUri || typeof fotoUri !== 'string' || fotoUri.length === 0) {
    faltando.push('Evidência fotográfica');
  }
  if (!produtor || typeof produtor.contatoId !== 'string' || produtor.contatoId.length === 0) {
    faltando.push('Produtor/representante');
  }
  return faltando;
}
