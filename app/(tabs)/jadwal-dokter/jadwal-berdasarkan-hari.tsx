import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const hariList = [
  { label: "Senin", value: 1 },
  { label: "Selasa", value: 2 },
  { label: "Rabu", value: 3 },
  { label: "Kamis", value: 4 },
  { label: "Jumat", value: 5 },
  { label: "Sabtu", value: 6 },
  { label: "Minggu", value: 7 },
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
  const [selectedHari, setSelectedHari] = useState("Senin");
  const [selectedHr, setSelectedHr] = useState(1);
  const [data, setData] = useState<JadwalDokter[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [spesialisList, setSpesialisList] = useState<any[]>([]);
  const getIconBySpesialis = (spesialis: string) => {
    return "https://cdn-icons-png.flaticon.com/512/387/387569.png";
  };

  const loadJadwal = async (hr: number) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const response = await fetch(
        `https://api.rsabojonegoro.com:5010/his/about/jadwaldokter/hari?hr=${hr}`,
      );

      const json = await response.json();
      const items = json?._embedded?.jadwalDokters || [];
      setData(items);
    } catch (err: any) {
      console.log("FETCH ERROR:", err);
      setErrorMsg(err?.message || "Gagal mengambil data jadwal dokter");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadSpesialis = async () => {
      try {
        // const res = await fetch('https://android.rsabojonegoro.com/his/new/Specialist');
        const res = await fetch(
          "https://api.rsabojonegoro.com:5010/his/new/Specialist",
        );
        const json = await res.json();
        setSpesialisList(json || []);
      } catch (err) {
        console.log("ERROR SPECIALIST:", err);
      }
    };

    loadSpesialis();
  }, []);

  useEffect(() => {
    loadJadwal(selectedHr);
  }, [selectedHr]);

  const getImageSpesialis = (spesialis: string) => {
    if (!spesialisList.length) return null;

    const found = spesialisList.find(
      (s) =>
        spesialis.toLowerCase().includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().includes(spesialis.toLowerCase()),
    );

    if (!found) return null;

    return `https://api.rsabojonegoro.com/assets/foto/clinic/${found.id}.png`;
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Jadwal Dokter</Text>
      </View>

      <ScrollView style={styles.content}>
        {hariList.map((hari) => (
          <View key={hari.value}>
            <TouchableOpacity
              style={[
                styles.menuCard,
                selectedHari === hari.label && styles.cardActive,
              ]}
              onPress={() => {
                router.push({
                  pathname: "jadwal-dokter/jadwal-per-hari",
                  params: {
                    hr: hari.value,
                    hari: hari.label,
                  },
                });
              }}
            >
              <Ionicons name="calendar-outline" size={26} color="#0A7C86" />
              <Text style={styles.cardText}>{hari.label}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F7",
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
    color: "#fff",
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  backButton: {
    position: "absolute",
    left: 14,
    top: 36,
    zIndex: 10,
  },

  content: {
    padding: 14,
  },

  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#0A7C86",
    elevation: 2,
  },

  cardActive: {
    backgroundColor: "#E7F5F6",
  },

  cardText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 14,
    fontWeight: "600",
  },

  errorBox: {
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },

  errorText: {
    color: "#D32F2F",
    fontWeight: "600",
  },

  emptyBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
  },

  emptyText: {
    color: "#666",
    textAlign: "center",
  },
});
