import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PiercingStackParamList } from '@app/navigation/types';
import PiercingHomeScreen from './screens/PiercingHomeScreen';
import PiercingDetailScreen from './screens/PiercingDetailScreen';

const Stack = createNativeStackNavigator<PiercingStackParamList>();

export default function PiercingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="PiercingHome" component={PiercingHomeScreen} />
      <Stack.Screen name="PiercingDetail" component={PiercingDetailScreen} />
    </Stack.Navigator>
  );
}
