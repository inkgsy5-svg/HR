import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MerchHomeScreen from './screens/MerchHomeScreen';

const Stack = createStackNavigator();

export default function MerchNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MerchHome" component={MerchHomeScreen} />
    </Stack.Navigator>
  );
}
