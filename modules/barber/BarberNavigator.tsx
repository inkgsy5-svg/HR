import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BarberStackParamList } from '@app/navigation/types';
import BarberHomeScreen from './screens/BarberHomeScreen';
import BarberDetailScreen from './screens/BarberDetailScreen';
import BarberBookingScreen from './screens/BarberBookingScreen';
import BarberReviewsScreen from './screens/BarberReviewsScreen';
import BarberConfirmScreen from './screens/BarberConfirmScreen';

const Stack = createNativeStackNavigator<BarberStackParamList>();

export default function BarberNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="BarberHome" component={BarberHomeScreen} />
      <Stack.Screen name="BarberDetail" component={BarberDetailScreen} />
      <Stack.Screen name="BarberBooking" component={BarberBookingScreen} />
      <Stack.Screen name="BarberReviews" component={BarberReviewsScreen} />
      <Stack.Screen
        name="BarberConfirm"
        component={BarberConfirmScreen}
        options={{ presentation: 'modal', gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
