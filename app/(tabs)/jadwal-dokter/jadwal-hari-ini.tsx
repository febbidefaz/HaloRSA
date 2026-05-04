import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
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

type JadwalDokter = {
  id: number;
  dr: number;
  dokter: string;
  spesialis: string;
  buka: string;
  tutup: string;
  prak: number;
  photo: string | null;
};

type Spesialis = {
  id: number;
  name: string;
  foto: string | null;
  fotoOL?: string | null;
};

export default function JadwalHariIni() {
  const [data, setData] = useState<JadwalDokter[]>([]);
  const [spesialisList, setSpesialisList] = useState<Spesialis[]>([]);
  const [loading, setLoading] = useState(false);
  const [hariNama, setHariNama] = useState('');

  const getPrakLabel = (prak?: number) => {
    if (prak === 1) return 'Pagi';
    if (prak === 2) return 'Sore';
    return '';
  };

  const getPrakMeta = (prak?: number) => {
    if (prak === 1) {
      return {
        label: 'Pagi',
        style: styles.prakPagi,
      };
    }
  
    if (prak === 2) {
      return {
        label: 'Sore',
        style: styles.prakSore,
      };
    }
  
    return { label: '', style: {} };
  };  
  
  const hariMap = [
    'Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu',
  ];

  const getToday = () => {
    const today = new Date();
    const hr = today.getDay();
    return {
      hr: hr === 0 ? 7 : hr,
      nama: hariMap[hr],
    };
  };

  const formatJam = (jam?: string) => {
    if (!jam) return '';
    const parts = jam.split(':');
    return `${parts[0]}:${parts[1]}`;
  };

  const getImageSpesialis = (spesialis: string) => {
    const found = spesialisList.find((s) =>
      spesialis.toLowerCase().includes(s.name.toLowerCase()) ||
      s.name.toLowerCase().includes(spesialis.toLowerCase())
    );
    return found
      ? `http://app.rsabojonegoro.com:1111/foto/clinic/${found.id}.png`
      : null;
  };

  const loadSpesialis = async () => {
    try {
      const res = await fetch('http://app.rsabojonegoro.com:4000/his/new/Specialist');
      const json = await res.json();
      setSpesialisList(json || []);
    } catch (err) {
      console.log('ERROR SPECIALIST:', err);
    }
  };

  const loadJadwal = async () => {
    try {
      setLoading(true);
      const today = getToday();
      setHariNama(today.nama);

      const res = await fetch(
        `http://app.rsabojonegoro.com:4000/his/about/jadwaldokter/hari?hr=${today.hr}`
      );
      const json = await res.json();
      setData(json?._embedded?.jadwalDokters || []);
    } catch (err) {
      console.log('ERROR JADWAL:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpesialis();
    loadJadwal();
  }, []);
    
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

        <Text style={styles.headerTitle}>
          Jadwal Hari Ini ({hariNama})
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {loading && (
          <ActivityIndicator size="large" color="#0A7C86" style={{ marginTop: 20 }} />
        )}

        {!loading && data.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Tidak ada jadwal hari ini</Text>
          </View>
        )}

{!loading &&
  data.map((item) => {
    const prak = getPrakMeta(item.prak);

    return (
      <View key={item.id} style={styles.card}>
        {getImageSpesialis(item.spesialis) && (
          <Image
            source={getImageSpesialis(item.spesialis)!}
            style={styles.image}
            contentFit="cover"
            cachePolicy="disk"
          />
        )}

        <View style={styles.info}>
          <Text style={styles.spesialis}>{item.spesialis}</Text>

          <View style={styles.rowInfo}>
            <Text style={styles.dokter}>{item.dokter}</Text>

            {prak.label !== '' && (
              <Text style={[styles.prakBase, prak.style]}>
                {prak.label}
              </Text>
            )}
          </View>

          <Text style={styles.jam}>
            {formatJam(item.buka)} - {formatJam(item.tutup)}
          </Text>
        </View>
      </View>
    );
  })}
 
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
    borderRadius: 8,
    elevation: 1,
  },

  image: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
  },

  info: {
    flex: 1,
  },

  spesialis: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },

  dokter: {
    fontSize: 13,
    color: '#555',
  },

  jam: {
    fontSize: 13,
    color: '#0A7C86',
    fontWeight: '600',
  },

  emptyBox: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
  },

  emptyText: {
    textAlign: 'center',
    color: '#666',
  },

  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  prak: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#0A7C86',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
   
  prakBase: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  
  prakPagi: {
    backgroundColor: '#E3F2FD',
    color: '#1565C0',
  },
  
  prakSore: {
    backgroundColor: '#FFF3E0',
    color: '#EF6C00',
  },
});