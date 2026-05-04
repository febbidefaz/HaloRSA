import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type PasienRM = {
  id: number;
  nama: string;
  namabin?: string;
  tlahir: string;
  regnum: string;
  userid: string;
};

export default function PendaftaranRM() {
  const [data, setData] = useState<PasienRM[]>([]);
  const [loading, setLoading] = useState(true);

  const formatTanggal = (tgl?: string) => {
    if (!tgl) return '-';

    const d = new Date(tgl);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = d.getFullYear();

    return `${dd}-${mm}-${yy}`;
  };

  

  const loadData = async () => {
    try {
      setLoading(true);

      const googleId = await SecureStore.getItemAsync('google_id');

      const res = await fetch(
        `http://app.rsabojonegoro.com:5000/his/reg/regpxol/userid?userid=${googleId}`
      );

      const json = await res.json();
      setData(json?._embedded?.regPxOLNews || []);
    } catch (err) {
      console.log('ERROR DATA RM:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#087987" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Pendaftaran RM</Text>
        <Text style={styles.headerSubtitle}>
          pendaftaran nomor rekam medis online
        </Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/pendaftaran-rm/daftar-rm-baru')}
      >
        <Text style={styles.addButtonText}>Daftar RM Baru</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#087987" style={{ marginTop: 30 }} />
      ) : (
        <ScrollView>
          {data.map((item) => (
            <View key={item.id} style={styles.patientCard}>
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>
                  {item.namabin || item.nama}
                </Text>

                <Text style={styles.patientText}>
                  Tanggal lahir: {formatTanggal(item.tlahir)}
                </Text>

                <Text style={styles.rmText}>
                  Nomor RM: {item.regnum || '-'}
                </Text>
              </View>

              <TouchableOpacity style={styles.rmButton}>
                <Text style={styles.rmButtonText}>RM Baru</Text>
              </TouchableOpacity>
            </View>
          ))}

          {data.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Belum ada data pendaftaran RM.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  
    header: {
      backgroundColor: '#087987',
      paddingTop: 32,
      paddingBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    backButton: {
      position: 'absolute',
      left: 12,
      top: 34,
      zIndex: 10,
    },
  
    headerTitle: {
      color: '#fff',
      fontSize: 17,
      fontWeight: '700',
    },
  
    headerSubtitle: {
      color: '#fff',
      fontSize: 14,
      marginTop: 1,
    },
  
    addButton: {
      backgroundColor: '#D89200',
      marginHorizontal: 10,
      marginTop: 10,
      borderRadius: 6,
      paddingVertical: 9,
      alignItems: 'center',
      elevation: 2,
    },
  
    addButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
  
    patientCard: {
      marginTop: 18,
      paddingHorizontal: 20,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  
    patientInfo: {
      flex: 1,
    },
  
    patientName: {
      fontSize: 18,
      color: '#111',
      fontWeight: '500',
      marginBottom: 3,
    },
  
    patientText: {
      fontSize: 14,
      color: '#333',
    },
  
    rmText: {
      fontSize: 15,
      color: '#333',
      marginTop: 2,
      fontWeight: '600',
    },
  
    rmButton: {
      backgroundColor: '#0A9A9A',
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 6,
      marginLeft: 10,
    },
  
    rmButtonText: {
      color: '#fff',
      fontSize: 13,
      fontWeight: '600',
    },
  
    emptyBox: {
      margin: 14,
      padding: 12,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
    },
  
    emptyText: {
      textAlign: 'center',
      color: '#666',
      fontSize: 13,
    },
  });