import React from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  image: number | { uri: string } | null;
  onClose: () => void;
}

export default function ImageLightbox({ visible, image, onClose }: Props) {
  const insets = useSafeAreaInsets();

  if (!image) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <StatusBar hidden />
      <View style={styles.overlay}>
        {/* Botón cerrar */}
        <TouchableOpacity
          style={[styles.closeBtn, { top: insets.top + 12 }]}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <View style={styles.closeBtnInner}>
            <View style={[styles.closeLine, styles.closeLineLeft]} />
            <View style={[styles.closeLine, styles.closeLineRight]} />
          </View>
        </TouchableOpacity>

        {/* Imagen grande */}
        <TouchableOpacity style={styles.imageWrap} activeOpacity={1} onPress={onClose}>
          <Image source={image} style={styles.image} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  closeBtnInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLine: {
    position: 'absolute',
    width: 18,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  closeLineLeft: { transform: [{ rotate: '45deg' }] },
  closeLineRight: { transform: [{ rotate: '-45deg' }] },
  imageWrap: {
    width,
    height: height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height * 0.75,
  },
});
