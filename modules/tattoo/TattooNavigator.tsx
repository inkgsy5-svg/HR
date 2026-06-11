import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TattooStackParamList } from '@app/navigation/types';
import TattooHomeScreen from './screens/TattooHomeScreen';
import TattooDetailScreen from './screens/TattooDetailScreen';

const Stack = createNativeStackNavigator<TattooStackParamList>();

export default function TattooNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="TattooHome" component={TattooHomeScreen} />
      <Stack.Screen name="TattooDetail" component={TattooDetailScreen} />
    </Stack.Navigator>
  );
}
