import { useState, useCallback, useRef, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';
import { magnitude3d, LIMIAR_INSTABILIDADE_G } from '../utils/sensorMath';

export function useAccelerometerGuard() {
  const [disponivel, setDisponivel] = useState(true);
  const [instavel, setInstavel] = useState(false);
  const monitorandoRef = useRef(false);
  const instavelRef = useRef(false);
  const listenerRef = useRef<ReturnType<typeof Accelerometer.addListener> | null>(null);

  useEffect(() => {
    let mounted = true;
    Accelerometer.isAvailableAsync()
      .then(available => {
        if (mounted) setDisponivel(available);
      })
      .catch(() => {
        if (mounted) setDisponivel(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const iniciarMonitoramento = useCallback(() => {
    if (!disponivel) return;
    instavelRef.current = false;
    setInstavel(false);
    monitorandoRef.current = true;
    Accelerometer.setUpdateInterval(150);
    listenerRef.current = Accelerometer.addListener(data => {
      if (!monitorandoRef.current) return;
      const mag = magnitude3d(data.x, data.y, data.z);
      if (mag > LIMIAR_INSTABILIDADE_G) {
        instavelRef.current = true;
        setInstavel(true);
      }
    });
  }, [disponivel]);

  const pararMonitoramento = useCallback(() => {
    monitorandoRef.current = false;
    if (listenerRef.current) {
      listenerRef.current.remove();
      listenerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      pararMonitoramento();
    };
  }, [pararMonitoramento]);

  const verificarEstabilidadeDuracao = useCallback(
    async (duracaoMs: number): Promise<boolean> => {
      if (!disponivel) return true;
      instavelRef.current = false;
      setInstavel(false);
      iniciarMonitoramento();
      await new Promise(resolve => setTimeout(resolve, duracaoMs));
      pararMonitoramento();
      return !instavelRef.current;
    },
    [disponivel, iniciarMonitoramento, pararMonitoramento]
  );

  return { disponivel, instavel, iniciarMonitoramento, pararMonitoramento, verificarEstabilidadeDuracao };
}