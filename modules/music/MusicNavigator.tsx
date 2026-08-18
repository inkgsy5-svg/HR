import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MusicStackParamList } from '@app/navigation/types';
import MusicHomeScreen from './screens/MusicHomeScreen';
import MusicDetailScreen from './screens/MusicDetailScreen';

const Stack = createNativeStackNavigator<MusicStackParamList>();

export default function MusicNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="MusicHome" component={MusicHomeScreen} />
      <Stack.Screen name="MusicDetail" component={MusicDetailScreen} />
    </Stack.Navigator>
  );
}
