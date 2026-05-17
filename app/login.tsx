import { subscribeHaloRSATopic } from "@/utils/fcmTopic";
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
        "com.googleusercontent.apps.656827986979-102opc80tg1958j8budbc0t6ca0m6sgf:/oauthredirect",
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
  console.log("LOGIN RESPONSE:", response);

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
        await subscribeHaloRSATopic();

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
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />
  
      <View style={styles.card}>
    

        <Image
          source={require("../assets/images/logorsa.png")}
          style={styles.rsLogo}
        />
  
        <Text style={styles.rsTitle}>
          RS 'Aisyiyah Bojonegoro
        </Text>
  
        <Text style={styles.rsSubtitle}>
          Cepat Menangani, Ramah Melayani, Dengan Islami
        </Text>
  
        <View style={styles.divider} />
  
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
          }}
          style={styles.googleLogo}
        />
        
  
        <Text style={styles.title}>
          Masuk dengan Google
        </Text>
  
        <Text style={styles.subtitle}>
          Gunakan akun Google Anda untuk
          melanjutkan ke HaloRSA
        </Text>
  
        <TouchableOpacity
          style={[
            styles.button,
            loading && { opacity: 0.7 },
          ]}
          disabled={!request || loading}
          onPress={() =>
            promptAsync()
          }
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
                }}
                style={styles.buttonIcon}
              />
  
              <Text style={styles.buttonText}>
                Login dengan Google
              </Text>
            </>
          )}
        </TouchableOpacity>
  
        <Text style={styles.footer}>
          © RS 'Aisyiyah Bojonegoro
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#EEF5F5",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
  
    topCircle: {
      position: "absolute",
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: "#0A7C8615",
      top: -80,
      right: -70,
    },
  
    bottomCircle: {
      position: "absolute",
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: "#0A7C8610",
      bottom: -60,
      left: -50,
    },
  
    card: {
      width: "100%",
      backgroundColor: "#fff",
      borderRadius: 28,
      paddingHorizontal: 26,
      paddingVertical: 34,
      alignItems: "center",
  
      elevation: 8,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: {
        width: 0,
        height: 4,
      },
    },
  
    rsLogo: {
      width: 90,
      height: 90,
      resizeMode: "contain",
      marginBottom: 14,
    },
  
    rsTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: "#0A6A74",
      textAlign: "center",
    },
  
    rsSubtitle: {
      fontSize: 13,
      color: "#666",
      textAlign: "center",
      marginTop: 6,
      lineHeight: 20,
    },
  
    divider: {
      width: "100%",
      height: 1,
      backgroundColor: "#E7ECEC",
      marginVertical: 24,
    },
  
    googleLogo: {
      width: 58,
      height: 58,
      marginBottom: 16,
    },
  
    title: {
      fontSize: 24,
      fontWeight: "800",
      color: "#1A2B2E",
    },
  
    subtitle: {
      fontSize: 14,
      color: "#667",
      marginTop: 8,
      marginBottom: 28,
      textAlign: "center",
      lineHeight: 22,
    },
  
    button: {
      width: "100%",
      height: 56,
      backgroundColor: "#0A7C86",
      borderRadius: 16,
  
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
  
      elevation: 4,
    },
  
    buttonIcon: {
      width: 22,
      height: 22,
      marginRight: 10,
    },
  
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "800",
    },
  
    footer: {
      marginTop: 26,
      fontSize: 12,
      color: "#8A9A9C",
    },  
  heroImage: {
  width: "50%",
  height: 90,
  borderRadius: 22,
  marginBottom: 22,
  resizeMode: "cover",
},
  
  });
