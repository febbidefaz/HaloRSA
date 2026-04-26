import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
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
    icon: <FontAwesome5 name="notes-medical" size={28} color="#fff" />,
  },
  {
    title: 'Riwayat\npendaftaran',
    bgColor: '#39D0C3',
    icon: <Ionicons name="calendar-outline" size={28} color="#fff" />,
  },
  {
    title: 'Status\nAntrian',
    bgColor: '#F3D75B',
    icon: <MaterialCommunityIcons name="clipboard-list-outline" size={28} color="#fff" />,
  },
  {
    title: 'Konsultasi\nDokter',
    bgColor: '#5DA9FF',
    icon: <FontAwesome5 name="user-md" size={26} color="#fff" />,
  },
  {
    title: 'Kritik dan\nSaran',
    bgColor: '#5D8FEF',
    icon: <MaterialCommunityIcons name="message-text-outline" size={28} color="#fff" />,
  },
  {
    title: 'Informasi dan\nBerita',
    bgColor: '#F26767',
    icon: <Ionicons name="newspaper-outline" size={28} color="#fff" />,
  },
  {
    title: 'Tempat tidur',
    bgColor: '#F3A59B',
    icon: <MaterialCommunityIcons name="bed-outline" size={28} color="#fff" />,
    route: '/bed',
  },
  {
    title: 'Jadwal\nDokter',
    bgColor: '#3A9DEB',
    icon: <Ionicons name="calendar-clear-outline" size={28} color="#fff" />,
    route: '/jadwal-dokter',
  },
  {
    title: 'Pendaftaran\nNomor RM',
    bgColor: '#28B6F6',
    icon: <MaterialCommunityIcons name="cellphone-text" size={28} color="#fff" />,
  },
];

function MenuCard({
  title,
  bgColor,
  icon,
  route,
}: {
  title: string;
  bgColor: string;
  icon: React.ReactNode;
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
      <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>{icon}</View>
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
            source={{
              uri: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1200&auto=format&fit=crop',
            }}
            style={styles.heroBackground}
          />

          <View style={styles.bannerCard}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1200&auto=format&fit=crop',
              }}
              style={styles.bannerImage}
            />

            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTitle}>KELAS IBU DAN YOGA HAMIL</Text>
              <Text style={styles.bannerSubtitle}>Salam Semangat Sehat,</Text>
              <Text style={styles.bannerSubtitle}>...</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <MenuCard
                key={index}
                title={item.title}
                bgColor={item.bgColor}
                icon={item.icon}
                route={item.route}
              />
            ))}
          </View>
        </View>
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
    height: 520,
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
    top: 20,
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
    height: 310,
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
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: CARD_WIDTH,
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 6,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  menuText: {
    textAlign: 'center',
    fontSize: 10,
    color: '#222',
    lineHeight: 14,
    fontWeight: '500',
  },
});