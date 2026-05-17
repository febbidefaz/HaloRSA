import { Ionicons } from '@expo/vector-icons';
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

export default function BedScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          'https://api.rsabojonegoro.com:5010/his/about/bedready'
        );
        const json = await response.json();
        setData(json?._embedded?.bedReadies || []);
      } catch (err: any) {
        console.log('FETCH ERROR:', err);
        setErrorMsg(err?.message || 'Gagal mengambil data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTanggal = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatJam = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const kelasList = ['V VIP', 'VIP', 'I', 'II', 'III', 'HCU', 'ISOLASI'];

  const isBirali2 = (paviliun: string) =>
    String(paviliun || '').trim().toUpperCase() === "BI'RALI- 2" ||
    String(paviliun || '').trim().toUpperCase() === "BI'RALI-2";

  const grouped: Record<string, Record<string, number>> = {};

  data
    .filter((item: any) => {
      const kelas = String(item.kelas || '').toUpperCase();
      const paviliun = String(item.paviliun || '');

      if (kelas === 'ICU') return false;
      if (kelas === 'NEONATUS') return false;
      if (isBirali2(paviliun)) return false;

      return true;
    })
    .forEach((item: any) => {
      const pav = item.paviliun;
      if (!grouped[pav]) grouped[pav] = {};
      grouped[pav][item.kelas] =
        (grouped[pav][item.kelas] || 0) + (Number(item.ready) || 0);
    });

  const ruangBiasa = Object.keys(grouped);

  const totalICU = data
    .filter((item: any) => String(item.kelas || '').toUpperCase() === 'ICU')
    .reduce((sum: number, item: any) => sum + (Number(item.ready) || 0), 0);

  const neonatusKelas2 = data
    .filter(
      (item: any) =>
        String(item.kelas || '').toUpperCase() === 'NEONATUS' &&
        isBirali2(item.paviliun)
    )
    .reduce((sum: number, item: any) => sum + (Number(item.ready) || 0), 0);

  const neonatusIsolasi = data
    .filter(
      (item: any) =>
        String(item.kelas || '').toUpperCase() === 'NEONATUS' &&
        !isBirali2(item.paviliun)
    )
    .reduce((sum: number, item: any) => sum + (Number(item.ready) || 0), 0);

  return (
    <View style={styles.page}>
      <StatusBar backgroundColor="#00897B" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Informasi Tempat Tidur</Text>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.subtitle}>
          {formatTanggal(now)}, {formatJam(now)} WIB
        </Text>

        {loading && <ActivityIndicator size="large" color="#00897B" />}

        {!!errorMsg && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>Error: {errorMsg}</Text>
          </View>
        )}

        <View style={styles.headerRow}>
          <Text style={[styles.headerText, styles.cellRuangan, { color: '#fff' }]}>Ruangan</Text>
          {kelasList.map((k) => (
            <Text
              key={k}
              style={[
                styles.headerText,
                k === 'ISOLASI' ? styles.headerTextIsolasi : null,
              ]}
              numberOfLines={1}
            >
              {k}
            </Text>
          ))}
        </View>

        {ruangBiasa.map((ruang, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cellRuangan}>{ruang}</Text>
            {kelasList.map((k, i) => (
              <Text key={i} style={styles.cell}>
                {grouped[ruang][k] ?? ''}
              </Text>
            ))}
          </View>
        ))}

        <View style={styles.row}>
          <Text style={styles.cellRuangan}>ICU</Text>
          {kelasList.map((k, i) => (
            <Text key={i} style={styles.cell}>
              {k === 'ISOLASI' ? totalICU : ''}
            </Text>
          ))}
        </View>

        <View style={styles.row}>
          <Text style={styles.cellRuangan}>NEONATUS</Text>
          {kelasList.map((k, i) => (
            <Text key={i} style={styles.cell}>
              {k === 'II'
                ? neonatusKelas2
                : k === 'ISOLASI'
                ? neonatusIsolasi
                : ''}
            </Text>
          ))}
        </View>

        <View style={styles.keterangan}>
          <Text style={styles.keteranganTitle}>Keterangan:</Text>

          <Text style={styles.keteranganItem}>
            Angka menunjukkan jumlah tempat tidur yang siap dipakai, jika angka
            menunjukkan 0 maka tempat tidur / bed sedang penuh. Data di atas
            diupdate otomatis setiap 1 menit.
          </Text>

          <Text><Text style={styles.keteranganTitle}>Arofah: </Text>Ruang Perawatan Umum</Text>
          <Text><Text style={styles.keteranganTitle}>Birali 1: </Text>Ruang Perawatan Dewasa</Text>
          <Text><Text style={styles.keteranganTitle}>Birali 3: </Text>Ruang Perawatan Kandungan</Text>
          <Text><Text style={styles.keteranganTitle}>Birali 4: </Text>Ruang Perawatan Anak</Text>
          <Text><Text style={styles.keteranganTitle}>Ji'ronah 5: </Text>Ruang Perawatan Dewasa</Text>
          <Text><Text style={styles.keteranganTitle}>Ji'ronah 6: </Text>Ruang Perawatan Dewasa</Text>
          <Text><Text style={styles.keteranganTitle}>Ji'ronah 7: </Text>Ruang Perawatan Umum</Text>
          <Text><Text style={styles.keteranganTitle}>Neonatus: </Text>Ruang Perawatan Bayi</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F4F7F7',
  },

  header: {
    backgroundColor: "#0A7C86",
    paddingTop: 38,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  backButton: {
    position: 'absolute',
    left: 14,
    top: 36,
    zIndex: 10,
  },

  container: {
    flex: 1,
    padding: 12,
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 13,
    color: '#00897B',
    marginBottom: 12,
    fontWeight: '600',
  },

  errorBox: {
    backgroundColor: '#FFE5E5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  errorText: {
    color: '#D32F2F',
    fontWeight: '600',
  },

  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#00897B',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  headerTextIsolasi: {
    flex: 1.2,
  },

  headerText: {
    flex: 1,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 11,
    includeFontPadding: false,
  },

  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
    paddingVertical: 9,
    paddingHorizontal: 4,
  },

  cellRuangan: {
    flex: 1.6,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },

  keterangan: {
    marginTop: 18,
    marginBottom: 24,
    padding: 14,
    backgroundColor: '#FFF6D8',
    borderRadius: 14,
    borderLeftWidth: 5,
    borderLeftColor: '#F5A000',
  },

  keteranganTitle: {
    fontWeight: '700',
    color: '#333',
  },

  keteranganItem: {
    marginBottom: 8,
    color: '#555',
    lineHeight: 19,
  },
});