import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { BlurView } from 'expo-blur';
import { ImageBackground } from 'react-native';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const menuItems = [
  {
    title: 'Pendaftaran',
    bgColor: '#FFA94D',
    image: require('../assets/menu/daftar.png'),
   // icon: <FontAwesome5 name="notes-medical" size={28} color="#fff" />,
  },
  {
    title: 'Riwayat\npendaftaran',
    bgColor: '#39D0C3',
    image: require('../assets/menu/riwayat.png'),
   // icon: <Ionicons name="calendar-outline" size={28} color="#fff" />,
  },
  {
    title: 'Status\nAntrian',
    bgColor: '#F3D75B',
    image: require('../assets/menu/antrian.png'),
   // icon: <MaterialCommunityIcons name="clipboard-list-outline" size={28} color="#fff" />,
  },
  {
    title: 'Konsultasi\nDokter',
    bgColor: '#5DA9FF',
    image: require('../assets/menu/konsul.png'),
   // icon: <FontAwesome5 name="user-md" size={26} color="#fff" />,
  },
  {
    title: 'Kritik dan\nSaran',
    bgColor: '#5D8FEF',
    image: require('../assets/menu/kritik.png'),
   // icon: <MaterialCommunityIcons name="message-text-outline" size={28} color="#fff" />,
  },
  {
    title: 'Informasi dan\nBerita',
    bgColor: '#F26767',
    image: require('../assets/menu/berita.png'),
   // icon: <Ionicons name="newspaper-outline" size={28} color="#fff" />,
  },
  {
    title: 'Tempat tidur',
    bgColor: '#F3A59B',
    image: require('../assets/menu/tt.png'),
  //  icon: <MaterialCommunityIcons name="bed-outline" size={28} color="#fff" />,
    route: '/bed',
  },
  {
    title: 'Jadwal\nDokter',
    bgColor: '#3A9DEB',
    image: require('../assets/menu/jadwal.png'),
  //  icon: <Ionicons name="calendar-clear-outline" size={28} color="#fff" />,
    route: '/jadwal-dokter',
  },
  {
    title: 'Pendaftaran\nNomor RM',
    bgColor: '#28B6F6',
    image: require('../assets/menu/rm.png'),
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
    const [name, setName] = useState('');
  
    useEffect(() => {
        const init = async () => {
          const id = await SecureStore.getItemAsync('google_id');
      
          if (!id) {
            router.replace('/login');
            return;
          }
      
          const n = await SecureStore.getItemAsync('google_name');
          if (n) setName(n);
      
          setLoading(false);
        };
      
        init();
      }, []);
  
    const handleLogout = async () => {
      await SecureStore.deleteItemAsync('google_id');
      await SecureStore.deleteItemAsync('google_name');
      await SecureStore.deleteItemAsync('google_email');
      await SecureStore.deleteItemAsync('google_photo');
  
      router.replace('/login');
    };
    if (loading) return null;
  
    return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <View>
                <Text style={styles.headerTitle}>Portal RSA Bojonegoro</Text>
                <Text style={{ fontSize: 12, color: '#555' }}>
                Halo, {name || 'User'}
                </Text>
            </View>

            <TouchableOpacity onPress={handleLogout}>
                <MaterialCommunityIcons name="logout" size={26} color="#0A6A74" />
            </TouchableOpacity>
        </View>

        <View style={styles.heroWrapper}>
            <Image
              source={require('../assets/images/jr1.jpeg')} // masukkan foto RS di assets
              style={styles.heroBackground}
            />
    
          <BlurView intensity={70} tint="light" style={styles.menuBlur}></BlurView>
          <View style={styles.bannerCard}>
            <Image
              source={require('../assets/images/jr2.jpeg')} 
              style={styles.bannerImage}
            />

            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTitle}>KELAS IBU DAN YOGA HAMIL</Text>
              <Text style={styles.bannerSubtitle}>Salam Semangat Sehat,</Text>
              <Text style={styles.bannerSubtitle}>...</Text>
            </View>
          </View>
        </View>

        <ImageBackground
          source={require('../assets/images/jr2.jpeg')}
          style={styles.menuContainer}
          imageStyle={{ borderTopLeftRadius: 22, borderTopRightRadius: 22 }}
        >
          <BlurView intensity={50} style={styles.menuBlur}>
            
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

          </BlurView>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
    
  );
}

const HORIZONTAL_PADDING = 16;
const GAP = 12;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - GAP * 3) / 4;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#0A6A74',
  },
  heroWrapper: {
    position: 'relative',
    height: 280,
    backgroundColor: '#0E7E79',
  },
  heroBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.95,
  },
  bannerCard: {
    position: 'absolute',
    top: 10,
    left: 14,
    right: 14,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  bannerImage: {
    width: '100%',
    height: 230,
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  bannerSubtitle: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  menuContainer: {
    marginTop: -24,
    backgroundColor: '#F4F4F4',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 18,
    paddingHorizontal: 16,
    minHeight: 420,
    overflow: 'hidden',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: CARD_WIDTH,
    alignItems: 'center',
    marginBottom: 14,
    paddingTop: 3,
  },
  menuText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#222',
    lineHeight: 14,
    fontWeight: '650',
  },
  menuIcon: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  menuBlur: {
    flex: 1,
    paddingTop: 18,
    paddingHorizontal: 16,
    //backgroundColor: 'rgba(255,255,255,0.6)', // efek putih samar
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

});