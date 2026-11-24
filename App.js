import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import ListaScreen from './src/screens/ListaScreen';
import FormScreen from './src/screens/FormScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#4f46e5' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen name="Lista" component={ListaScreen} options={{ title: 'Minha Biblioteca' }} />
        <Stack.Screen name="Form" component={FormScreen} options={{ title: 'Livro' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
