import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function JadwalDokterScreen() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0A7C86" barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Jadwal Dokter</Text>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/jadwal-dokter/jadwal-hari-ini')}
        >
          <Ionicons name="calendar-outline" size={28} color="#0A7C86" />
          <Text style={styles.cardText}>Jadwal hari ini</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/jadwal-dokter/jadwal-berdasarkan-hari')}
        >
          <Ionicons name="calendar-clear-outline" size={28} color="#0A7C86" />
          <Text style={styles.cardText}>Jadwal berdasarkan hari</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/jadwal-dokter/semua-dokter')}
        >
          <FontAwesome5 name="user-md" size={26} color="#0A7C86" />
          <Text style={styles.cardText}>Semua dokter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },

  header: {
    backgroundColor: '#0A7C86',
    paddingTop: 32, // 🔥 turun 1 spasi
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  backButton: {
    position: 'absolute',
    left: 14,
    top: 34,
  },

  content: {
    padding: 12,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',

    // shadow halus (lebih profesional)
    elevation: 2,
  },

  cardText: {
    fontSize: 15,
    color: '#444',
    marginLeft: 14,
    fontWeight: '500',
  },
});