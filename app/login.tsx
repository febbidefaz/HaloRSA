import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const redirectUri = useMemo(() => {
    return makeRedirectUri({
      native:
        'com.googleusercontent.apps.656827986979-102opc80tg1958j8budbc0t6ca0m6sgf:/oauthredirect',
    });
  }, []);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      '656827986979-102opc80tg1958j8budbc0t6ca0m6sgf.apps.googleusercontent.com',
    webClientId:
      '656827986979-7mjtlsog99mnnlciubtmmtjmudnbd34l.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    redirectUri,
  });

  useEffect(() => {
    console.log('redirectUri =', redirectUri);
    console.log('response =', JSON.stringify(response, null, 2));

    const signInWithGoogle = async () => {
      if (!response) return;

      if (response.type !== 'success') {
        if (response.type === 'error') {
          Alert.alert(
            'Google Error',
            JSON.stringify(response.error ?? {}, null, 2)
          );
        }
        return;
      }

      try {
        setLoading(true);

        const accessToken = response.authentication?.accessToken;

        if (!accessToken) {
          throw new Error('Access token Google tidak ditemukan');
        }

        const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const profile = await res.json();

        await SecureStore.setItemAsync('google_id', String(profile.id || ''));
        await SecureStore.setItemAsync('google_name', profile.name || '');
        await SecureStore.setItemAsync('google_email', profile.email || '');
        await SecureStore.setItemAsync('google_photo', profile.picture || '');

        router.replace('/home');
      } catch (err: any) {
        Alert.alert('Login gagal', err.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    signInWithGoogle();
  }, [response, redirectUri]);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
        }}
        style={styles.logo}
      />

      <Text style={styles.title}>Masuk dengan Google</Text>
      <Text style={styles.subtitle}>Gunakan akun Google untuk melanjutkan</Text>

      <TouchableOpacity
        style={styles.button}
        disabled={!request || loading}
        onPress={() => promptAsync()}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login dengan Google</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0A6A74',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    minWidth: 220,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});