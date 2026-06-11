import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ResinStackParamList } from '@app/navigation/types';
import ResinHomeScreen from './screens/ResinHomeScreen';
import ResinDetailScreen from './screens/ResinDetailScreen';

const Stack = createNativeStackNavigator<ResinStackParamList>();

export default function ResinNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="ResinHome" component={ResinHomeScreen} />
      <Stack.Screen name="ResinDetail" component={ResinDetailScreen} />
    </Stack.Navigator>
  );
}
