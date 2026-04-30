import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type JadwalDokter = {
  id: number;
  dokter: string;
  spesialis: string;
  buka: string;
  tutup: string;
  photo: string | null;
};

type Spesialis = {
  id: number;
  name: string;
  foto: string | null;
  fotoOL?: string | null;
};

export default function JadwalPerHari() {
  const { hr, hari } = useLocalSearchParams();

  const [data, setData] = useState<JadwalDokter[]>([]);
  const [spesialisList, setSpesialisList] = useState<Spesialis[]>([]);
  const [loading, setLoading] = useState(false);

  const getIconDefault = () => {
    return 'https://cdn-icons-png.flaticon.com/512/387/387569.png';
  };

  const getImageSpesialis = (spesialis: string) => {
    if (!spesialisList.length) return null;

    const found = spesialisList.find((s) =>
      spesialis.toLowerCase().includes(s.name.toLowerCase()) ||
      s.name.toLowerCase().includes(spesialis.toLowerCase())
    );

    if (found?.foto) {
      return `data:image/jpeg;base64,${found.foto}`;
    }

    if (found?.fotoOL) {
      return found.fotoOL;
    }

    return null;
  };

  const loadSpesialis = async () => {
    try {
      const res = await fetch(
        'http://app.rsabojonegoro.com:4000/his/new/Specialist'
      );

      const json = await res.json();
      setSpesialisList(json || []);
    } catch (err) {
      console.log('ERROR SPECIALIST:', err);
    }
  };

  const loadJadwal = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://app.rsabojonegoro.com:4000/his/about/jadwaldokter/hari?hr=${hr}`
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Jadwal {hari}</Text>

      {loading && (
        <ActivityIndicator size="large" color="#0A7C86" style={{ marginTop: 20 }} />
      )}

      {!loading && data.length === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Belum ada jadwal dokter.</Text>
        </View>
      )}

      {!loading &&
        data.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image
              source={{
                uri:
                  getImageSpesialis(item.spesialis) ||
                  item.photo ||
                  getIconDefault(),
              }}
              style={styles.image}
              resizeMode="cover"
            />

            <View style={styles.info}>
              <Text style={styles.spesialis}>{item.spesialis}</Text>
              <Text style={styles.dokter}>{item.dokter}</Text>
              <Text style={styles.jam}>
                {item.buka} - {item.tutup}
              </Text>
            </View>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: '#efefef',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#fff',
    backgroundColor: '#0A7C86',
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#7FAEB3',
  },

  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
    backgroundColor: '#eee',
  },

  info: {
    flex: 1,
  },

  spesialis: {
    fontWeight: '700',
    fontSize: 14,
    color: '#111',
    marginBottom: 2,
  },

  dokter: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },

  jam: {
    fontSize: 13,
    color: '#555',
  },

  emptyBox: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
  },

  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
});