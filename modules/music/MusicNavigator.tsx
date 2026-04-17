import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MusicStackParamList } from '@app/navigation/types';
import MusicHomeScreen from './screens/MusicHomeScreen';

const Stack = createStackNavigator<MusicStackParamList>();

export default function MusicNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MusicHome" component={MusicHomeScreen} />
      {/* TODO: Agregar EventList, EventDetail */}
    </Stack.Navigator>
  );
}
