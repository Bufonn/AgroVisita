import { useState, useCallback, useRef, useEffect } from 'react';
import * as Location from 'expo-location';
import type { GpsCaptura } from '../types/visit';

export function useLocation() {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [captura, setCaptura] = useState<GpsCaptura | null>(null);
  const [servicosAtivos, setServicosAtivos] = useState<boolean | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  const verificarServicos = useCallback(async () => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      if (mountedRef.current) setServicosAtivos(enabled);
      return enabled;
    } catch {
      if (mountedRef.current) setServicosAtivos(false);
      return false;
    }
  }, []);

  const capturarCoordenadas = useCallback(async (): Promise<GpsCaptura | null> => {
    setCarregando(true);
    setErro(null);
    try {
      const servicesOn = await verificarServicos();
      if (!servicesOn) {
        throw new Error('Serviços de localização desativados');
      }
      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const captura: GpsCaptura = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
        accuracy: result.coords.accuracy ?? 0,
        altitude: result.coords.altitude,
        timestamp: result.timestamp,
      };
      if (mountedRef.current) setCaptura(captura);
      return captura;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao obter localização';
      if (mountedRef.current) setErro(msg);
      return null;
    } finally {
      if (mountedRef.current) setCarregando(false);
    }
  }, [verificarServicos]);

  return { carregando, erro, captura, servicosAtivos, capturarCoordenadas, verificarServicos, setCaptura };
}
