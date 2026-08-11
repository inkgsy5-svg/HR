import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabParamList } from './types';
import { colors } from '@app/theme/colors';
import { typography } from '@app/theme/typography';
import HomeScreen from '@modules/home/screens/HomeScreen';
import ProfileScreen from '@modules/profile/screens/ProfileScreen';
import SearchScreen from '@modules/search/screens/SearchScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TABS = [
  { name: 'Profile', label: 'Perfil', iconActive: 'account', iconInactive: 'account-outline' },
  { name: 'Home', label: 'Inicio', iconActive: 'home', iconInactive: 'home-outline' },
  { name: 'Search', label: 'Menú', iconActive: 'view-grid', iconInactive: 'view-grid-outline' },
] as const;

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { bottom: insets.bottom + 12 }]}>
      {TABS.map((tab, index) => {
        const focused = state.index === index;

        return (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tabItem, focused && styles.tabItemActive]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(tab.name)}
          >
            <MaterialCommunityIcons
              name={focused ? tab.iconActive : tab.iconInactive}
              size={22}
              color={focused ? colors.textOnAccent : colors.tabIconInactive}
            />
            {focused && <Text style={styles.activeLabel}>{tab.label}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.tabBackgroundTranslucent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minWidth: 44,
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 22,
  },
  tabItemActive: {
    backgroundColor: colors.gold,
    paddingHorizontal: 16,
  },
  activeLabel: {
    color: colors.textOnAccent,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
