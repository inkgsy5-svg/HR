import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabParamList } from './types';
import HomeScreen from '@modules/home/screens/HomeScreen';
import ProfileScreen from '@modules/profile/screens/ProfileScreen';
import SearchScreen from '@modules/search/screens/SearchScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

function IconPerfil({ color }: { color: string }) {
  return (
    <View style={styles.iconWrap}>
      <View style={[styles.personHead, { backgroundColor: color }]} />
      <View style={[styles.personBody, { backgroundColor: color }]} />
    </View>
  );
}

function IconInicio({ color }: { color: string }) {
  return (
    <View style={styles.iconWrap}>
      <View style={[styles.roof, { borderBottomColor: color }]} />
      <View style={[styles.houseBody, { backgroundColor: color }]} />
    </View>
  );
}

function IconMenu({ color }: { color: string }) {
  return (
    <View style={styles.iconWrap}>
      <View style={[styles.line, { backgroundColor: color }]} />
      <View style={[styles.line, { backgroundColor: color }]} />
      <View style={[styles.line, { backgroundColor: color }]} />
    </View>
  );
}

const TABS = [
  { name: 'Profile', label: 'Perfil', Icon: IconPerfil },
  { name: 'Home', label: 'Inicio', Icon: IconInicio },
  { name: 'Search', label: 'Menú', Icon: IconMenu },
] as const;

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { bottom: insets.bottom + 12 }]}>
      {TABS.map((tab, index) => {
        const focused = state.index === index;
        const color = focused ? '#FFFFFF' : 'rgba(255,255,255,0.45)';

        return (
          <React.Fragment key={tab.name}>
            {index > 0 && <View style={styles.separator} />}
            <TouchableOpacity
              style={styles.tabItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(tab.name)}
            >
              <tab.Icon color={color} />
              <Text style={[styles.label, { color }]}>{tab.label}</Text>
            </TouchableOpacity>
          </React.Fragment>
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
    height: 68,
    borderRadius: 34,
    backgroundColor: '#111111',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  separator: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  label: {
    fontSize: 11,
    fontWeight: '400',
  },
  // Iconos
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  personHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  personBody: {
    width: 16,
    height: 9,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  roof: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  houseBody: {
    width: 14,
    height: 9,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  line: {
    width: 20,
    height: 2.5,
    borderRadius: 2,
  },
});
