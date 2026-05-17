import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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

type Berita = {
  id: number;
  judul: string;
  tanggal: string;
  isi: string;
  fotojudul: string;
};

export default function BeritaDetail() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<Berita | null>(null);
  const [loading, setLoading] = useState(false);

  const cleanText = (text?: string) => {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/\r\n/g, '\n')
      .trim();
  };

  const loadDetail = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://api.rsabojonegoro.com:5010/his/about/berita/${id}`
      );

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.log('ERROR DETAIL BERITA:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadDetail();
  }, [id]);

  const imageUrl = data
   // ? `http://app.rsabojonegoro.com:1111/api_berita/uploads/${data.fotojudul}`
    ? `https://api.rsabojonegoro.com/assets/foto/uploads/${data.fotojudul}`
    : '';

  const tanggal = data?.tanggal
    ? new Date(data.tanggal).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Informasi</Text>
      </View>

      {loading && (
        <ActivityIndicator size="large" color="#0A7C86" style={{ marginTop: 30 }} />
      )}

      {!loading && data && (
        <ScrollView>
          <View>
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
            <Text style={styles.dateOverlay}>{tanggal}</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{cleanText(data.judul)}</Text>
            <Text style={styles.body}>{cleanText(data.isi)}</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    backgroundColor: '#0A7C86',
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  image: {
    width: '100%',
    height: 280,
    backgroundColor: '#ddd',
  },

  dateOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111',
    borderLeftWidth: 4,
    borderLeftColor: '#0A7C86',
    paddingLeft: 10,
    marginBottom: 16,
  },

  body: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});