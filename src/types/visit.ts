export interface GpsCaptura {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  timestamp: number;
}

export interface ProdutorVinculado {
  contatoId: string;
  nome: string;
  telefone: string | null;
}

export interface AuditoriaVisita {
  id: string;
  protocolo: string;
  gps: GpsCaptura | null;
  fotoUri: string | null;
  produtor: ProdutorVinculado | null;
  observacoes: string;
  criadaEm: number;
  concluidaEm: number;
  instabilidadeDetectada: boolean;
}
