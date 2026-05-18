import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type JadwalDokter = {
  id: number;
  dr: number;
  dokter: string;
  spesialis: string;
  buka: string;
  tutup: string;
  prak?: number;
  photo: string | null;
};

type Spesialis = {
  id: number;
  name: string;
  foto: string | null;
  fotoOL?: string | null;
};

export default function JadwalPerHari() {
  const { hr, hari } = useLocalSearchParams();

  const [data, setData] = useState<JadwalDokter[]>([]);
  const [spesialisList, setSpesialisList] = useState<Spesialis[]>([]);
  const [loading, setLoading] = useState(false);

  const getPrakMeta = (prak?: number) => {
    if (prak === 1) return { label: "Pagi", style: styles.prakPagi };
    if (prak === 2) return { label: "Sore", style: styles.prakSore };
    return { label: "", style: {} };
  };

  const getImageSpesialis = (spesialis: string) => {
    const found = spesialisList.find(
      (s) =>
        spesialis.toLowerCase().includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().includes(spesialis.toLowerCase()),
    );

    return found
      ? `https://api.rsabojonegoro.com/assets/foto/clinic/${found.id}.png`
      : null;
  };

  const formatJam = (jam?: string) => {
    if (!jam) return "";
    const parts = jam.split(":");
    return `${parts[0]}:${parts[1]}`;
  };

  const loadSpesialis = async () => {
    try {
      const res = await fetch(
        "https://api.rsabojonegoro.com:5010/his/new/Specialist",
      );
      const json = await res.json();
      setSpesialisList(json || []);
    } catch (err) {
      console.log("ERROR SPECIALIST:", err);
    }
  };

  const loadJadwal = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://api.rsabojonegoro.com:5010/his/about/jadwaldokter/hari?hr=${hr}`,
      );

      const json = await res.json();
      setData(json?._embedded?.jadwalDokters || []);
    } catch (err) {
      console.log("ERROR JADWAL:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpesialis();
    loadJadwal();
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

        <Text style={styles.headerTitle}>Jadwal {hari}</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading && (
          <ActivityIndicator
            size="large"
            color="#0A7C86"
            style={{ marginTop: 20 }}
          />
        )}

        {!loading && data.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Belum ada jadwal dokter.</Text>
          </View>
        )}

        {!loading &&
          data.map((item) => {
            const img = getImageSpesialis(item.spesialis);
            const prak = getPrakMeta(item.prak);

            return (
              <View key={item.id} style={styles.card}>
                {img && (
                  <Image
                    source={img}
                    style={styles.image}
                    contentFit="cover"
                    cachePolicy="disk"
                  />
                )}

                <View style={styles.info}>
                  <Text style={styles.spesialis}>{item.spesialis}</Text>

                  <View style={styles.rowInfo}>
                    <Text style={styles.dokter}>{item.dokter}</Text>

                    {prak.label !== "" && (
                      <Text style={[styles.prakBase, prak.style]}>
                        {prak.label}
                      </Text>
                    )}
                  </View>

                  <Text style={styles.jam}>
                    {formatJam(item.buka)} - {formatJam(item.tutup)}
                  </Text>
                </View>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efefef",
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
    position: "absolute",
    left: 14,
    top: 34,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  content: {
    padding: 12,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 6,
    elevation: 1,
  },

  image: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
    backgroundColor: "#E7F5F6",
  },

  info: {
    flex: 1,
  },

  spesialis: {
    fontWeight: "700",
    fontSize: 14,
    color: "#111",
    marginBottom: 2,
  },

  rowInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dokter: {
    fontSize: 13,
    color: "#555",
    flex: 1,
    marginRight: 8,
  },

  jam: {
    fontSize: 13,
    color: "#0A7C86",
    fontWeight: "600",
    marginTop: 2,
  },

  prakBase: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: "hidden",
  },

  prakPagi: {
    backgroundColor: "#E3F2FD",
    color: "#1565C0",
  },

  prakSore: {
    backgroundColor: "#FFF3E0",
    color: "#EF6C00",
  },

  emptyBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
  },

  emptyText: {
    color: "#666",
    textAlign: "center",
  },
});
