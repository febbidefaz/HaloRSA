import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
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
        `https://android.rsabojonegoro.com/his/about/jadwaldokter/hari?hr=${hr}`
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
        const res = await fetch('https://app.rsabojonegoro.com:4000/his/new/Specialist');
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
  
    return found.foto.replace('http://', 'https://');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Jadwal Dokter</Text>

      {hariList.map((hari) => (
        <TouchableOpacity
          key={hari.value}
          style={[
            styles.menuCard,
            selectedHari === hari.label && styles.cardActive,
          ]}
          onPress={() => {
            setSelectedHari(hari.label);
            setSelectedHr(hari.value);
          }}
        >
          <Ionicons name="calendar-outline" size={28} color="#0A7C86" />
          <Text style={styles.cardText}>{hari.label}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.contentBox}>
        <Text style={styles.contentTitle}>Jadwal Hari {selectedHari}</Text>

        {loading && (
          <ActivityIndicator size="large" color="#0A7C86" style={{ marginTop: 10 }} />
        )}

        {!!errorMsg && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {!loading && !errorMsg && data.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Belum ada jadwal dokter.</Text>
          </View>
        )}

        {!loading &&
          !errorMsg &&
          data.map((item) => (
            <View key={item.id} style={styles.doctorCard}>
            <Image
                source={{
                    uri:
                    item.photo ||
                    getImageSpesialis(item.spesialis) ||
                    getIconBySpesialis(item.spesialis),
                }}
                style={styles.doctorIcon}
                resizeMode="cover"
                />

              <View style={styles.doctorInfo}>
                <Text style={styles.spesialis}>{item.spesialis}</Text>
                <Text style={styles.dokter}>{item.dokter}</Text>
                <Text style={styles.jam}>
                  {item.buka} - {item.tutup}
                </Text>
              </View>
            </View>
          ))}
      </View>
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
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 14,
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

  contentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#222',
  },

  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#7FAEB3',
  },

  doctorIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginRight: 14,
    backgroundColor: '#eee',
  },

  doctorInfo: {
    flex: 1,
  },

  spesialis: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },

  dokter: {
    fontSize: 15,
    color: '#555',
    marginBottom: 2,
  },

  jam: {
    fontSize: 15,
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
});