import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from './types';
import { colors } from '@app/theme/colors';
import HomeScreen from '@modules/home/screens/HomeScreen';
import SearchScreen from '@modules/search/screens/SearchScreen';
import PromosScreen from '@modules/promos/screens/PromosScreen';
import ProfileScreen from '@modules/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: 'Buscar' }} />
      <Tab.Screen name="Promos" component={PromosScreen} options={{ tabBarLabel: 'Promos' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}
