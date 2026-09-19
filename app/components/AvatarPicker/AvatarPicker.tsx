import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@app/theme/colors';

interface AvatarPickerProps {
  uri?: string;
  onChange: (uri: string) => void;
  size?: number;
}

const PICK_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.6,
};

/**
 * Selector de foto de perfil circular. Guarda solo el URI local del
 * archivo (ver AuthState.user.avatar) — cuando exista backend real, aquí
 * es donde se sube el archivo (S3 / similar) y se guarda la URL remota.
 */
export default function AvatarPicker({ uri, onChange, size = 96 }: AvatarPickerProps) {
  async function pickFromLibrary() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Activa el acceso a tus fotos para elegir una imagen.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync(PICK_OPTIONS);
    if (!result.canceled && result.assets[0]) onChange(result.assets[0].uri);
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Activa el acceso a la cámara para tomar una foto.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync(PICK_OPTIONS);
    if (!result.canceled && result.assets[0]) onChange(result.assets[0].uri);
  }

  function handlePress() {
    Alert.alert('Foto de perfil', undefined, [
      { text: 'Tomar foto', onPress: takePhoto },
      { text: 'Elegir de galería', onPress: pickFromLibrary },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  return (
    <TouchableOpacity
      style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      {uri ? (
        <Image source={{ uri }} style={[styles.image, { borderRadius: size / 2 }]} />
      ) : (
        <View style={[styles.placeholder, { borderRadius: size / 2 }]}>
          <MaterialCommunityIcons name="account" size={size * 0.55} color={colors.textMuted} />
        </View>
      )}
      <View style={styles.badge}>
        <MaterialCommunityIcons name="camera" size={14} color={colors.textOnAccent} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  image: { width: '100%', height: '100%' },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
});
