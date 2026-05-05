import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PendaftaranScreen() {
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

        <Text style={styles.title}>Pendaftaran Pasien</Text>
        <Text style={styles.subtitle}>Layanan pendaftaran rawat jalan</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <FormSelect
            label="Klinik"
            placeholder="Pilih klinik"
            icon="business-outline"
          />
          <FormSelect
            label="Dokter"
            placeholder="Pilih dokter"
            icon="medkit-outline"
          />
          <FormSelect
            label="Tanggal"
            placeholder="Pilih tanggal kunjungan"
            icon="calendar-outline"
          />
          <FormSelect
            label="Jam Praktek"
            placeholder="Pilih jam praktek"
            icon="time-outline"
          />
          <FormSelect
            label="Pasien"
            placeholder="Cek data pasien"
            icon="person-outline"
          />

          <TouchableOpacity style={styles.button} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Daftar Sekarang</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function FormSelect({
  label,
  placeholder,
  icon,
}: {
  label: string;
  placeholder: string;
  icon: any;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.input} activeOpacity={0.8}>
        <View style={styles.inputLeft}>
          <Ionicons name={icon} size={20} color="#0A7C86" />
          <Text style={styles.placeholder}>{placeholder}</Text>
        </View>

        <Ionicons name="chevron-down" size={20} color="#999" />
      </TouchableOpacity>
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
    paddingBottom: 24,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
  },

  backButton: {
    position: "absolute",
    left: 14,
    top: 40,
    zIndex: 10,
  },

  title: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "800",
  },

  subtitle: {
    color: "#D9FFFF",
    fontSize: 14,
    marginTop: 4,
  },

  content: {
    padding: 16,
    marginTop: -8,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    elevation: 4,
  },

  fieldGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    color: "#566",
    marginBottom: 6,
    fontWeight: "700",
  },

  input: {
    borderWidth: 1,
    borderColor: "#D8E2E3",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 12,
    backgroundColor: "#FAFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  inputLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  placeholder: {
    fontSize: 15,
    color: "#667",
    marginLeft: 10,
  },

  button: {
    marginTop: 8,
    backgroundColor: "#0A7C86",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 3,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
