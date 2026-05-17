import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
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
          'https://api.rsabojonegoro.com:5010/his/new/Specialist'
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
    return {
      uri: `https://assets/foto/clinic/${item.id}.png`,
    };
  };

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
                    <Image
                    source={img}
                    style={styles.iconImage}
                    resizeMode="cover"
                    onError={() => console.log('Foto spesialis tidak ditemukan:', item.id)}
                  />
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
    backgroundColor: "#0A7C86",
    paddingTop: 38,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
  },
  
  backButton: {
    position: 'absolute',
    left: 14,
    top: 36,
    zIndex: 10,
  },
  
  headerTitle: {
    color: '#fff',
    fontSize: 18,
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