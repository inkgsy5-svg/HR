import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ResinStackParamList } from '@app/navigation/types';
import ResinHomeScreen from './screens/ResinHomeScreen';

const Stack = createStackNavigator<ResinStackParamList>();

export default function ResinNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ResinHome" component={ResinHomeScreen} />
      {/* TODO: Agregar ResinGallery, ResinDetail, ResinOrder */}
    </Stack.Navigator>
  );
}
