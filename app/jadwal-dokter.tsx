import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function JadwalDokterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jadwal Dokter</Text>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/jadwal-dokter/jadwal-hari-ini')}>   
        <Ionicons name="calendar-outline" size={30} color="#0A7C86" />
        <Text style={styles.cardText}>Jadwal hari ini</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.card} onPress={() => router.push('/jadwal-dokter/jadwal-berdasarkan-hari')}>
        <Ionicons name="calendar-clear-outline" size={30} color="#0A7C86" />
        <Text style={styles.cardText}>Jadwal berdasarkan hari</Text>
      </TouchableOpacity>
    
      <TouchableOpacity style={styles.card} onPress={() => router.push('/jadwal-dokter/semua-dokter')}>   
        <FontAwesome5 name="user-md" size={28} color="#0A7C86" />
        <Text style={styles.cardText}>Semua dokter</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
    padding: 12, // sebelumnya 14
  },

  title: {
    fontSize: 22, // sebelumnya 30
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#0A7C86',
    textAlign: 'center',
    paddingVertical: 10, // sebelumnya 12
    borderRadius: 8,
    marginBottom: 10, // sebelumnya 14
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 14,   // sebelumnya 22
    paddingHorizontal: 12, // sebelumnya 18
    marginBottom: 10,      // sebelumnya 14
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardText: {
    fontSize: 15, // sebelumnya 18
    color: '#555',
    marginLeft: 12, // sebelumnya 18
  },
});