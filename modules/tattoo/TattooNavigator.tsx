import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TattooStackParamList } from '@app/navigation/types';
import TattooHomeScreen from './screens/TattooHomeScreen';

const Stack = createStackNavigator<TattooStackParamList>();

export default function TattooNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TattooHome" component={TattooHomeScreen} />
      {/* TODO: Dev 1 - Agregar TattooGallery, TattooDetail, TattooBooking */}
    </Stack.Navigator>
  );
}
