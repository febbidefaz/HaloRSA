import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import logoRSA from "../assets/images/logorsa.png";

const API_SPECIALIST = "http://app.rsabojonegoro.com:5000/his/new/Specialist";

type Klinik = {
  id: number;
  name: string;
  category: string;
  fotoOL: string | null;
  layID: number;
  kdBPJS: string | null;
};

type Dokter = {
  id: number;
  dokter: string;
  spesialis: string;
  sp: number;
};

type JadwalPraktek = {
  id: number;
  dr: number;
  hr: number;
  prak: number;
  jml: number;
  ready: number;
  shift: string;
  status: number;
  ketstatus: string;
  date: string;
};

type Pasien = {
  id: string;
  patientid: string;
  date: string;
  name: string;
  upx: number;
};

export default function PendaftaranScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKlinik, setSelectedKlinik] = useState<Klinik | null>(null);
  const [listKlinik, setListKlinik] = useState<Klinik[]>([]);
  const [loadingKlinik, setLoadingKlinik] = useState(false);
  const [modalDokterVisible, setModalDokterVisible] = useState(false);
  const [listDokter, setListDokter] = useState<Dokter[]>([]);
  const [selectedDokter, setSelectedDokter] = useState<Dokter | null>(null);
  const [loadingDokter, setLoadingDokter] = useState(false);
  const [modalTanggalVisible, setModalTanggalVisible] = useState(false);
  const [modalJamVisible, setModalJamVisible] = useState(false);
  const [listJamPraktek, setListJamPraktek] = useState<JadwalPraktek[]>([]);
  const [selectedJamPraktek, setSelectedJamPraktek] =
    useState<JadwalPraktek | null>(null);
  const [loadingJam, setLoadingJam] = useState(false);
  const [modalPasienVisible, setModalPasienVisible] = useState(false);
  const [noRM, setNoRM] = useState("");
  const [tglLahir, setTglLahir] = useState("");
  const [loadingPasien, setLoadingPasien] = useState(false);
  const [selectedPasien, setSelectedPasien] = useState<Pasien | null>(null);
  const [riwayatPasien, setRiwayatPasien] = useState<Pasien[]>([]);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [googleId, setGoogleId] = useState("");
  const [modalSuksesVisible, setModalSuksesVisible] = useState(false);
  const [buktiDaftar, setBuktiDaftar] = useState<any>(null);
  const params = useLocalSearchParams();

  const getSpecialist = async () => {
    try {
      setLoadingKlinik(true);
      const response = await fetch(API_SPECIALIST);
      const data = await response.json();
      setListKlinik(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Gagal ambil specialist:", error);
    } finally {
      setLoadingKlinik(false);
    }
  };

  const getDokterBySpesialis = async (sp: number) => {
    try {
      setLoadingDokter(true);
      setListDokter([]);

      const response = await fetch(
        `http://app.rsabojonegoro.com:5000/his/new/Specialist/sp?sp=${sp}`,
      );

      const json = await response.json();

      const data = json?._embedded?.dokters || [];

      setListDokter(data);
    } catch (error) {
      console.log("Gagal ambil dokter:", error);
    } finally {
      setLoadingDokter(false);
    }
  };

  const namaHari = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jum'at",
    "Sabtu",
  ];

  const namaBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const getTanggalSeminggu = () => {
    const hasil = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      if (date.getDay() === 0) continue;

      hasil.push({
        label: `${namaHari[date.getDay()]}, ${date.getDate()} ${
          namaBulan[date.getMonth()]
        } ${date.getFullYear()}`,
        value: date.toISOString().split("T")[0],
      });
    }

    return hasil;
  };

  const getKodeHari = (dateValue: string) => {
    const date = new Date(dateValue);
    const day = date.getDay();

    // Minggu = 0, Senin = 1, Selasa = 2, dst
    return day;
  };

  const [selectedTanggal, setSelectedTanggal] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const getJadwalPraktek = async (drId: number, tanggal: string) => {
    try {
      setLoadingJam(true);
      setListJamPraktek([]);

      const hr = getKodeHari(tanggal);

      const response = await fetch(
        `http://app.rsabojonegoro.com:5000/his/reg/jadwaldokterV2/dh?dr=${drId}&hr=${hr}`,
      );

      const json = await response.json();

      const data = json?._embedded?.jadwalDokterPrakV2s || [];

      setListJamPraktek(data);
    } catch (error) {
      console.log("Gagal ambil jadwal praktek:", error);
    } finally {
      setLoadingJam(false);
    }
  };

  const loadRiwayatPasien = async () => {
    const saved = await AsyncStorage.getItem("RIWAYAT_PASIEN");
    if (saved) {
      setRiwayatPasien(JSON.parse(saved));
    }
  };

  const simpanPasienKeHp = async (pasien: Pasien) => {
    const saved = await AsyncStorage.getItem("RIWAYAT_PASIEN");
    const lama: Pasien[] = saved ? JSON.parse(saved) : [];

    const sudahAda = lama.some((x) => x.patientid === pasien.patientid);

    const dataBaru = sudahAda ? lama : [pasien, ...lama];

    await AsyncStorage.setItem("RIWAYAT_PASIEN", JSON.stringify(dataBaru));
    setRiwayatPasien(dataBaru);
  };

  const cekPasien = async () => {
    try {
      setLoadingPasien(true);

      const response = await fetch(
        "http://app.rsabojonegoro.com:5000/his/new/CekPxV2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientid: noRM,
            date: convertTanggalApi(tglLahir),
          }),
        },
      );

      const json = await response.json();

      if (json?.metadata?.code === 200) {
        const pasien = json.response;

        setSelectedPasien(pasien);
        await simpanPasienKeHp(pasien);

        setNoRM("");
        setTglLahir("");
        setModalPasienVisible(false);
      } else {
        setErrorMessage(
          json?.metadata?.message ||
            "Nomor rekam medis atau tanggal lahir ada yang salah",
        );
        setModalErrorVisible(true);
      }
    } catch (error) {
      console.log("Gagal cek pasien:", error);

      setErrorMessage("Gagal terhubung ke server. Silakan coba lagi.");
      setModalErrorVisible(true);
    } finally {
      setLoadingPasien(false);
    }
  };

  const formatNoRM = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 6);

    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4)
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;

    return `${cleaned.slice(0, 2)}.${cleaned.slice(
      2,
      4,
    )}.${cleaned.slice(4, 6)}`;
  };

  const formatTanggal = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 8);

    if (cleaned.length <= 2) return cleaned;

    if (cleaned.length <= 4)
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;

    return `${cleaned.slice(0, 2)}-${cleaned.slice(
      2,
      4,
    )}-${cleaned.slice(4, 8)}`;
  };

  const convertTanggalApi = (tanggal: string) => {
    const parts = tanggal.split("-");

    if (parts.length !== 3) return tanggal;

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const daftarPasien = async () => {
    if (
      !selectedKlinik ||
      !selectedDokter ||
      !selectedTanggal ||
      !selectedJamPraktek ||
      !selectedPasien
    ) {
      setErrorMessage("Data pendaftaran belum lengkap");
      setModalErrorVisible(true);
      return;
    }

    try {
      const payload = {
        userid: googleId,
        sublayanan: selectedKlinik?.name,
        layanan: selectedKlinik?.category,
        tgl: selectedTanggal?.value,
        jampraktek: selectedJamPraktek?.prak,
        register: selectedPasien?.patientid,
        dokterid: selectedDokter?.id,
        ktp: null,
        buktitransfer: null,
        status: 0,
        norujukan: null,
        upx: selectedPasien?.upx,
      };

      const response = await fetch(
        "http://app.rsabojonegoro.com:5000/his/about/newregV2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const json = await response.json();

      if (json?.metadata?.code === 200) {
        const regId = json?.response?.id;

        const reportResponse = await fetch(
          `http://app.rsabojonegoro.com:5000/his/about/newreg/regid?id=${regId}`,
        );

        const reportJson = await reportResponse.json();

        setBuktiDaftar(reportJson);
        setModalSuksesVisible(true);
      } else {
        setErrorMessage(
          json?.metadata?.message || json?.message || "Pendaftaran gagal",
        );
        setModalErrorVisible(true);
      }
    } catch (error) {
      console.log("Gagal daftar:", error);
      setErrorMessage("Gagal terhubung ke server pendaftaran");
      setModalErrorVisible(true);
    }
  };

  const loadGoogleId = async () => {
    const savedGoogleId = await SecureStore.getItemAsync("google_id");

    if (savedGoogleId) {
      setGoogleId(savedGoogleId);
    }
  };
  useEffect(() => {
    if (params.ulang !== "1") return;

    if (params.patientid && params.patientname) {
      setSelectedPasien({
        id: String(params.patientid),
        patientid: String(params.patientid),
        name: String(params.patientname),
        date: "",
        upx: Number(params.upx || 0),
      });
    }

    if (params.klinik) {
      setSelectedKlinik({
        id: Number(params.clinicId || 0),
        name: String(params.klinik),
        category: String(params.layanan || ""),
        fotoOL: null,
        layID: 0,
        kdBPJS: null,
      });
    }

    if (params.dokter) {
      setSelectedDokter({
        id: Number(params.dokterid || 0),
        dokter: String(params.dokter),
        spesialis: String(params.klinik || ""),
        sp: Number(params.clinicId || 0),
      });
    }

    if (params.bukaTanggal === "1") {
      setTimeout(() => {
        setModalTanggalVisible(true);
      }, 500);
    }
  }, [
    params.ulang,
    params.patientid,
    params.patientname,
    params.upx,
    params.klinik,
    params.layanan,
    params.dokter,
    params.dokterid,
    params.clinicId,
    params.bukaTanggal,
  ]);

  useEffect(() => {
    getSpecialist();
    loadGoogleId();
    loadRiwayatPasien();
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

        <Text style={styles.title}>Pendaftaran Rawat Jalan</Text>
        <Text style={styles.subtitle}>Untuk Pasien Umum dan Asuransi</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <FormSelect
            label="Klinik"
            placeholder={selectedKlinik?.name || "Pilih klinik"}
            icon="business-outline"
            onPress={() => setModalVisible(true)}
          />

          <FormSelect
            label="Dokter"
            placeholder={selectedDokter?.dokter || "Pilih dokter"}
            icon="medkit-outline"
            onPress={() => {
              if (!selectedKlinik) {
                alert("Pilih spesialis terlebih dahulu");
                return;
              }

              setModalDokterVisible(true);
            }}
          />

          <FormSelect
            label="Tanggal"
            placeholder={selectedTanggal?.label || "Pilih tanggal kunjungan"}
            icon="calendar-outline"
            onPress={() => setModalTanggalVisible(true)}
          />

          <FormSelect
            label="Jam Praktek"
            placeholder={
              selectedJamPraktek
                ? selectedJamPraktek.shift === "P"
                  ? "Pagi"
                  : "Sore"
                : "Pilih jam praktek"
            }
            icon="time-outline"
            onPress={() => {
              if (!selectedDokter || !selectedTanggal) {
                alert("Pilih dokter dan tanggal terlebih dahulu");
                return;
              }

              setModalJamVisible(true);
              getJadwalPraktek(selectedDokter.id, selectedTanggal.value);
            }}
          />

          <FormSelect
            label="Pasien"
            placeholder={selectedPasien?.name || "Cek data pasien"}
            icon="person-outline"
            onPress={() => setModalPasienVisible(true)}
          />

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={daftarPasien}
          >
            <Text style={styles.buttonText}>Daftar Sekarang</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/*Modal Spesialis*/}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Pilih Spesialis</Text>

            {loadingKlinik ? (
              <ActivityIndicator
                size="large"
                color="#0A7C86"
                style={{ marginTop: 25 }}
              />
            ) : (
              <FlatList
                data={listKlinik}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 430 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.spesialisItem}
                    onPress={async () => {
                      setSelectedKlinik(item);
                      setSelectedDokter(null);
                      setSelectedTanggal(null);
                      setSelectedJamPraktek(null);

                      setModalVisible(false);
                      setModalDokterVisible(true);

                      await getDokterBySpesialis(item.id);
                    }}
                  >
                    <View style={styles.iconCircle}>
                      {item.fotoOL ? (
                        <Image
                          source={{ uri: item.fotoOL }}
                          style={styles.iconImage}
                        />
                      ) : (
                        <Ionicons
                          name="medical-outline"
                          size={22}
                          color="#0A7C86"
                        />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.spesialisText}>{item.name}</Text>
                      <Text style={styles.spesialisCategory}>
                        {item.category?.trim()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/*Modal Dokter*/}
      <Modal visible={modalDokterVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalDokterVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Pilih Dokter</Text>

            {loadingDokter ? (
              <ActivityIndicator
                size="large"
                color="#0A7C86"
                style={{ marginTop: 25 }}
              />
            ) : (
              <FlatList
                data={listDokter}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 430 }}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    Dokter belum tersedia untuk spesialis ini
                  </Text>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.spesialisItem}
                    onPress={() => {
                      setSelectedDokter(item);

                      setModalDokterVisible(false);

                      setTimeout(() => {
                        setModalTanggalVisible(true);
                      }, 300);
                    }}
                  >
                    <Image
                      source={{
                        uri: `http://app.rsabojonegoro.com:1111/foto/dr/${item.id}.jpg`,
                      }}
                      style={styles.dokterImage}
                      resizeMode="cover"
                    />

                    <View style={{ flex: 1 }}>
                      <Text style={styles.spesialisText}>{item.dokter}</Text>
                      <Text style={styles.spesialisCategory}>
                        {item.spesialis}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalDokterVisible(false)}
            >
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/*Modal Tgl*/}
      <Modal visible={modalTanggalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalTanggalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Pilih Tanggal</Text>

            <FlatList
              data={getTanggalSeminggu()}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.spesialisItem}
                  onPress={async () => {
                    setSelectedTanggal(item);
                    setModalTanggalVisible(false);

                    if (selectedDokter) {
                      setModalJamVisible(true);
                      await getJadwalPraktek(selectedDokter.id, item.value);
                    }
                  }}
                >
                  <Ionicons name="calendar-outline" size={28} color="#0A7C86" />

                  <Text style={[styles.spesialisText, { marginLeft: 18 }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalTanggalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/*Modal JamPrak*/}
      <Modal visible={modalJamVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalJamVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalJamBox}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.jamModalTitle}>Pilih Jam Praktek</Text>
            {loadingJam ? (
              <ActivityIndicator size="large" color="#0A7C86" />
            ) : (
              <FlatList
                data={listJamPraktek}
                keyExtractor={(item) => String(item.id)}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    Jadwal praktek tidak tersedia
                  </Text>
                }
                renderItem={({ item }) => {
                  const namaShift = item.shift === "P" ? "Pagi" : "Sore";

                  const statusText =
                    item.status === 1
                      ? "Libur"
                      : item.status === 2
                        ? "Penuh"
                        : item.status === 3
                          ? "Tutup"
                          : "Masuk";

                  return (
                    <TouchableOpacity
                      style={styles.jamRowSingle}
                      activeOpacity={item.status === 4 ? 0.7 : 1}
                      onPress={() => {
                        if (item.status === 4) {
                          setSelectedJamPraktek(item);

                          setModalJamVisible(false);

                          if (params?.ulang !== "1") {
                            setTimeout(() => {
                              setModalPasienVisible(true);
                            }, 300);
                          }
                        }
                      }}
                    >
                      {/* KIRI */}
                      <View style={styles.jamLeft}>
                        <Ionicons
                          name="time-outline"
                          size={24}
                          color="#0A7C86"
                        />

                        <Text style={styles.jamText}>{namaShift}</Text>
                      </View>

                      {/* KANAN */}
                      <View style={styles.jamRightInline}>
                        {item.status === 4 ? (
                          <>
                            <View style={styles.badgeJumlah}>
                              <Text style={styles.badgeText}>
                                jumlah : {item.jml}
                              </Text>
                            </View>

                            <View style={styles.badgeSisa}>
                              <Text style={styles.badgeText}>
                                tersisa : {item.ready}
                              </Text>
                            </View>
                          </>
                        ) : (
                          <View
                            style={
                              item.status === 1
                                ? styles.badgeLibur
                                : item.status === 2
                                  ? styles.badgePenuh
                                  : styles.badgeTutup
                            }
                          >
                            <Text style={styles.badgeText}>{statusText}</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/*Modal Pasien*/}
      <Modal visible={modalPasienVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalPasienVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.inputLabel}>Nomor RM</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nomor RM yang sudah terdaftar"
              value={noRM}
              keyboardType="numeric"
              onChangeText={(text) => {
                setNoRM(formatNoRM(text));
              }}
            />

            <Text style={styles.inputLabel}>Tanggal Lahir</Text>
            <TextInput
              style={styles.textInput}
              placeholder="DD-MM-YYYY"
              value={tglLahir}
              keyboardType="numeric"
              onChangeText={(text) => {
                setTglLahir(formatTanggal(text));
              }}
            />

            <TouchableOpacity
              style={styles.searchButton}
              onPress={cekPasien}
              disabled={loadingPasien}
            >
              <Text style={styles.searchButtonText}>
                {loadingPasien ? "Mencari..." : "🔍 cari pasien"}
              </Text>
            </TouchableOpacity>

            {riwayatPasien.map((item) => (
              <TouchableOpacity
                key={item.patientid}
                style={styles.pasienItem}
                onPress={() => {
                  setSelectedPasien(item);
                  setModalPasienVisible(false);
                }}
              >
                <Text style={styles.pasienText}>
                  {item.patientid} | {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/*Modal daftar NoRM tidak sama TGL lahir*/}
      <Modal visible={modalErrorVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.errorOverlay}
          activeOpacity={1}
          onPress={() => setModalErrorVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.errorBox}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.errorIconCircle}>
              <Text style={styles.errorIcon}>!</Text>
            </View>

            <Text style={styles.errorText}>{errorMessage}</Text>

            <TouchableOpacity
              onPress={() => {
                Linking.openURL("https://wa.me/6285336226116");
              }}
            >
              <Text style={styles.errorLink}>
                Klik di sini jika lupa nomor RM..!!
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.errorButton}
              onPress={() => setModalErrorVisible(false)}
            >
              <Text style={styles.errorButtonText}>Tutup</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/*Modal repon daftar*/}
      <Modal visible={modalSuksesVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalSuksesVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.buktiBox}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.buktiHeader}>
              <Text style={styles.buktiTitle}>Bukti Pendaftaran</Text>

              <TouchableOpacity
                style={styles.batalButton}
                onPress={() => setModalSuksesVisible(false)}
              >
                <Text style={styles.batalButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.qrWrapper}>
              <QRCode
                value={String(buktiDaftar?.idol || buktiDaftar?.id || "")}
                size={180}
                logo={logoRSA}
                logoSize={42}
                logoBackgroundColor="transparent"
              />
            </View>
            <InfoRow label="PIN" value={String(buktiDaftar?.idol || "-")} />
            <InfoRow
              label="No Antrean"
              value={String(buktiDaftar?.pxno || "-")}
            />
            <InfoRow label="No RM" value={selectedPasien?.patientid || "-"} />
            <InfoRow label="Dokter" value={selectedDokter?.dokter || "-"} />
            <InfoRow label="Pasien" value={selectedPasien?.name || "-"} />
            <InfoRow label="Tanggal" value={selectedTanggal?.label || "-"} />
            <InfoRow
              label="Jam praktek"
              value={selectedJamPraktek?.shift === "P" ? "Pagi" : "Sore"}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>

      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function FormSelect({
  label,
  placeholder,
  icon,
  onPress,
}: {
  label: string;
  placeholder: string;
  icon: any;
  onPress?: () => void;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.input}
        activeOpacity={0.8}
        onPress={onPress}
      >
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
  container: { flex: 1, backgroundColor: "#EEF5F5" },

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
    top: 40,
    zIndex: 10,
  },

  title: { color: "#fff", fontSize: 23, fontWeight: "800" },
  subtitle: { color: "#D9FFFF", fontSize: 14, marginTop: 4 },

  content: { padding: 16, marginTop: -8 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    elevation: 4,
  },

  fieldGroup: { marginBottom: 14 },

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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  modalBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    elevation: 8,
    maxHeight: "80%",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0A7C86",
    textAlign: "center",
  },

  modalSubtitle: {
    fontSize: 17,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  modalMenu: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D8E2E3",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "#FAFFFF",
  },

  modalMenuText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#555",
    fontWeight: "700",
  },

  spesialisItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E4",
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  iconImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    resizeMode: "contain",
  },

  spesialisText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "700",
  },

  spesialisCategory: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },

  closeButton: {
    marginTop: 16,
    backgroundColor: "#0A7C86",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },

  closeButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  dokterImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EFEFEF",
    marginRight: 12,
  },

  emptyText: {
    textAlign: "center",
    color: "#777",
    fontSize: 15,
    marginVertical: 24,
  },

  closeJamWrapper: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },

  closeJamButton: {
    backgroundColor: "#F3C15C",
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
  },

  closeJamText: {
    fontSize: 16,
    color: "#6A4A00",
    fontWeight: "700",
  },

  jamItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },

  modalJamBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingTop: 18,
    paddingBottom: 8,
    paddingHorizontal: 16,
    elevation: 10,
  },

  jamModalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0A7C86",
    textAlign: "center",
    marginBottom: 10,
  },

  jamLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  jamText: {
    fontSize: 18,
    color: "#555",
    marginLeft: 10,
    fontWeight: "700",
  },

  badgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  badgeMasuk: {
    backgroundColor: "#2E7D32",
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 5,
  },

  badgeLibur: {
    backgroundColor: "#607D8B",
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 5,
  },

  badgePenuh: {
    backgroundColor: "#C62828",
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 5,
  },

  badgeTutup: {
    backgroundColor: "#D4A017",
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 5,
  },

  badgeJumlah: {
    backgroundColor: "#0A7C86",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    minWidth: 82,
    alignItems: "center",
  },

  badgeSisa: {
    backgroundColor: "#C24A00",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 82,
    alignItems: "center",
  },

  jamRowSingle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },

  jamRightInline: {
    flexDirection: "row",
    alignItems: "center",
  },

  inputLabel: {
    fontSize: 15,
    color: "#666",
    marginBottom: 6,
    fontWeight: "600",
  },

  textInput: {
    borderWidth: 1,
    borderColor: "#D0D8D8",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },

  searchButton: {
    backgroundColor: "#F2A000",
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 16,
  },

  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  pasienItem: {
    borderWidth: 1,
    borderColor: "#0A7C86",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  pasienText: {
    color: "#0A7C86",
    fontSize: 16,
    fontWeight: "600",
  },

  errorOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  errorBox: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
    elevation: 10,
  },

  errorIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F2A500",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },

  errorIcon: {
    color: "#fff",
    fontSize: 56,
    fontWeight: "900",
  },

  errorText: {
    fontSize: 20,
    color: "#666",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 18,
  },

  errorLink: {
    fontSize: 18,
    color: "#0A7C86",
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 24,
  },

  errorButton: {
    backgroundColor: "#0A7C86",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 14,
  },

  errorButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  buktiBox: {
    width: "92%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 18,
    elevation: 10,
  },

  buktiHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#0A7C86",
    paddingBottom: 10,
    marginBottom: 14,
  },

  buktiTitle: {
    fontSize: 20,
    color: "#555",
    fontWeight: "700",
  },

  batalButton: {
    position: "absolute",
    right: 0,
    top: -5,
    backgroundColor: "#A61D2B",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
  },

  batalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  qrWrapper: {
    alignItems: "center",
    marginVertical: 18,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    paddingVertical: 12,
  },

  infoLabel: {
    fontSize: 16,
    color: "#111",
    fontWeight: "800",
  },

  infoValue: {
    fontSize: 16,
    color: "#111",
    flex: 1,
    textAlign: "right",
    marginLeft: 20,
  },
});
