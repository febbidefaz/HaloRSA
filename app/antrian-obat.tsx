import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AntrianObat = {
  tgl: string;
  k: string;
  a: string;
  b: string;
  c: string;
  d: string;
};

export default function AntrianObatScreen() {
  const [data, setData] = useState<AntrianObat | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAntrian = async () => {
    try {
      const res = await fetch(
        "http://app.rsabojonegoro.com:5000/his/new/AntrianKORJ",
      );
      const json = await res.json();
      setData(json?.[0] || null);
    } catch (err) {
      console.log("ERROR ANTRIAN OBAT:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAntrian();

    const timerData = setInterval(loadAntrian, 10000);
    const timerClock = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(timerData);
      clearInterval(timerClock);
    };
  }, []);

  const gridItem = [
    { label: "Obat Racikan", value: data?.a },
    { label: "Obat Non Racikan", value: data?.b },
    { label: "Racikan Asuransi", value: data?.c },
    { label: "Non Racikan Asuransi", value: data?.d },
  ];

  const [now, setNow] = useState(new Date());

  const formatDateTime = (date: Date) => {
    const tanggal = date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const jam = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return `${tanggal} • ${jam}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0A7C86" barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Antrian Obat</Text>
        <Text style={styles.subtitle}>
          Farmasi Rawat Jalan || {formatDateTime(now)}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0A7C86"
          style={{ marginTop: 30 }}
        />
      ) : (
        <View style={styles.content}>
          <Text style={styles.info}>Nomor antrian selesai dilayani</Text>

          {/* 🔥 KASIR (HIGHLIGHT) */}
          <View style={styles.kasirBox}>
            <Text style={styles.kasirLabel}>Kasir</Text>
            <Text style={styles.kasirNumber}>{data?.k || "-"}</Text>
          </View>

          {/* 🔥 GRID */}
          <View style={styles.grid}>
            {gridItem.map((x) => (
              <View key={x.label} style={styles.card}>
                <Text style={styles.label}>{x.label}</Text>
                <Text style={styles.number}>{x.value || "-"}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.footer}>
            Data diperbarui otomatis setiap 10 detik
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF5F5",
  },

  header: {
    backgroundColor: "#0A7C86",
    paddingTop: 38,
    paddingBottom: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  subtitle: {
    color: "#D9FFFF",
    fontSize: 15,
    marginTop: 2,
  },

  content: {
    flex: 1,
    padding: 14,
  },

  info: {
    textAlign: "center",
    fontSize: 14,
    color: "#555",
    marginBottom: 14,
    fontWeight: "600",
  },

  // 🔥 KASIR
  kasirBox: {
    backgroundColor: "#0A7C86",
    borderRadius: 14,
    paddingVertical: 18,
    marginBottom: 14,
    alignItems: "center",
    elevation: 3,
  },

  kasirLabel: {
    color: "#E6FFFF",
    fontSize: 13,
    marginBottom: 4,
  },

  kasirNumber: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "800",
  },

  // 🔥 GRID
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 18,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
  },

  label: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
    fontWeight: "600",
    textAlign: "center",
  },

  number: {
    fontSize: 34,
    color: "#0A7C86",
    fontWeight: "800",
  },

  footer: {
    textAlign: "center",
    color: "#888",
    fontSize: 11,
    marginTop: 6,
  },

  backButton: {
    position: "absolute",
    left: 14,
    top: 50, // sesuaikan dengan paddingTop header
    zIndex: 10,
  },
});
