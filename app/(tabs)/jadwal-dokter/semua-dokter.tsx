import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Specialist = {
  id: number;
  name: string;
  category: string;
  fotoOL: string | null;
  foto: string | null;
};

export default function SemuaDokter() {
  const [data, setData] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpecialist = async () => {
      try {
        const res = await fetch(
          'http://app.rsabojonegoro.com:4000/his/new/Specialist'
        );
        const json = await res.json();
        setData(json || []);
      } catch (err) {
        console.log('ERROR SPECIALIST:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSpecialist();
  }, []);

  const getImageSource = (item: Specialist) => {
    if (item.fotoOL) return { uri: item.fotoOL };
    if (item.foto) return { uri: `data:image/jpeg;base64,${item.foto}` };
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <Text style={styles.headerTitle}>Jadwal Dokter Spesialis</Text>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#0A7C86" />
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator>
          {data.map((item) => {
            const img = getImageSource(item);

            return (
              <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.75}
                  style={styles.card}
                  onPress={() => {
                    router.push({
                      pathname: '/jadwal-dokter/dokter-spesialis',
                      params: {
                        sp: item.id,
                        nama: item.name,
                      },
                    });
                  }}
                >
                <View style={styles.iconCircle}>
                  {img ? (
                    <Image source={img} style={styles.iconImage} resizeMode="cover" />
                  ) : (
                    <Ionicons name="medkit-outline" size={22} color="#BDBDBD" />
                  )}
                </View>

                <Text style={styles.name}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}

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

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E9E9E9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  iconImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },

  name: {
    marginLeft: 16,
    fontSize: 17,
    color: '#555',
    flex: 1,
    fontWeight: '400',
  },

  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});