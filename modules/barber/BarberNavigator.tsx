import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BarberStackParamList } from '@app/navigation/types';
import BarberHomeScreen from './screens/BarberHomeScreen';

const Stack = createStackNavigator<BarberStackParamList>();

export default function BarberNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BarberHome" component={BarberHomeScreen} />
      {/* TODO: Dev 2 - Agregar BarberServices, BarberDetail, BarberBooking */}
    </Stack.Navigator>
  );
}
