import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@app/theme/colors';
import { typography } from '@app/theme/typography';
import { Piercer } from '../data/piercers';

type Props = {
  piercer: Piercer;
  onPress: (piercer: Piercer) => void;
};

export default function PiercerCircle({ piercer, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={() => onPress(piercer)}>
      <View style={styles.ring}>
        <Image source={piercer.image} style={styles.image} resizeMode="cover" />
      </View>
      <Text style={styles.name}>{piercer.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 6 },
  ring: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2.5,
    borderColor: colors.accent,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  name: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
});
