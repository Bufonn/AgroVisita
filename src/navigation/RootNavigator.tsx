import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import type { RootStackParamList } from './types';
import { colors } from '../theme';
import { fontFamilies, fontSizes } from '../theme';
import MenuScreen from '../screens/MenuScreen';
import ModuloCameraScreen from '../screens/ModuloCameraScreen';
import ModuloContatosScreen from '../screens/ModuloContatosScreen';
import ModuloGpsScreen from '../screens/ModuloGpsScreen';
import ModuloSensoresScreen from '../screens/ModuloSensoresScreen';
import RegistroVisitaScreen from '../screens/RegistroVisitaScreen';
import HistoricoVisitasScreen from '../screens/HistoricoVisitasScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.verdeTerra },
            headerTintColor: colors.begePapel,
            headerTitleStyle: {
              fontFamily: fontFamilies.titulo,
              fontSize: fontSizes.lg,
            },
            contentStyle: { backgroundColor: colors.begePapel },
          }}
        >
          <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Camera"
            component={ModuloCameraScreen}
            options={{ title: 'Câmera e Galeria' }}
          />
          <Stack.Screen
            name="Contatos"
            component={ModuloContatosScreen}
            options={{ title: 'Contatos' }}
          />
          <Stack.Screen
            name="Gps"
            component={ModuloGpsScreen}
            options={{ title: 'GPS' }}
          />
          <Stack.Screen
            name="Sensores"
            component={ModuloSensoresScreen}
            options={{ title: 'Sensores' }}
          />
          <Stack.Screen
            name="RegistroVisita"
            component={RegistroVisitaScreen}
            options={{ title: 'Nova Auditoria' }}
          />
          <Stack.Screen
            name="HistoricoVisitas"
            component={HistoricoVisitasScreen}
            options={{ title: 'Histórico de Visitas' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
