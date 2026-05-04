import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView, StatusBar, StyleSheet,
  Switch,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';

export default function KritikSaran() {
  const [nama, setNama] = useState('');
  const [kota, setKota] = useState('');
  const [telp, setTelp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [pelayanan, setPelayanan] = useState('');
  const [perawatan, setPerawatan] = useState('');
 const [sumber, setSumber] = useState<number | null>(null);
  const [saran, setSaran] = useState('');
  const [petugas, setPetugas] = useState('');

  const [rekomendasi, setRekomendasi] = useState(true);

  const [waktutunggu, setWaktutunggu] = useState(5);
  const [keramahanpetugas, setKeramahanpetugas] = useState(5);
  const [kemudahan, setKemudahan] = useState(5);
  const [kebersihan, setKebersihan] = useState(5);
  const [keamanan, setKeamanan] = useState(5);
  const [pelayananAll, setPelayananAll] = useState(5);

  const [errors, setErrors] = useState<any>({});
  const [listPelayanan, setListPelayanan] = useState<any[]>([]);
  const [showPelayananModal, setShowPelayananModal] = useState(false);

  const [listUnit, setListUnit] = useState<any[]>([]);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [loadingUnit, setLoadingUnit] = useState(false);
  const [openUnitAfterLoad, setOpenUnitAfterLoad] = useState(false);

  const scrollAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const sumberOptions = [
    { label: 'Teman', value: 1 },
    { label: 'Keluarga', value: 2 },
    { label: 'Faskes', value: 3 },
    { label: 'Asuransi', value: 4 },
    { label: 'Website', value: 5 },
    { label: 'Lainnya', value: 6 },
  ];
  const [showSumberModal, setShowSumberModal] = useState(false);

  const StarRating = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (v: number) => void;
  }) => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((s) => (
        <TouchableOpacity
          key={s}
          onPress={() => onChange(s)}
          activeOpacity={0.6}
          style={styles.starButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={s <= value ? 'star' : 'star-outline'}
            size={32}
            color={s <= value ? '#F5A000' : '#ccc'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  useEffect(() => {
    const loadPelayanan = async () => {
      try {
        const res = await fetch(
          'http://app.rsabojonegoro.com:5000/his/about/pelayanan'
        );

        const json = await res.json();
        setListPelayanan(json?._embedded?.pelayanans || []);
      } catch (err) {
        console.log('ERROR PELAYANAN:', err);
        setListPelayanan([]);
      }
    };

    loadPelayanan();
  }, []);

  useEffect(() => {
    const loadUnitByPelayanan = async () => {
      if (!pelayanan) {
        setListUnit([]);
        setPerawatan('');
        return;
      }

      try {
        setLoadingUnit(true);

        const res = await fetch(
          `http://app.rsabojonegoro.com:5000/his/about/unit/pelayanan?pelayanan=${pelayanan}`
        );

        const json = await res.json();
        const units = json?._embedded?.units || [];

        setListUnit(units);
        setPerawatan('');

        if (openUnitAfterLoad) {
          setShowUnitModal(true);
          setOpenUnitAfterLoad(false);
        }
      } catch (err) {
        console.log('ERROR UNIT:', err);
        setListUnit([]);
        setPerawatan('');
      } finally {
        setLoadingUnit(false);
      }
    };

    loadUnitByPelayanan();
  }, [pelayanan, openUnitAfterLoad]);

  useEffect(() => {
    let anim: any;

    if (showUnitModal) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(scrollAnim, {
            toValue: 15,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scrollAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      anim.start();
    }

    return () => {
      if (anim) anim.stop();
    };
  }, [showUnitModal, scrollAnim]);

  const submitSurvey = async () => {
    const newErrors: any = {};

    if (!kota) newErrors.kota = true;
    if (!telp) newErrors.telp = true;
    if (!alamat) newErrors.alamat = true;
    if (!pelayanan) newErrors.pelayanan = true;
    if (!perawatan) newErrors.perawatan = true;
    if (!sumber) newErrors.sumber = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Alert.alert('Perhatian', 'Mohon lengkapi data yang wajib diisi.');
      return;
    }

    try {
      const body = {
        tgl: new Date(),
        nama,
        alamat,
        kota,
        telp,
        jenispelayanan: Number(pelayanan),
        unitperawatan: Number(perawatan),
        sumberinformasi: Number(sumber),
        waktutunggu,
        keramahanpetugas,
        kemudahan,
        kebersihan,
        keamanan,
        pelayanan: pelayananAll,
        rekomendasi: rekomendasi ? 1 : 0,
        saran: saran || '-',
        petugas: petugas || '-',
      };

      const res = await fetch(
        'http://app.rsabojonegoro.com:5000/his/about/newsurvey',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      console.log('SURVEY STATUS:', res.status);
      console.log('SURVEY RESPONSE:', await res.text());

      Alert.alert(
        'Berhasil',
        'Terima kasih, kritik dan saran berhasil dikirim',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/home'),
          },
        ]
      );
    } catch (err) {
      console.log('ERROR SURVEY:', err);
      ToastAndroid.show('Gagal mengirim kritik dan saran', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0A7C86" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Kritik dan Saran</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>*DATA DIRI</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama lengkap"
          value={nama}
          onChangeText={setNama}
        />

        <Text style={styles.label}>Kota</Text>
        <TextInput
          style={[styles.input, errors.kota && styles.inputError]}
          placeholder="Masukkan asal kota"
          value={kota}
          onChangeText={(text) => {
            setKota(text);
            setErrors({ ...errors, kota: false });
          }}
        />

        <Text style={styles.label}>Telephone</Text>
        <TextInput
          style={[styles.input, errors.telp && styles.inputError]}
          placeholder="Masukkan nomor telephone"
          value={telp}
          keyboardType="phone-pad"
          onChangeText={(text) => {
            setTelp(text);
            setErrors({ ...errors, telp: false });
          }}
        />

        <Text style={styles.label}>Pelayanan</Text>
        <TouchableOpacity
          style={[styles.input, errors.pelayanan && styles.inputError]}
          onPress={() => setShowPelayananModal(true)}
        >
          <Text style={{ color: pelayanan ? '#111' : '#777' }}>
            {pelayanan
              ? listPelayanan.find((x) => String(x.kode) === pelayanan)?.nama
              : 'Pilih pelayanan'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Perawatan</Text>
        <TouchableOpacity
          style={[styles.input, errors.perawatan && styles.inputError]}
          onPress={() => {
            if (!pelayanan) {
              Alert.alert('Perhatian', 'Pilih pelayanan terlebih dahulu');
              return;
            }
            setShowUnitModal(true);
          }}
        >
          <Text style={{ color: perawatan ? '#111' : '#777' }}>
            {perawatan
              ? listUnit.find((x) => String(x.kode) === perawatan)?.nama
              : loadingUnit
              ? 'Memuat data perawatan...'
              : 'Pilih Perawatan'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Sumber Informasi</Text>
        <TouchableOpacity
          style={[styles.input, errors.sumber && styles.inputError]}
          onPress={() => setShowSumberModal(true)}
        >
          <Text style={{ color: sumber ? '#111' : '#777' }}>
            {sumber
            ? sumberOptions.find((x) => x.value === sumber)?.label
            : 'Pilih sumber informasi'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Alamat</Text>
        <TextInput
          style={[styles.input, errors.alamat && styles.inputError]}
          placeholder="Masukkan alamat"
          value={alamat}
          onChangeText={(text) => {
            setAlamat(text);
            setErrors({ ...errors, alamat: false });
          }}
        />

        <Text style={styles.sectionTitle}>*PENILAIAN</Text>

        <Text style={styles.label}>Waktu tunggu pelayanan</Text>
        <StarRating value={waktutunggu} onChange={setWaktutunggu} />

        <Text style={styles.label}>Keramahan petugas pelayanan</Text>
        <StarRating value={keramahanpetugas} onChange={setKeramahanpetugas} />

        <Text style={styles.label}>Kemudahan dalam pelayanan administrasi</Text>
        <StarRating value={kemudahan} onChange={setKemudahan} />

        <Text style={styles.label}>
          Kebersihan, kerapian dan kenyamanan ruangan pemeriksaan
        </Text>
        <StarRating value={kebersihan} onChange={setKebersihan} />

        <Text style={styles.label}>
          Keamanan dan keselamatan pasien selama pelayanan
        </Text>
        <StarRating value={keamanan} onChange={setKeamanan} />

        <Text style={styles.label}>Pelayanan kami secara keseluruhan</Text>
        <StarRating value={pelayananAll} onChange={setPelayananAll} />

        <Text style={styles.sectionTitle}>*KRITIK DAN SARAN</Text>

        <View style={styles.switchBox}>
          <Text style={styles.switchText}>
            Apakah anda akan merekomendasikan pelayanan kesehatan kami kepada
            orang lain?
          </Text>
          <Switch value={rekomendasi} onValueChange={setRekomendasi} />
        </View>

        <Text style={styles.label}>
          Keluhan dan saran anda terhadap pelayanan kami yang kurang dan harus
          diperbaiki
        </Text>
        <TextInput
          style={styles.textArea}
          placeholder="Ketikkan saran dan masukan"
          value={saran}
          onChangeText={setSaran}
          multiline
        />

        <Text style={styles.label}>
          Apakah ada petugas kami yang memberikan pelayanan memuaskan?
        </Text>
        <TextInput
          style={styles.textArea}
          placeholder="Ketikkan nama petugas tersebut"
          value={petugas}
          onChangeText={setPetugas}
          multiline
        />

        <TouchableOpacity style={styles.submitButton} onPress={submitSurvey}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modal Pelayanan */}
      {showPelayananModal && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPelayananModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowPelayananModal(false)}>
                <Text style={styles.modalClose}>Tutup</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Pilih Pelayanan</Text>
            </View>

            <ScrollView>
              {listPelayanan.map((item) => (
                <TouchableOpacity
                  key={item.id || item.kode}
                  style={styles.modalItem}
                  onPress={() => {
                    setPelayanan(String(item.kode));
                    setPerawatan('');
                    setErrors({ ...errors, pelayanan: false });
                    setShowPelayananModal(false);
                    setOpenUnitAfterLoad(true);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.nama}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Modal Perawatan */}
      {showUnitModal && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowUnitModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBoxLarge}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeaderBetween}>
              <TouchableOpacity onPress={() => setShowUnitModal(false)}>
                <Text style={styles.modalClose}>Tutup</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowUnitModal(false)}>
                <Text style={styles.modalClose}>Next</Text>
              </TouchableOpacity>
            </View>

          <View style={styles.scrollArea}>
            <Animated.ScrollView
              style={styles.modalScrollLarge}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
            >
              {listUnit.map((item) => (
                <TouchableOpacity
                  key={item.kode}
                  style={styles.modalItem}
                  onPress={() => {
                  setPerawatan(String(item.kode));
                  setErrors({ ...errors, perawatan: false });
                  setShowUnitModal(false);

                  setTimeout(() => {
                    setShowSumberModal(true);
                  }, 300);
                }}
                >
                  <Text style={styles.modalItemText}>{item.nama}</Text>
                </TouchableOpacity>
              ))}
            </Animated.ScrollView>

            <Animated.View
              style={[
                styles.fakeScrollbar,
                {
                  transform: [
                    {
                      translateY: scrollY.interpolate({
                        inputRange: [0, 600],
                        outputRange: [0, 300],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Modal Sumber Informasi */}
      {showSumberModal && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSumberModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBoxLarge}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeaderBetween}>
              <TouchableOpacity onPress={() => setShowSumberModal(false)}>
                <Text style={styles.modalClose}>Tutup</Text>
              </TouchableOpacity>

            </View>

            <ScrollView>
              {sumberOptions.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.modalItem}
                  onPress={() => {
                    setSumber(item.value);
                    setErrors({ ...errors, sumber: false });
                    setShowSumberModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    backgroundColor: '#0A7C86',
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    marginRight: 8,
  },

  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginRight: 35,
  },

  content: {
    paddingHorizontal: 8,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0A7C86',
    marginTop: 8,
    marginBottom: 4,
  },

  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },

  input: {
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 6,
    fontSize: 14,
    backgroundColor: '#fff',
  },

  starRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#0A7C86',
    paddingBottom: 5,
    marginBottom: 8,
  },

  switchBox: {
    backgroundColor: '#BDEFD9',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  switchText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
  },

  textArea: {
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderRadius: 3,
    padding: 10,
    minHeight: 90,
    textAlignVertical: 'top',
    marginBottom: 8,
  },

  submitButton: {
    backgroundColor: '#0A7C86',
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 4,
  },

  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
  },

  starButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },

  inputError: {
    borderColor: 'red',
    borderWidth: 1.5,
  },

  optionBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },

  optionButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },

  optionButtonActive: {
    backgroundColor: '#0A7C86',
    borderColor: '#0A7C86',
  },

  optionText: {
    color: '#555',
    fontSize: 13,
  },

  optionTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#fff',
    height: 48,
    justifyContent: 'center',
  },

  picker: {
    height: 48,
    color: '#000',
    backgroundColor: '#fff',
  },

  modalOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    maxHeight: '78%',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#0A7C86',
    paddingBottom: 10,
    marginBottom: 8,
  },

  modalClose: {
    color: '#0A7C86',
    fontSize: 16,
    fontWeight: '700',
  },

  modalTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginRight: 40,
  },

  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  modalItemText: {
    fontSize: 16,
    color: '#111',
  },

  modalScroll: {
    maxHeight: 360,
    paddingRight: 20,
  },

  modalBoxLarge: {
  backgroundColor: '#fff',
  borderRadius: 6,
  paddingHorizontal: 16,
  paddingTop: 12,
  paddingBottom: 8,
  maxHeight: '70%',
  width: '100%',
},

modalHeaderBetween: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottomWidth: 1,
  borderBottomColor: '#0A7C86',
  paddingBottom: 10,
},

scrollArea: {
  height: 520,
  position: 'relative',
},

modalScrollLarge: {
  height: 520,
  paddingRight: 20,
},

fakeScrollbar: {
  position: 'absolute',
  right: 2,
  top: 10,
  width: 5,
  height: 150,
  borderRadius: 10,
  backgroundColor: '#9E9E9E',
  opacity: 0.8,
},


});