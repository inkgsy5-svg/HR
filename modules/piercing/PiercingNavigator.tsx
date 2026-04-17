import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PiercingStackParamList } from '@app/navigation/types';
import PiercingHomeScreen from './screens/PiercingHomeScreen';

const Stack = createStackNavigator<PiercingStackParamList>();

export default function PiercingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PiercingHome" component={PiercingHomeScreen} />
      {/* TODO: Agregar PiercingGallery, PiercingBooking */}
    </Stack.Navigator>
  );
}
