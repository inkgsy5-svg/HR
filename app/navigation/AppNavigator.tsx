import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppStackParamList } from './types';
import BottomTabNavigator from './BottomTabNavigator';

// Module Navigators (cada dev implementa el suyo)
import TattooNavigator from '@modules/tattoo/TattooNavigator';
import BarberNavigator from '@modules/barber/BarberNavigator';
import SmokeShopNavigator from '@modules/smoke-shop/SmokeShopNavigator';
import MusicNavigator from '@modules/music/MusicNavigator';
import PiercingNavigator from '@modules/piercing/PiercingNavigator';
import ResinNavigator from '@modules/resin/ResinNavigator';

const Stack = createStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="Tattoo" component={TattooNavigator} />
      <Stack.Screen name="Barber" component={BarberNavigator} />
      <Stack.Screen name="SmokeShop" component={SmokeShopNavigator} />
      <Stack.Screen name="Music" component={MusicNavigator} />
      <Stack.Screen name="Piercing" component={PiercingNavigator} />
      <Stack.Screen name="Resin" component={ResinNavigator} />
    </Stack.Navigator>
  );
}
