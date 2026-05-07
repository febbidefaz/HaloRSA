import logoRSA from "@/assets/images/logorsa.png";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import QRCode from "react-native-qrcode-svg";

type RiwayatReg = {
  id: number;
  clinic?: string;
  layanan?: string;
  doctorname?: string;
  date: string;
  fotoOL?: string;
  star?: number | null;
  printed?: number; // 👈 tambahkan ini
  kd?: number;
  queue?: number;
  patientid?: string;
  patientname?: string;
  jawal?: string;
  jakhir?: string;
  idol?: number;
};

export default function RiwayatPendaftaran() {
  const [data, setData] = useState<RiwayatReg[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RiwayatReg | null>(null);
  const isLewatHari = (date: string) => {
    const today = new Date();
    const tgl = new Date(date);

    // reset jam biar compare tanggal saja
    today.setHours(0, 0, 0, 0);
    tgl.setHours(0, 0, 0, 0);

    return tgl < today;
  };
  const [ratingModal, setRatingModal] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingText, setRatingText] = useState("");
  const [selectedRatingItem, setSelectedRatingItem] =
    useState<RiwayatReg | null>(null);

  const loadRiwayat = async () => {
    try {
      setLoading(true);

      const googleId = await SecureStore.getItemAsync("google_id");

      const res = await fetch(
        `http://app.rsabojonegoro.com:5000/his/reg/riwayatreg/userid?userid=${googleId}`,
      );

      const json = await res.json();
      setData(json?._embedded?.riwayatRegs || []);
    } catch (err) {
      console.log("ERROR RIWAYAT:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRiwayat();
    }, [])
  );

  //delete
  const handleDelete = () => {
    if (!selectedItem?.idol) {
      ToastAndroid.show("ID pendaftaran tidak ditemukan", ToastAndroid.SHORT);
      return;
    }

    Alert.alert("Konfirmasi", "Yakin ingin membatalkan pendaftaran ini?", [
      { text: "Tidak", style: "cancel" },
      {
        text: "Ya",
        onPress: async () => {
          try {
            const res = await fetch(
              `http://app.rsabojonegoro.com:5000/his/about/deleteReg?regid=${selectedItem.idol}`,
              {
                method: "DELETE",
              },
            );

            console.log("DELETE IDOL:", selectedItem.idol);
            console.log("DELETE STATUS:", res.status);

            ToastAndroid.show("Pendaftaran dibatalkan", ToastAndroid.SHORT);

            setSelectedItem(null);
            loadRiwayat();
          } catch (err) {
            console.log("ERROR DELETE:", err);
            ToastAndroid.show("Gagal membatalkan", ToastAndroid.SHORT);
          }
        },
      },
    ]);
  };

  //Rating
  const disableBatal =
    selectedItem?.printed === 1 ||
    (!!selectedItem?.date && isLewatHari(selectedItem.date));

  const submitRating = async () => {
    if (!selectedRatingItem?.kd) return;

    try {
      const body = {
        kd: selectedRatingItem.kd,
        star: ratingValue,
        ketstar: ratingText,
        tgl: new Date(),
      };

      const res = await fetch(
        "http://app.rsabojonegoro.com:5000/his/reg/newRating",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      console.log("RATING RESPONSE:", await res.text());

      ToastAndroid.show("Rating berhasil dikirim", ToastAndroid.SHORT);

      setRatingModal(false);
      setRatingText("");
      setRatingValue(5);

      loadRiwayat(); // refresh
    } catch (err) {
      console.log(err);
      ToastAndroid.show("Gagal kirim rating", ToastAndroid.SHORT);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#0A7C86" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Riwayat pendaftaran</Text>
          <Text style={styles.subtitle}>semua riwayat pendaftaran pasien</Text>
        </View>
      </View>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#0A7C86"
          style={{ marginTop: 20 }}
        />
      )}

      {!loading && data.length === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Belum ada riwayat pendaftaran.</Text>
        </View>
      )}

      {!loading &&
        data.map((item, index) => {
          const poli = item.clinic || item.layanan?.trim() || "-";
          const dokter = item.doctorname || "-";

          const tanggal = new Date(item.date).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          const image =
            item.fotoOL ||
            "https://cdn-icons-png.flaticon.com/512/387/387569.png";

          const rating = Number(item.star || 0);

          return (
            <TouchableOpacity
              key={item.id || index}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => setSelectedItem(item)}
            >
              <Image source={{ uri: image }} style={styles.image} />

              <View style={styles.info}>
                <Text style={styles.poli}>{poli}</Text>
                <Text style={styles.dokter}>{dokter}</Text>

                <View style={styles.tanggalRow}>
                  <Text style={styles.tanggal}>{tanggal}</Text>

                  <View style={styles.starBox}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Ionicons
                        key={s}
                        name="star"
                        size={15}
                        color={s <= rating ? "#F5A000" : "#777"}
                      />
                    ))}
                  </View>
                </View>

                {item.printed === 1 && (
                  <View style={styles.buttonRow}>
                    {item.star == null && (
                      <TouchableOpacity
                        style={styles.ratingButton}
                        onPress={() => {
                          setSelectedRatingItem(item);
                          setRatingValue(5);
                          setRatingText("Sangat memuaskan.");
                          setRatingModal(true);
                        }}
                      >
                        <Text style={styles.buttonText}>Tambah rating</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.daftarButton}
                      onPress={() => {
                        router.push({
                          pathname: "/pendaftaran",
                          params: {
                            ulang: "1",
                            bukaTanggal: "1",
                            patientid: item.patientid || "",
                            patientname: item.patientname || "",
                            upx: String(item.upx || ""),
                            klinik: item.clinic || "",
                            layanan: item.layanan || "",
                            dokter: item.doctorname || "",
                            dokterid: String(
                              item.dokterid || item.iddokter || "",
                            ),
                            clinicId: String(
                              item.sublayananId || item.idspesialis || "",
                            ),
                          },
                        });
                      }}
                    >
                      <Text style={styles.buttonText}>Daftar ulang</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

      <Modal
        isVisible={!!selectedItem}
        onBackButtonPress={() => setSelectedItem(null)}
        onBackdropPress={() => setSelectedItem(null)}
        backdropColor="#ffffff"
        backdropOpacity={0.35}
      >
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedItem(null)}>
              <Text style={styles.modalTitle}>Tutup</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              disabled={disableBatal}
              style={[
                styles.closeButton,
                disableBatal && styles.closeButtonDisabled,
              ]}
            >
              <Text style={styles.closeText}>Batal</Text>
            </TouchableOpacity>
          </View>

          {disableBatal && (
            <Text style={styles.disableInfo}>
              Tidak dapat dibatalkan karena sudah lewat hari atau sudah
              diproses.
            </Text>
          )}

          {selectedItem && (
            <>
              <View style={styles.qrBox}>
                <QRCode
                  value={String(selectedItem.kd || selectedItem.id)}
                  size={150}
                  logo={logoRSA}
                  logoSize={30}
                  logoBackgroundColor="#fff"
                  logoMargin={3}
                  logoBorderRadius={35}
                />
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>PIN</Text>
                <Text style={styles.detailValue}>{selectedItem.kd}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Antrian</Text>
                <Text style={styles.detailValue}>{selectedItem.queue}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>No RM</Text>
                <Text style={styles.detailValue}>{selectedItem.patientid}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dokter</Text>
                <Text style={styles.detailValue}>
                  {selectedItem.doctorname}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Pasien</Text>
                <Text style={styles.detailValue}>
                  {selectedItem.patientname}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tanggal</Text>
                <Text style={styles.detailValue}>
                  {new Date(selectedItem.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Jam praktek</Text>
                <Text style={styles.detailValue}>
                  {selectedItem.jawal?.slice(0, 5)} -{" "}
                  {selectedItem.jakhir?.slice(0, 5)}
                </Text>
              </View>
            </>
          )}
        </View>
      </Modal>

      <Modal
        isVisible={ratingModal}
        onBackdropPress={() => setRatingModal(false)}
        onBackButtonPress={() => setRatingModal(false)}
        backdropColor="#ffffff"
        backdropOpacity={0.35}
      >
        <View style={styles.modalBox}>
          {/* BINTANG */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s} onPress={() => setRatingValue(s)}>
                <Ionicons
                  name="star"
                  size={40}
                  color={s <= ratingValue ? "#F5A000" : "#ccc"}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* LABEL */}
          <Text style={{ textAlign: "center", marginBottom: 10 }}>
            {ratingValue === 5
              ? "Sangat baik"
              : ratingValue === 4
                ? "Baik"
                : ratingValue === 3
                  ? "Cukup"
                  : ratingValue === 2
                    ? "Kurang"
                    : "Buruk"}
          </Text>

          {/* INPUT */}
          <TextInput
            placeholder="Tulis komentar..."
            value={ratingText}
            onChangeText={setRatingText}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 10,
              marginBottom: 12,
            }}
            multiline
          />

          {/* SUBMIT */}
          <TouchableOpacity style={styles.submitButton} onPress={submitRating}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
          <Text style={styles.tanggalRating}>
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8F8",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginTop: 5,
    borderRadius: 20,
    padding: 5,

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#eee",
  },

  info: { flex: 1 },

  poli: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0A2E35",
  },

  dokter: {
    fontSize: 15,
    color: "#222",
    marginTop: 2,
  },

  tanggal: {
    fontSize: 14,
    color: "#777",
    flex: 1,
  },

  starBox: {
    flexDirection: "row",
    marginLeft: 8,
    marginTop: -2, // 🔥 ini yang bikin naik
  },

  tanggalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 5,
    gap: 10,
  },

  ratingButton: {
    flex: 1,
    backgroundColor: "#F5A000",
    height: 35,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  daftarButton: {
    flex: 1,
    backgroundColor: "#0A7C86",
    height: 35,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  emptyBox: {
    margin: 16,
    padding: 14,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },

  emptyText: {
    textAlign: "center",
    color: "#666",
  },

  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#0A7C86",
    paddingBottom: 8,
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  closeText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  qrBox: {
    alignItems: "center",
    marginBottom: 18,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E7ECEC",
    paddingVertical: 14,
  },

  detailLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#234",
  },

  detailValue: {
    fontSize: 15,
    color: "#222",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },

  closeButton: {
    backgroundColor: "#A8202D",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },

  closeButtonDisabled: {
    backgroundColor: "#ccc",
  },

  disableInfo: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },

  submitButton: {
    backgroundColor: "#0A7C86",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 5,
    alignItems: "center",
    elevation: 2,
  },

  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  tanggalRating: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 13,
    color: "#666",
  },

  header: {
    backgroundColor: "#0A7C86",
    paddingTop: 30,
    paddingBottom: 5,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",

    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,

    elevation: 8,
  },

  backButton: {
    marginRight: 10,
  },
});
