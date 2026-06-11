import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SmokeShopStackParamList } from '@app/navigation/types';
import SmokeShopHomeScreen from './screens/SmokeShopHomeScreen';
import SmokeShopDetailScreen from './screens/SmokeShopDetailScreen';

const Stack = createNativeStackNavigator<SmokeShopStackParamList>();

export default function SmokeShopNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="SmokeShopHome" component={SmokeShopHomeScreen} />
      <Stack.Screen name="SmokeShopDetail" component={SmokeShopDetailScreen} />
    </Stack.Navigator>
  );
}
