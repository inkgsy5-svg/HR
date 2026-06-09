import { View } from 'react-native';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MerchCategory } from '../data/categories';

type Props = {
  category: MerchCategory;
  selected: boolean;
  onPress: () => void;
};

export default function MerchCategoryCircle({ category, selected, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.circle, selected && styles.circleActive]}>
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>
      <Text style={[styles.label, selected && styles.labelActive]}>{category.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', marginHorizontal: 8 },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  circleActive: { borderColor: '#C9A84C' },
  emoji: { fontSize: 26 },
  label: { fontSize: 11, color: '#888', textAlign: 'center' },
  labelActive: { color: '#C9A84C', fontWeight: '600' },
});
