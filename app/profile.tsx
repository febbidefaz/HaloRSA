import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProfileScreen() {
  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log("Gagal membuka link", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0A6A74" barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile RSA</Text>

        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 18 }}>
        {/* LOGO */}
        <View style={styles.logoWrapper}>
          <Image
            source={require("../assets/images/logorsa.png")}
            style={styles.logo}
          />

          <View style={styles.logoTextWrapper}>
            <Text style={styles.rsName}>RS 'Aisyiyah Bojonegoro</Text>

            <Text style={styles.rsDesc}>
              Cepat Menangani, Ramah Melayani, Dengan Islami
            </Text>
          </View>
        </View>

        {/* ALAMAT */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Alamat</Text>

          <Text style={styles.cardText}>Jl. Hasyim Asyari No.17</Text>
          <Text style={styles.cardText}>Jl. Panglima Sudirman No.48</Text>
          <Text style={styles.cardText}>Kauman, Bojonegoro, Jawa Timur</Text>
        </View>

        {/* SOCIAL MEDIA */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Media Sosial</Text>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openLink("https://wa.me/6285336226116")}
          >
            <MaterialCommunityIcons name="whatsapp" size={24} color="#48df1a" />

            <Text style={styles.socialText}>whatsapp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openLink("https://www.instagram.com/rsabojonegoro")}
          >
            <MaterialCommunityIcons
              name="instagram"
              size={24}
              color="#E4405F"
            />

            <Text style={styles.socialText}>Instagram</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openLink("https://www.facebook.com/rsabojonegoro/")}
          >
            <MaterialCommunityIcons name="facebook" size={24} color="#1877F2" />

            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openLink("https://www.youtube.com/@pkrsrsa8179")}
          >
            <MaterialCommunityIcons name="youtube" size={24} color="#FF0000" />

            <Text style={styles.socialText}>YouTube PKRS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openLink("https://www.youtube.com/@RSATVBojonegoro")}
          >
            <MaterialCommunityIcons name="youtube" size={24} color="#FF0000" />

            <Text style={styles.socialText}>YouTube RSATV</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openLink("https://rsabojonegoro.com/")}
          >
            <MaterialCommunityIcons name="web" size={24} color="#0A6A74" />
            <Text style={styles.socialText}>Website</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() =>
              openLink(
                "https://www.google.com/maps/place/Aisyiyah+Hospital/@-7.1507575,111.8790492,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7781f311e89a91:0x49f79ff386d3b8c2!8m2!3d-7.1507575!4d111.8790492!16s%2Fg%2F1pzt2dyy2",
              )
            }
          >
            <MaterialCommunityIcons
              name="map-marker"
              size={24}
              color="#E53935"
            />
            <Text style={styles.socialText}>Google Maps</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8F8",
  },

  header: {
    backgroundColor: "#0A6A74",
    height: 90,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },

  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginTop: 0,
    marginBottom: 8,
    elevation: 4,
  },

  logo: {
    width: 72,
    height: 72,
    resizeMode: "contain",
  },

  logoTextWrapper: {
    flex: 1,
    marginLeft: 14,
  },
  rsName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0A6A74",
  },

  rsDesc: {
    marginTop: 4,
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 8,

    elevation: 4,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0A6A74",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 24,
  },

  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,

    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  socialText: {
    marginLeft: 14,
    fontSize: 16,
    color: "#222",
    fontWeight: "600",
  },
});
