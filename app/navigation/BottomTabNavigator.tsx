import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabParamList } from './types';
import { colors } from '@app/theme/colors';
import { typography } from '@app/theme/typography';
import HomeScreen from '@modules/home/screens/HomeScreen';
import ProfileScreen from '@modules/profile/screens/ProfileScreen';
import SearchScreen from '@modules/search/screens/SearchScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

type TabConfig = {
  name: keyof BottomTabParamList;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
};

const TABS: TabConfig[] = [
  { name: 'Profile', label: 'Perfil', icon: 'person-outline', iconActive: 'person' },
  { name: 'Home', label: 'Inicio', icon: 'home-outline', iconActive: 'home' },
  { name: 'Search', label: 'Menú', icon: 'menu-outline', iconActive: 'menu' },
];

function TabItem({
  tab,
  focused,
  onPress,
}: {
  tab: TabConfig;
  focused: boolean;
  onPress: () => void;
}) {
  const [anim] = useState(() => new Animated.Value(focused ? 1 : 0));

  useEffect(() => {
    Animated.timing(anim, {
      toValue: focused ? 1 : 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [focused, anim]);

  const pillWidth = anim.interpolate({ inputRange: [0, 1], outputRange: [42, 118] });
  const pillOp = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const labelOp = anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 0, 1] });
  const labelW = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 60] });
  const iconColor = focused ? '#FFFFFF' : 'rgba(255,255,255,0.45)';

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity style={styles.tabSlot} onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={[styles.pill, { width: pillWidth }]}>
        {/* Fondo oscuro de la pill */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.pillBg, { opacity: pillOp }]} />

        <Ionicons name={focused ? tab.iconActive : tab.icon} size={20} color={iconColor} />

        <Animated.View style={{ width: labelW, overflow: 'hidden', opacity: labelOp }}>
          <Text style={styles.label} numberOfLines={1}>
            {tab.label}
          </Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { bottom: insets.bottom + 16 }]}>
      {TABS.map((tab, index) => (
        <TabItem
          key={tab.name}
          tab={tab}
          focused={state.index === index}
          onPress={() => navigation.navigate(tab.name)}
        />
      ))}
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
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(22,22,22,0.88)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 14,
  },
  tabSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  pill: {
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  pillBg: {
    borderRadius: 20,
    backgroundColor: colors.gold,
  },
  label: {
    color: '#111111',
    fontSize: typography.fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
