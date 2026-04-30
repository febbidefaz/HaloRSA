import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
  
type SpecialistItem = {
    id: number;
    name: string;
    foto?: string | null;
    fotoOL?: string | null;
  };
  
type QueueItem = {
    id: string;
    poli: string;
    idpoli: number;
    dokter: string;
    jp: number;
    allpx: number;
    finishpx: number;
    quepx: number;
    fotoOL?: string | null;
  };

export default function AntrianScreen() {
  const [data, setData] = useState<QueueItem[]>([]);
  const [specialistMap, setSpecialistMap] = useState<Record<number, SpecialistItem>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getShift = (jp: number) => {
    if (jp === 1) return 'Pagi';
    if (jp === 2) return 'Sore';
    return '-';
  };

  const loadData = async () => {
    try {
      const [queueRes, specialistRes] = await Promise.all([
   //     fetch('https://android.rsabojonegoro.com/his/quepx'),
        fetch('http://app.rsabojonegoro.com:5000/his/quepx'),
   //     fetch('https://app.rsabojonegoro.com:4000/his/new/Specialist'),
   //     fetch('http://app.rsabojonegoro.com:5000/his/new/Specialist'),
        fetch('http://app.rsabojonegoro.com:4000/his/new/Specialist'),
      ]);
  
      const queueJson = await queueRes.json();
      const specialistJson: SpecialistItem[] = await specialistRes.json();
  
      const map: Record<number, SpecialistItem> = {};
      specialistJson.forEach((sp) => {
        map[sp.id] = sp;
      });
       
      setSpecialistMap(map);
      setData(queueJson?._embedded?.quePxes || []);
    } catch (error) {
      console.log('Error antrian:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };
  
  const now = new Date();
  const tanggal = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  const jam = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0A7C86" />
        <Text style={styles.loadingText}>Memuat antrian...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#0A7C86" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Antrian Rawat Jalan</Text>
          <Text style={styles.headerSubtitle}>
            {tanggal}, {jam}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0A7C86']} />
        }
      >
      {data.map((item) => {
        const specialist = specialistMap[item.idpoli];

        return (
            <View key={item.id} style={styles.card}>
            <Image
                source={
                specialist?.foto
                    ? { uri: `data:image/jpeg;base64,${specialist.foto}` }
                    : specialist?.fotoOL
                    ? { uri: specialist.fotoOL }
                    : item.fotoOL
                    ? { uri: item.fotoOL }
                    : require('../assets/menu/konsul.png')
                }
                style={styles.icon}
            />

            <View style={styles.info}>
            <View style={styles.topLine}>
                <Text style={styles.poli}>{item.poli}</Text>
            </View>

              <View style={styles.rowDokter}>
                <Text style={styles.dokter}>
                {item.dokter}
                </Text>
                <Text style={styles.shift}>{getShift(item.jp)}</Text>
            </View>    

            <Text style={styles.queueText}>
                {item.allpx} pasien, {item.finishpx} terlayani
            </Text>
            </View>
            </View>
        );
        })}  
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  header: {
    backgroundColor: '#0A7C86',
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  headerTextWrap: {
    flex: 1,
    alignItems: 'center',
    marginRight: 38,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#8FBFC4',
    backgroundColor: '#fff',
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#EDEDED',
  },
  info: {
    flex: 1,
  }, 
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
 poli: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginRight: 8,
   },
rowDokter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dokter: {
    fontSize: 14,
    color: '#777',
    lineHeight: 19,
    marginTop: 2,
  },
  rightBox: {
    width: 125,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  shift: {
    fontSize: 16,
    color: '#0A7C86',
    fontWeight: '500',
  },
  queueRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  queueText: {
    fontSize: 13,
    color: '#555',
    textAlign: 'right',
    marginTop: 2,
  },
  finishText: {
    fontSize: 13,
    color: '#555',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
  },
});