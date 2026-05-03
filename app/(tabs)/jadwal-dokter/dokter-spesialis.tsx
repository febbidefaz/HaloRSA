import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Dokter = {
  id: number;
  dokter: string;
  spesialis: string;
  sp: number;
};

type JadwalDokter = {
  id: number;
  hari: string;
  buka: string;
  tutup: string;
  keterangan?: string;
  prak?: number;
};

export default function DokterSpesialis() {
  const { sp, nama } = useLocalSearchParams();

  const [data, setData] = useState<Dokter[]>([]);
  const [selectedDokter, setSelectedDokter] = useState<number[]>([]);
  const [jadwal, setJadwal] = useState<Record<number, JadwalDokter[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingJadwal, setLoadingJadwal] = useState<Record<number, boolean>>({});
  const getPrakLabel = (prak?: number) => {
    if (prak === 1) return 'Pagi';
    if (prak === 2) return 'Sore';
    return '';
    };
  const formatJam = (jam?: string) => {
    if (!jam) return '';

    const clean = jam.trim(); // 🔥 handle spasi
    const parts = clean.split(':');

    const hh = parts[0]?.padStart(2, '0') || '00';
    const mm = parts[1]?.padStart(2, '0') || '00';

    return `${hh}:${mm}`;
    };

  useEffect(() => {
    const loadDokter = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://app.rsabojonegoro.com:4000/his/new/Specialist/sp?sp=${sp}`
        );

        const json = await res.json();
        setData(json?._embedded?.dokters || []);
      } catch (err) {
        console.log('ERROR DOKTER SPESIALIS:', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (sp) loadDokter();
  }, [sp]);

const loadJadwalDokter = async (idDokter: number) => {
  if (selectedDokter.includes(idDokter)) {
    setSelectedDokter((prev) => prev.filter((id) => id !== idDokter));
    return;
  }

  setSelectedDokter((prev) => [...prev, idDokter]);

  if (jadwal[idDokter]) return;

  try {
    setLoadingJadwal((prev) => ({
      ...prev,
      [idDokter]: true,
    }));

    const res = await fetch(
      `http://app.rsabojonegoro.com:4000/his/about/jadwaldokter/dokter?dr=${idDokter}`
    );

    const json = await res.json();

    setJadwal((prev) => ({
      ...prev,
      [idDokter]: json?._embedded?.jadwalDokters || [],
    }));
  } catch (err) {
    console.log('ERROR JADWAL DOKTER:', err);

    setJadwal((prev) => ({
      ...prev,
      [idDokter]: [],
    }));
  } finally {
    setLoadingJadwal((prev) => ({
      ...prev,
      [idDokter]: false,
    }));
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <Text style={styles.headerTitle}>Jadwal Dokter {nama}</Text>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#0A7C86" />
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator>
          {data.map((item) => (
            <View key={item.id}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={[
                  styles.card,
                  selectedDokter.includes(item.id) && styles.cardActive,
                ]}
                onPress={() => loadJadwalDokter(item.id)}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name="person-outline" size={22} color="#0A7C86" />
                </View>

                <Text style={styles.name}>{item.dokter}</Text>

                <Ionicons
                 name={
                    selectedDokter.includes(item.id)
                        ? 'chevron-up-outline'
                        : 'chevron-down-outline'
                    }
                  size={22}
                  color="#0A7C86"
                />
              </TouchableOpacity>

           {selectedDokter.includes(item.id) && (
  <View style={styles.jadwalBox}>
   {loadingJadwal[item.id] ? (
      <ActivityIndicator size="small" color="#0A7C86" />
   ) : jadwal[item.id]?.length > 0 ? (
  jadwal[item.id].map((j, index) => (
        <View key={j.id}>
          
          <View style={styles.jadwalRow}>
            <View style={styles.leftSection}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color="#0A7C86"
              />

              <Text style={styles.hari}>{j.hari}</Text>
            </View>

          <View style={styles.jamContainer}>
            
            {(getPrakLabel(j.prak) || j.keterangan) && (
                <View
                style={[
                    styles.badge,
                    j.prak === 1 ? styles.badgePagi : styles.badgeSore,
                ]}
                >
                <Text style={styles.badgeText}>
                    {getPrakLabel(j.prak) || j.keterangan}
                </Text>
                </View>
            )}

            <Text style={styles.jam}>
                {formatJam(j.buka)} - {formatJam(j.tutup)}
            </Text>

            </View>
          </View>

         {index !== jadwal[item.id].length - 1 && (
            <View style={styles.divider} />
          )}
        </View>
      ))
    ) : (
      <Text style={styles.emptyText}>
        Jadwal dokter belum tersedia
      </Text>
    )}
  </View>
)}
            </View>
          ))}

          {data.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Data dokter belum tersedia</Text>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },

  header: {
    backgroundColor: '#0A7C86',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  

  backButton: {
    position: 'absolute',
    left: 12,
    top: 14,
    zIndex: 10,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
    paddingHorizontal: 42,
  },

  content: {
    flex: 1,
    paddingTop: 4,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 8,
    minHeight: 64,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  cardActive: {
    backgroundColor: '#E7F5F6',
    borderLeftWidth: 5,
    borderLeftColor: '#0A7C86',
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E9E9E9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  name: {
    marginLeft: 16,
    fontSize: 17,
    color: '#555',
    flex: 1,
    fontWeight: '400',
  },

jadwalBox: {
  backgroundColor: '#fff',
  marginHorizontal: 12,
  marginTop: -4,
  marginBottom: 10,
  borderRadius: 12,
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderLeftWidth: 4,
  borderLeftColor: '#0A7C86',
},

jadwalRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 10,
},

leftSection: {
  flexDirection: 'row',
  alignItems: 'center',
},

hari: {
  width: 85, // 🔥 biar rata semua hari
  marginLeft: 8,
  fontSize: 15,
  fontWeight: '600',
  color: '#333',
},

divider: {
  height: 1,
  backgroundColor: '#EAEAEA',
  marginLeft: 30, // biar sejajar dengan text
},

  jadwalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },

  jadwalTextBox: {
  marginLeft: 12,
  flex: 1,
  flexDirection: 'row',   // ⬅️ ini kunci
  alignItems: 'center',
  justifyContent: 'space-between',
},

  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyBox: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 16,
    borderRadius: 10,
  },

  emptyText: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
  },

  jamContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},

badge: {
  paddingHorizontal: 10,
  paddingVertical: 3,
  borderRadius: 6,
},

badgePagi: {
  backgroundColor: '#E8F5E9', // hijau soft
},

badgeSore: {
  backgroundColor: '#FFF3E0', // orange soft
},

badgeText: {
  fontSize: 12,
  fontWeight: '600',
},

jam: {
  fontSize: 14,
  color: '#444',
  fontWeight: '500',
},
});