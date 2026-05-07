import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
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

export default function InformasiBerita() {
  const [data, setData] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(false);

  const cleanText = (text?: string) => {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/\r\n/g, ' ')
      .replace(/\n/g, ' ')
      .trim();
  };

  const loadBerita = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        'http://app.rsabojonegoro.com:5000/his/about/berita'
      );

      const json = await res.json();
      setData(json?._embedded?.beritas || []);
    } catch (err) {
      console.log('ERROR BERITA:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBerita();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0A7C86" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Informasi</Text>
          <Text style={styles.headerSubtitle}>berita dan informasi RSA</Text>
        </View>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0A7C86"
          style={{ marginTop: 30 }}
        />
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {!loading &&
          data.map((item) => {
            const judul = cleanText(item.judul);
            const isi = cleanText(item.isi);
            const preview = isi.length > 90 ? isi.slice(0, 90) + '...' : isi;

            const tanggal = new Date(item.tanggal).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            const imageUrl = `http://app.rsabojonegoro.com:1111/api_berita/uploads/${item.fotojudul}`;

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: '/berita-detail',
                    params: { id: item.id },
                  })
                }
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />

                <View style={styles.info}>
                  <Text style={styles.judul} numberOfLines={2}>
                    {judul}
                  </Text>

                  <Text style={styles.isi} numberOfLines={3}>
                    {preview}
                  </Text>

                  <Text style={styles.tanggal}>{tanggal}</Text>
                </View>
              </TouchableOpacity>
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
    backgroundColor: "#0A7C86",
    paddingTop: 30,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
  },

  headerCenter: {
    alignItems: 'center',
  },

  backButton: {
    position: 'absolute',
    left: 14,
    top: 40,
    zIndex: 10,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },

  image: {
    width: 135,
    height: 125,
    backgroundColor: '#ddd',
  },

  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },

  judul: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  isi: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    lineHeight: 18,
  },

  tanggal: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
  },
});