import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { colors, fontFamilies, fontSizes, spacing } from '../theme';
import StatusCard from '../components/StatusCard';
import SensorReadout from '../components/SensorReadout';
import { EstadoIndisponivel } from '../components/EstadosUI';
import { magnitude3d } from '../utils/sensorMath';
import { formatarMagnitude } from '../utils/formatters';

export default function ModuloSensoresScreen() {
  const [acelDisponivel, setAcelDisponivel] = useState<boolean | null>(null);
  const [giroDisponivel, setGiroDisponivel] = useState<boolean | null>(null);
  const [acel, setAcel] = useState({ x: 0, y: 0, z: 0 });
  const [giro, setGiro] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    let acelSub: ReturnType<typeof Accelerometer.addListener> | null = null;
    let giroSub: ReturnType<typeof Gyroscope.addListener> | null = null;
    let mounted = true;

    Accelerometer.isAvailableAsync().then(available => {
      if (!mounted) return;
      setAcelDisponivel(available);
      if (available) {
        Accelerometer.setUpdateInterval(150);
        acelSub = Accelerometer.addListener(data => {
          if (mounted) setAcel(data);
        });
      }
    });

    Gyroscope.isAvailableAsync().then(available => {
      if (!mounted) return;
      setGiroDisponivel(available);
      if (available) {
        Gyroscope.setUpdateInterval(150);
        giroSub = Gyroscope.addListener(data => {
          if (mounted) setGiro(data);
        });
      }
    });

    return () => {
      mounted = false;
      if (acelSub) acelSub.remove();
      if (giroSub) giroSub.remove();
    };
  }, []);

  const nenhumDisponivel = acelDisponivel === false && giroDisponivel === false;
  const verificando = acelDisponivel === null || giroDisponivel === null;

  if (verificando) {
    return (
      <View style={styles.centro}>
        <Text style={styles.textoCentro}>Verificando sensores...</Text>
      </View>
    );
  }

  if (nenhumDisponivel) {
    return (
      <View style={styles.container}>
        <EstadoIndisponivel mensagem="Acelerômetro e giroscópio não disponíveis neste dispositivo." />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      {acelDisponivel && (
        <StatusCard
          titulo="Acelerômetro"
          icone="speedometer-outline"
          corBorda={colors.amareloCampo}
        >
          <SensorReadout label="Eixo X" valor={`${acel.x.toFixed(3)}g`} />
          <SensorReadout label="Eixo Y" valor={`${acel.y.toFixed(3)}g`} />
          <SensorReadout label="Eixo Z" valor={`${acel.z.toFixed(3)}g`} />
          <SensorReadout label="Magnitude" valor={formatarMagnitude(magnitude3d(acel.x, acel.y, acel.z))} />
        </StatusCard>
      )}

      {giroDisponivel && (
        <StatusCard
          titulo="Giroscópio"
          icone="speedometer-outline"
          corBorda={colors.verdeSinal}
        >
          <SensorReadout label="Eixo X" valor={`${giro.x.toFixed(3)}°/s`} />
          <SensorReadout label="Eixo Y" valor={`${giro.y.toFixed(3)}°/s`} />
          <SensorReadout label="Eixo Z" valor={`${giro.z.toFixed(3)}°/s`} />
        </StatusCard>
      )}

      {acelDisponivel === false && giroDisponivel && (
        <Text style={styles.aviso}>Acelerômetro indisponível. Exibindo apenas giroscópio.</Text>
      )}
      {giroDisponivel === false && acelDisponivel && (
        <Text style={styles.aviso}>Giroscópio indisponível. Exibindo apenas acelerômetro.</Text>
      )}
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
    gap: spacing.md,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoCentro: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.md,
    color: colors.cinzaNeutro,
  },
  aviso: {
    fontFamily: fontFamilies.corpo,
    fontSize: fontSizes.sm,
    color: colors.terracota,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
