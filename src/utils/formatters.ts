export function formatarCoordenada(valor: number | null | undefined): string {
  if (!Number.isFinite(valor as number)) return '---';
  return (valor as number).toFixed(6);
}

export function formatarPrecisaoMetros(accuracy: number | null | undefined): string {
  if (accuracy == null || !Number.isFinite(accuracy)) return 's/ precisão';
  return `${Math.round(accuracy)}m`;
}

export function formatarMagnitude(g: number): string {
  return `${g.toFixed(2)}g`;
}

export function formatarDataHora(ts: number): string {
  return new Date(ts).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function gerarProtocolo(data = new Date()): string {
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  const hh = String(data.getHours()).padStart(2, '0');
  const mm = String(data.getMinutes()).padStart(2, '0');
  const ss = String(data.getSeconds()).padStart(2, '0');
  return `AV-${y}${m}${d}-${hh}${mm}${ss}`;
}
