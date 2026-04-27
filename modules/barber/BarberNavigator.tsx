import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BarberStackParamList } from '@app/navigation/types';
import BarberHomeScreen from './screens/BarberHomeScreen';
import BarberDetailScreen from './screens/BarberDetailScreen';
import BarberBookingScreen from './screens/BarberBookingScreen';
import BarberReviewsScreen from './screens/BarberReviewsScreen';

const Stack = createStackNavigator<BarberStackParamList>();

export default function BarberNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BarberHome" component={BarberHomeScreen} />
      <Stack.Screen name="BarberDetail" component={BarberDetailScreen} />
      <Stack.Screen name="BarberBooking" component={BarberBookingScreen} />
      <Stack.Screen name="BarberReviews" component={BarberReviewsScreen} />
    </Stack.Navigator>
  );
}
