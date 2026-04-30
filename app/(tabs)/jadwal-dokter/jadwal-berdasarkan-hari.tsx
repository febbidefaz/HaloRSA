import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const hariList = [
  { label: 'Senin', value: 1 },
  { label: 'Selasa', value: 2 },
  { label: 'Rabu', value: 3 },
  { label: 'Kamis', value: 4 },
  { label: 'Jumat', value: 5 },
  { label: 'Sabtu', value: 6 },
  { label: 'Minggu', value: 7 },
];

type JadwalDokter = {
  id: number;
  dokter: string;
  spesialis: string;
  hari: string;
  buka: string;
  tutup: string;
  hr: number;
  photo: string | null;
};

export default function JadwalBerdasarkanHari() {
  const [selectedHari, setSelectedHari] = useState('Senin');
  const [selectedHr, setSelectedHr] = useState(1);
  const [data, setData] = useState<JadwalDokter[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [spesialisList, setSpesialisList] = useState<any[]>([]);
  const getIconBySpesialis = (spesialis: string) => {
    return 'https://cdn-icons-png.flaticon.com/512/387/387569.png';
  };

  const loadJadwal = async (hr: number) => {
    try {
      setLoading(true);
      setErrorMsg('');

      const response = await fetch(
      //  `https://android.rsabojonegoro.com/his/about/jadwaldokter/hari?hr=${hr}`
        `http://app.rsabojonegoro.com:4000/his/about/jadwaldokter/hari?hr=${hr}`
      );

      const json = await response.json();
      const items = json?._embedded?.jadwalDokters || [];
      setData(items);
    } catch (err: any) {
      console.log('FETCH ERROR:', err);
      setErrorMsg(err?.message || 'Gagal mengambil data jadwal dokter');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadSpesialis = async () => {
      try {
       // const res = await fetch('https://android.rsabojonegoro.com/his/new/Specialist');
      //  const res = await fetch('https://app.rsabojonegoro.com:4000/his/new/Specialist');
        const res = await fetch('http://app.rsabojonegoro.com:4000/his/new/Specialist');
        const json = await res.json();
        setSpesialisList(json || []);
      } catch (err) {
        console.log('ERROR SPECIALIST:', err);
      }
    };
  
    loadSpesialis();
  }, []);

  useEffect(() => {
    loadJadwal(selectedHr);
  }, [selectedHr]);

  const getImageSpesialis = (spesialis: string) => {
    if (!spesialisList.length) return null;
  
    const found = spesialisList.find((s) =>
      spesialis.toLowerCase().includes(s.name.toLowerCase())
    );
  
    if (!found?.foto) return null;
  
      // Prioritas 1: foto base64 dari field foto
    if (found.foto) {
      return `data:image/jpeg;base64,${found.foto}`;
  }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Jadwal Dokter</Text>

      {hariList.map((hari) => (
      <View key={hari.value}>
        <TouchableOpacity
          style={[
            styles.menuCard,
            selectedHari === hari.label && styles.cardActive,
          ]}
          onPress={() => {
            router.push({
              pathname: 'jadwal-dokter/jadwal-per-hari',
              params: {
                hr: hari.value,
                hari: hari.label,
              },
            });
          }}
        >
          <Ionicons name="calendar-outline" size={28} color="#0A7C86" />
          <Text style={styles.cardText}>{hari.label}</Text>
        </TouchableOpacity>

      
      </View>
    ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
    padding: 14,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#0A7C86',
    textAlign: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 14,
  },

  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardActive: {
    backgroundColor: '#d7f3f6',
    borderLeftWidth: 5,
    borderLeftColor: '#0A7C86',
  },

  cardText: {
    fontSize: 18,
    color: '#666',
    marginLeft: 18,
  },

  contentBox: {
    marginTop: 10,
  },

  title: {
    fontSize: 22, // sebelumnya 30
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#0A7C86',
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#7FAEB3',
  },

  doctorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
    backgroundColor: '#eee',
  },

  doctorInfo: {
    flex: 1,
  },

  spesialis: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 1,
  },

  dokter: {
    fontSize: 13,
    color: '#555',
    marginBottom: 1,
  },

  jam: {
    fontSize: 13,
    color: '#555',
  },

  errorBox: {
    backgroundColor: '#ffd9d9',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  errorText: {
    color: 'red',
  },

  emptyBox: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
  },

  emptyText: {
    color: '#666',
  },

  contentTitle: {
    fontSize: 15, // sebelumnya 18
    fontWeight: '600',
    marginBottom: 6,
    color: '#222',
  },
});