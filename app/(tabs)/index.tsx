import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function IndexRedirect() {
  useEffect(() => {
    const checkLogin = async () => {
      const googleId = await SecureStore.getItemAsync('google_id');

      if (googleId) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    };

    checkLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}