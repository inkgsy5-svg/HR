import React from 'react';
import { StyleSheet } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { spacing, borderRadius } from '@app/theme/spacing';

interface AppleButtonProps {
  onPress: () => void;
}

// Apple exige usar su propio botón oficial (no uno custom) para cumplir
// con las Human Interface Guidelines de "Sign in with Apple".
export default function AppleButton({ onPress }: AppleButtonProps) {
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
      cornerRadius={borderRadius.md}
      style={styles.button}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
    marginTop: spacing.sm,
  },
});
