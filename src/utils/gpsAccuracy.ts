export type PrecisaoGps = 'alta' | 'media' | 'baixa' | 'indisponivel';

export function classificarPrecisaoGps(accuracy: number | null | undefined): PrecisaoGps {
  if (accuracy == null || !Number.isFinite(accuracy) || accuracy < 0) return 'indisponivel';
  if (accuracy < 10) return 'alta';
  if (accuracy <= 30) return 'media';
  return 'baixa';
}

export const ROTULO_PRECISAO: Record<PrecisaoGps, string> = {
  alta: 'Alta precisão',
  media: 'Média precisão',
  baixa: 'Baixa precisão',
  indisponivel: 'Indisponível',
};
