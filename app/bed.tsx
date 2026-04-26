import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
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
        const response = await fetch('https://android.rsabojonegoro.com/his/about/bedready');
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

  const kelasList = ['VVIP', 'VIP', 'I', 'II', 'III', 'HCU', 'ISOLASI'];

  const isBirali2 = (paviliun: string) =>
    String(paviliun || '').trim().toUpperCase() === "BI'RALI- 2" ||
    String(paviliun || '').trim().toUpperCase() === "BI'RALI-2";

  // Tabel utama:
  // - buang ICU
  // - buang semua NEONATUS
  // - buang seluruh baris BI'RALI-2
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
      grouped[pav][item.kelas] = (grouped[pav][item.kelas] || 0) + (Number(item.ready) || 0);
    });

  const ruangBiasa = Object.keys(grouped);

  // ICU total
  const totalICU = data
    .filter((item: any) => String(item.kelas || '').toUpperCase() === 'ICU')
    .reduce((sum: number, item: any) => sum + (Number(item.ready) || 0), 0);

  // Nilai khusus BI'RALI-2 dipindah ke NEONATUS kolom II
  const neonatusKelas2 = data
    .filter(
      (item: any) =>
        String(item.kelas || '').toUpperCase() === 'NEONATUS' &&
        isBirali2(item.paviliun)
    )
    .reduce((sum: number, item: any) => sum + (Number(item.ready) || 0), 0);

  // NEONATUS selain BI'RALI-2 masuk kolom ISOLASI
  const neonatusIsolasi = data
    .filter(
      (item: any) =>
        String(item.kelas || '').toUpperCase() === 'NEONATUS' &&
        !isBirali2(item.paviliun)
    )
    .reduce((sum: number, item: any) => sum + (Number(item.ready) || 0), 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Informasi Tempat Tidur</Text>

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
        <Text style={[styles.headerText, styles.cellRuangan]}>Ruangan</Text>
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

      {/* ICU di bawah */}
      <View style={styles.row}>
        <Text style={[styles.cellRuangan, styles.cellRuangan]}>ICU</Text>
        {kelasList.map((k, i) => (
          <Text key={i} style={styles.cell}>
            {k === 'ISOLASI' ? totalICU : ''}
          </Text>
        ))}
      </View>

      {/* NEONATUS di bawah */}
      <View style={styles.row}>
        <Text style={[styles.cellRuangan, styles.cellRuangan]}>NEONATUS</Text>
        {kelasList.map((k, i) => (
          <Text key={i} style={styles.cell}>
            {k === 'II' ? neonatusKelas2 : k === 'ISOLASI' ? neonatusIsolasi : ''}
          </Text>
        ))}
      </View>

      <View style={styles.keterangan}>
        <Text style={styles.keteranganTitle}>Keterangan:</Text>

        <Text style={styles.keteranganItem}>
          Angka menunjukkan jumlah tempat tidur yang siap dipakai, jika angka menunjukkan 0 maka tempat tidur /bed sedang penuh.
          (data di atas diupdate otomatis setiap 1 menit)
        </Text>

        <Text>
        <Text style={styles.keteranganTitle}>Arofah:</Text>
        Ruang Perawatan Umum
        </Text>

        <Text>  
        <Text style={styles.keteranganTitle}>Birali 1:</Text>
        Ruang Perawatan Dewasa
        </Text>

        <Text> 
        <Text style={styles.keteranganTitle}>Birali 3:</Text>
        Ruang Perawatan Kandungan
        </Text>

        <Text>
        <Text style={styles.keteranganTitle}>Birali 4:</Text>
        Ruang Perawatan Anak
        </Text>

        <Text>  
        <Text style={styles.keteranganTitle}>Ji'ronah 5:</Text>
        Ruang Perawatan Dewasa
        </Text>

        <Text>   
        <Text style={styles.keteranganTitle}>Ji'ronah 6:</Text>
        Ruang Perawatan Dewasa
        </Text>

        <Text>
        <Text style={styles.keteranganTitle}>Ji'ronah 7:</Text>
        Ruang Perawatan Umum
        </Text>

        <Text>
        <Text style={styles.keteranganTitle}>Neonatus:</Text>
        Ruang Perawatan Bayi
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorBox: {
    backgroundColor: '#ffd9d9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#00897B',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerTextIsolasi: {
    flex: 1.2,
  },
  headerText: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 11,
    includeFontPadding: false,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cellRuangan: {
    flex: 1.6,
    fontSize: 12,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  specialRoom: {
    fontWeight: 'bold',
    color: '#00897B',
  },
  keterangan: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F5E6B3',
    borderRadius: 10,
  },
  keteranganTitle: {
    fontWeight: 'bold',
    marginRight: 6,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 13,
    color: '#0A7C86',
    marginBottom: 10,
    fontWeight: '500',
  },
  keteranganItem: {
    marginBottom: 8,
  },
});