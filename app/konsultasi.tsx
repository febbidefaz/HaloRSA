import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type WAItem = {
  id: string;
  nowa: string;
  ket: string;
};

export default function KonsultasiScreen() {
  const [data, setData] = useState<WAItem | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWA = async () => {
    try {
      const res = await fetch(      
        "http://app.rsabojonegoro.com:5000/his/new/NoWAAndroid",
      );
      const json = await res.json();

      setData(json[0]); // ambil pertama
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWA();
  }, []);

  const openWA = () => {
    if (!data?.nowa) return;

    const message = encodeURIComponent(
      "Assalamu’alaikum wr. wb, saya ingin konsultasi dokter di RS Aisyiyah Bojonegoro",
    );

    const url = `https://wa.me/${data.nowa}?text=${message}`;

    Linking.openURL(url);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0A7C86" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0A7C86" barStyle="light-content" />
      {/* HEADER */}
      <View style={styles.header}>
  <TouchableOpacity
    onPress={() => router.back()}
    style={styles.backButton}
  >
   <Ionicons name="chevron-back" size={30} color="#fff" />
  </TouchableOpacity>

  <View style={styles.headerCenter}>
    <Text style={styles.title}>Konsultasi Dokter</Text>

 
  </View>
</View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.desc}>
          Konsultasi langsung dengan RSA Bojonegoro melalui WhatsApp
        </Text>

        <TouchableOpacity style={styles.button} onPress={openWA}>
          <Text style={styles.buttonText}>Chat WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#0A7C86",
    paddingTop: 38,
    paddingBottom: 12,
    paddingHorizontal: 16,
  
    flexDirection: "row",
    alignItems: "center",
  
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  
    elevation: 6,
  },

  backButton: {
    position: "absolute",
    left: 16,
    top: 35,
    zIndex: 10,
  },
  
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  desc: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#25D366",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
