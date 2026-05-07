import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

const menuItems = [
  {
    title: "Pendaftaran",
    bgColor: "#FFA94D",
    image: require("../assets/menu/daftar.png"),
    route: "/pendaftaran",
    // icon: <FontAwesome5 name="notes-medical" size={28} color="#fff" />,
  },
  {
    title: "Riwayat\npendaftaran",
    bgColor: "#39D0C3",
    image: require("../assets/menu/riwayat.png"),
    route: "/riwayat-pendaftaran",
    // icon: <Ionicons name="calendar-outline" size={28} color="#fff" />,
  },
  {
    title: "Status\nAntrian",
    bgColor: "#F3D75B",
    image: require("../assets/menu/antrian.png"),
    route: "/antrian",
    // icon: <MaterialCommunityIcons name="clipboard-list-outline" size={28} color="#fff" />,
  },
  {
    title: "Konsultasi\nDokter",
    bgColor: "#5DA9FF",
    image: require("../assets/menu/konsul.png"),
    route: "/konsultasi",
    // icon: <FontAwesome5 name="user-md" size={26} color="#fff" />,
  },
  {
    title: "Kritik dan\nSaran",
    bgColor: "#5D8FEF",
    image: require("../assets/menu/kritik.png"),
    route: "/kritik-saran",
    // icon: <MaterialCommunityIcons name="message-text-outline" size={28} color="#fff" />,
  },
  {
    title: "Informasi dan\nBerita",
    bgColor: "#F26767",
    image: require("../assets/menu/berita.png"),
    route: "/berita",
    // icon: <Ionicons name="newspaper-outline" size={28} color="#fff" />,
  },
  {
    title: "Tempat tidur",
    bgColor: "#F3A59B",
    image: require("../assets/menu/tt.png"),
    //  icon: <MaterialCommunityIcons name="bed-outline" size={28} color="#fff" />,
    route: "/bed",
  },
  {
    title: "Jadwal\nDokter",
    bgColor: "#3A9DEB",
    image: require("../assets/menu/jadwal.png"),
    //  icon: <Ionicons name="calendar-clear-outline" size={28} color="#fff" />,
    route: "/jadwal-dokter",
  },
  {
    title: "Pendaftaran\nNomor RM",
    bgColor: "#28B6F6",
    image: require("../assets/menu/rm.png"),
    route: "/daftar-no-rm",
    // icon: <MaterialCommunityIcons name="cellphone-text" size={28} color="#fff" />,
  },
  {
    title: "Antrian\nObat",
    bgColor: "#28B6F6",
    image: require("../assets/menu/obat.png"),
    route: "/antrian-obat",
    // icon: <MaterialCommunityIcons name="cellphone-text" size={28} color="#fff" />,
  },
];

function MenuCard({
  title,
  image,
  route,
}: {
  title: string;
  image: any;
  route?: string;
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.8}
      onPress={() => {
        if (route) {
          router.push(route);
        }
      }}
    >
      <Image source={image} style={styles.menuIcon} />
      <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slides, setSlides] = useState<any[]>([]);
  const { width } = Dimensions.get("window");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const init = async () => {
      const id = await SecureStore.getItemAsync("google_id");

      if (!id) {
        router.replace("/login");
        return;
      }

      const n = await SecureStore.getItemAsync("google_name");
      if (n) setName(n);

      setLoading(false);
    };

    init();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("google_id");
    await SecureStore.deleteItemAsync("google_name");
    await SecureStore.deleteItemAsync("google_email");
    await SecureStore.deleteItemAsync("google_photo");

    router.replace("/login");
  };

  const loadSlide = async () => {
    try {
      const res = await fetch(
        "http://app.rsabojonegoro.com:5000/his/about/slide",
      );
      // console.log('status slide:', res.status);
      const json = await res.json();

      setSlides(json?._embedded?.slides || []);
    } catch (err) {
      console.log("error slide:", err);
    }
  };

  useEffect(() => {
    loadSlide();
  }, []);

  const renderItem = ({ item }: any) => {
    const imageUrl = `http://app.rsabojonegoro.com:1111/api_berita/uploads/${item.fotojudul}`;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.bannerCard}
        onPress={() =>
          router.push({
            pathname: "/berita-detail",
            params: { id: item.id },
          })
        }
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.bannerImage}
          resizeMode="cover"
          onError={(e) => console.log("image error:", e.nativeEvent.error)}
        />

        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle} numberOfLines={2}>
            {item.judul}
          </Text>

          <Text style={styles.bannerSubtitle} numberOfLines={2}>
            {item.isi?.replace(/<[^>]*>/g, "").split("\r\n")[0]}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return null;

  return (
    <ImageBackground
      source={require("../assets/images/jr2.jpeg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <BlurView intensity={60} style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>Portal RSA Bojonegoro</Text>
                <Text style={{ fontSize: 12, color: "#555" }}>
                  Halo, {name || "User"}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  style={{ marginRight: 0 }}
                  onPress={() => router.push("/profile")}
                >
                  <MaterialCommunityIcons
                    name="account-circle-outline"
                    size={30}
                    color="#0A6A74"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.heroWrapper}>
              <Carousel
                width={width}
                height={260}
                data={slides}
                autoPlay
                loop
                onSnapToItem={(index) => setActiveIndex(index)}
                renderItem={({ item }) => renderItem({ item })}
              />

              <View style={styles.dotContainer}>
                {slides.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      activeIndex === index && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </View>

            <View style={styles.menuContainer}>
              <View style={styles.menuInner}>
                <View style={styles.menuGrid}>
                  {menuItems.map((item, index) => (
                    <MenuCard
                      key={index}
                      title={item.title}
                      image={item.image}
                      route={item.route}
                    />
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </BlurView>
    </ImageBackground>
  );
}

const HORIZONTAL_PADDING = 16;
const GAP = 12;
const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - GAP * 3) / 4;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 34,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    // 🔥 lengkung halus
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,

    // 🔥 biar tetap hidup (tidak flat)
    elevation: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0A6A74", // warna utama RSA
  },

  userText: {
    fontSize: 13,
    color: "#667",
    marginTop: 4,
  },
  heroWrapper: {
    height: 290,
    marginTop: 4,
    marginBottom: 0,
    justifyContent: "center",
  },
  heroBackground: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.95,
  },
  bannerCard: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },

  bannerImage: {
    width: "100%",
    height: 260,
    resizeMode: "cover",
  },
  bannerOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  bannerSubtitle: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
  // Menu Bawah
  menuContainer: {
    marginTop: 0,
    paddingHorizontal: 12,
  },
  menuInner: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 10,

    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },

  menuItem: {
    width: "25%",
    alignItems: "center",
    marginBottom: 16,
  },
  menuText: {
    textAlign: "center",
    fontSize: 12,
    color: "#222",
    lineHeight: 15,
    fontWeight: "600",
    marginTop: 6,
  },
  menuIcon: {
    width: 75,
    height: 75,
    resizeMode: "contain",
    marginBottom: 6,
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F5F7FA", // abu soft
    justifyContent: "center",
    alignItems: "center",

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ccc",
    marginHorizontal: 3,
  },

  activeDot: {
    backgroundColor: "#0A7C86",
    width: 10,
  },
});
