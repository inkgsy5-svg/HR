import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SmokeShopStackParamList } from '@app/navigation/types';
import SmokeShopHomeScreen from './screens/SmokeShopHomeScreen';

const Stack = createStackNavigator<SmokeShopStackParamList>();

export default function SmokeShopNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SmokeShopHome" component={SmokeShopHomeScreen} />
      {/* TODO: Agregar ProductList, ProductDetail, Cart */}
    </Stack.Navigator>
  );
}
