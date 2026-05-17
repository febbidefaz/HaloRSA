import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type PasienRM = {
  id: number;
  nama: string;
  namabin?: string;
  tlahir: string;
  regnum: string;
  userid: string;
  nojkn?: string;
  nik?: string;
  job?: string;
  tlpn?: string;
  addr?: string;
};

export default function PendaftaranRM() {
  const [data, setData] = useState<PasienRM[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PasienRM | null>(null);
  const [showForm, setShowForm] = useState(false);
  const inputRefs = useRef<Record<string, TextInput | null>>({});
  const formListRef = useRef<Animated.FlatList<any> | null>(null);
  const submitButtonRef = useRef<TouchableOpacity | null>(null);

  const convertTanggalApi = (tgl: string) => {
    const parts = tgl.split("-");

    if (parts.length !== 3) return tgl;

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const formatTanggal = (tgl?: string) => {
    if (!tgl) return "-";

    const d = new Date(tgl);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();

    return `${dd}-${mm}-${yy}`;
  };

  const loadData = async () => {
    try {
      setLoading(true);

      const googleId = await SecureStore.getItemAsync("google_id");

      const res = await fetch(
        `https://api.rsabojonegoro.com:5010/his/reg/regpxol/userid?userid=${googleId}`
      );

      const json = await res.json();
      setData(json?._embedded?.regPxOLNews || []);
    } catch (err) {
      console.log("ERROR DATA RM:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  type FormKey =
    | "nik"
    | "nojkn"
    | "nama"
    | "kecamatan"
    | "kelurahan"
    | "alamat"
    | "tlahir"
    | "telepon"
    | "pekerjaan"
    | "suamiistri"
    | "ayah"
    | "pekerjaan_ayah"
    | "goldar"
    | "jk"
    | "status"
    | "suku"
    | "agama"
    | "pendidikan";

  type FormField = {
    key: FormKey;
    label: string;
    placeholder: string;
  };

  const formFields: FormField[] = [
    { key: "nik", label: "NIK", placeholder: "Masukkan NIK" },
    { key: "nojkn", label: "Nomor JKN", placeholder: "Masukkan nomor JKN" },
    { key: "nama", label: "Nama", placeholder: "Masukkan nama lengkap" },
    { key: "kecamatan", label: "Kecamatan", placeholder: "Pilih kecamatan" },
    { key: "kelurahan", label: "Kelurahan", placeholder: "Pilih kelurahan" },
    { key: "alamat", label: "Alamat", placeholder: "Masukkan alamat lengkap" },
    { key: "tlahir", label: "Tanggal Lahir", placeholder: "01-05-2005" },
    { key: "telepon", label: "Telephone", placeholder: "-" },
    { key: "pekerjaan", label: "Pekerjaan", placeholder: "-" },
    { key: "suamiistri", label: "Nama suami / istri", placeholder: "-" },
    { key: "ayah", label: "Ayah", placeholder: "Masukkan nama ayah" },
    { key: "pekerjaan_ayah", label: "Pekerjaan ayah", placeholder: "-" },
    {
      key: "goldar",
      label: "Golongan darah",
      placeholder: "Pilih golongan darah",
    },
    { key: "jk", label: "Jenis Kelamin", placeholder: "Pilih jenis kelamin" },
    { key: "status", label: "Status", placeholder: "Pilih status" },
    { key: "suku", label: "Suku", placeholder: "Pilih suku" },
    { key: "agama", label: "Agama", placeholder: "Pilih agama" },
    {
      key: "pendidikan",
      label: "Pendidikan",
      placeholder: "Pilih pendidikan terakhir",
    },
  ];

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(1);
  const [listHeight, setListHeight] = useState(1);

  const indicatorHeight =
    listHeight >= contentHeight
      ? 0
      : Math.max((listHeight / contentHeight) * listHeight, 35);

  const indicatorTranslateY = scrollY.interpolate({
    inputRange: [0, Math.max(contentHeight - listHeight, 1)],
    outputRange: [0, Math.max(listHeight - indicatorHeight, 1)],
    extrapolate: "clamp",
  });

  const [showGoldar, setShowGoldar] = useState(false);

  const [form, setForm] = useState({
    nik: "",
    nojkn: "",
    nama: "",
    kecamatan: "",
    kelurahan: "",
    alamat: "",
    tlahir: "",
    telepon: "",
    pekerjaan: "",
    suamiistri: "",
    ayah: "",
    pekerjaan_ayah: "",
    goldar: "",
    jk: "",
    status: null as number | null,
    suku: null as number | null,
    agama: null as number | null,
    pendidikan: null as number | null,
  });

  const handleSubmit = async () => {
    try {
      const googleId = await SecureStore.getItemAsync("google_id");

      const payload = {
        nama: form.nama,
        nik: form.nik,
        nojkn: form.nojkn,
        addr: form.alamat,
        kel: form.kelurahan,
        kec: form.kecamatan,
        tlpn: form.telepon,
        tlahir: convertTanggalApi(form.tlahir),
        goldr: form.goldar,
        jk: form.jk,
        job: form.pekerjaan,
        suamiistri: form.suamiistri,
        ayahibu: form.ayah,
        job_ayah: form.pekerjaan_ayah,
        status: form.status,
        suku: form.suku,
        agama: form.agama,
        pend: form.pendidikan,
        statusregpx: 1,
        userid: googleId,
      };

      console.log("PAYLOAD FIX:", payload);

      if (!form.nama || form.nama.length > 30) {
        alert("Nama maksimal 30 karakter");
        return;
      }

      if (!/^\d+$/.test(form.nik)) {
        alert("NIK harus angka");
        return;
      }

      if (!/^\d+$/.test(form.nojkn)) {
        alert("JKN harus angka");
        return;
      }

      const res = await fetch(
        "https://api.rsabojonegoro.com:5010/his/reg/regpxol",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text);
      }

      setShowSuccess(true);
      setShowForm(false);
      loadData();
    } catch (err: any) {
      console.log("ERROR:", err.message);
      alert(err.message);
    }
  };

  const [showJK, setShowJK] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showSuku, setShowSuku] = useState(false);
  const [showAgama, setShowAgama] = useState(false);
  const [showPendidikan, setShowPendidikan] = useState(false);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [kelurahanList, setKelurahanList] = useState<any[]>([]);

  const [showKecamatan, setShowKecamatan] = useState(false);
  const [showKelurahan, setShowKelurahan] = useState(false);

  const [selectedCamatId, setSelectedCamatId] = useState<number | null>(null);
  const [dropdownScrollY] = useState(new Animated.Value(0));
  const [dropdownContentHeight, setDropdownContentHeight] = useState(1);
  const [dropdownHeight, setDropdownHeight] = useState(1);
  const [agamaList, setAgamaList] = useState<any[]>([]);
  const [sukuList, setSukuList] = useState<any[]>([]);
  const [pendidikanList, setPendidikanList] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const loadMasterData = async () => {
    try {
      const [agamaRes, sukuRes, pendidikanRes] = await Promise.all([
        fetch("https://api.rsabojonegoro.com:5010/his/reg/agamaV2"),
        fetch("https://api.rsabojonegoro.com:5010/his/reg/sukuV2"),
        fetch("https://api.rsabojonegoro.com:5010/his/reg/pendidikanV2"),
      ]);

      setAgamaList(await agamaRes.json());
      setSukuList(await sukuRes.json());
      setPendidikanList(await pendidikanRes.json());
    } catch (err) {
      console.log("ERROR MASTER DATA:", err);
    }
  };

  const dropdownIndicatorHeight =
    dropdownHeight >= dropdownContentHeight
      ? 0
      : Math.max((dropdownHeight / dropdownContentHeight) * dropdownHeight, 35);

  const dropdownIndicatorTranslateY = dropdownScrollY.interpolate({
    inputRange: [0, Math.max(dropdownContentHeight - dropdownHeight, 1)],
    outputRange: [0, Math.max(dropdownHeight - dropdownIndicatorHeight, 1)],
    extrapolate: "clamp",
  });

  const loadKecamatan = async () => {
    try {
      const res = await fetch(
        "https://api.rsabojonegoro.com:5010/his/reg/camat"
      );
      const json = await res.json();
      setKecamatanList(json?._embedded?.kecamatans || []);
    } catch (err) {
      console.log("ERROR CAMAT:", err);
    }
  };

  const loadKelurahan = async (camatId: number) => {
    try {
      const res = await fetch(
        `https://api.rsabojonegoro.com:5010/his/reg/lurah?camatid=${camatId}`
      );
      const json = await res.json();
      setKelurahanList(json?._embedded?.kelurahans || []);
    } catch (err) {
      console.log("ERROR LURAH:", err);
    }
  };

  const getStatusReg = (status: number) => {
    switch (status) {
      case 1:
        return {
          text: "NO RM PROSES",
          bg: "#FFF3CD",
          color: "#D98C00",
        };

      case 2:
        return {
          text: "NO RM TERDAFTAR",
          bg: "#D4F8E8",
          color: "#0B8F55",
        };

      case 3:
        return {
          text: "NO RM BARU",
          bg: "#D9ECFF",
          color: "#1565C0",
        };

      default:
        return {
          text: "UNKNOWN",
          bg: "#EEE",
          color: "#666",
        };
    }
  };

  useEffect(() => {
    loadData();
    loadKecamatan();
    loadMasterData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#087987" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Pendaftaran RM</Text>
        <Text style={styles.headerSubtitle}>
          pendaftaran nomor rekam medis online
        </Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setShowForm(true);

          setTimeout(() => {
            inputRefs.current["nik"]?.focus();
          }, 500);
        }}
      >
        <Text style={styles.addButtonText}>Daftar RM Baru</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#087987"
          style={{ marginTop: 30 }}
        />
      ) : (
        <ScrollView>
          {data.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.patientCard}
              activeOpacity={0.8}
              onPress={() => setSelected(item)}
            >
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>
                  {item.namabin || item.nama}
                </Text>

                <Text style={styles.patientText}>
                  Tanggal lahir: {formatTanggal(item.tlahir)}
                </Text>

                <Text style={styles.rmText}>
                  Nomor RM: {item.regnum || "-"}
                </Text>
              </View>

              {(() => {
                const statusInfo = getStatusReg(item.statusregpx);

                return (
                  <View
                    style={[
                      styles.rmButton,
                      {
                        backgroundColor: statusInfo.bg,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.rmButtonText,
                        {
                          color: statusInfo.color,
                        },
                      ]}
                    >
                      {statusInfo.text}
                    </Text>
                  </View>
                );
              })()}
            </TouchableOpacity>
          ))}

          {/*Modal detail RM*/}
          {data.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                Belum ada data pendaftaran RM.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
      {selected && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setSelected(null)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.detailBox}
            onPress={(e) => e.stopPropagation()}
          >
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text style={styles.closeText}>Tutup</Text>
            </TouchableOpacity>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Rekam Medis</Text>
              <Text style={styles.detailValue}>{selected.regnum || "-"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nama</Text>
              <Text style={styles.detailValue}>{selected.nama || "-"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tanggal Lahir</Text>
              <Text style={styles.detailValue}>
                {formatTanggal(selected.tlahir)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>JKN</Text>
              <Text style={styles.detailValue}>{selected.nojkn || "-"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>NIK</Text>
              <Text style={styles.detailValue}>{selected.nik || "-"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pekerjaan</Text>
              <Text style={styles.detailValue}>{selected.job || "-"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Telepon</Text>
              <Text style={styles.detailValue}>{selected.tlpn || "-"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Alamat</Text>
              <Text style={styles.detailValue}>{selected.addr || "-"}</Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Modal Daftar RM Baru */}
      <Modal
        visible={showForm}
        transparent
        animationType="slide"
        onRequestClose={() => setShowForm(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.formOverlay}>
            <Pressable
              style={styles.formBackdrop}
              onPress={() => setShowForm(false)}
            />
            <View style={styles.formBox}>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <Text style={styles.formClose}>Tutup</Text>
              </TouchableOpacity>

              <View style={styles.scrollWrapper}>
                <Animated.FlatList
                  ref={formListRef}
                  data={formFields}
                  keyExtractor={(item) => item.key}
                  style={styles.formScroll}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                  contentContainerStyle={styles.formScrollContent}
                  onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}
                  onContentSizeChange={(_, h) => setContentHeight(h)}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                  )}
                  scrollEventThrottle={16}
                  renderItem={({ item }) => {
                    // Kecamatan
                    if (item.key === "kecamatan") {
                      return (
                        <View>
                          <Text style={styles.label}>{item.label}</Text>

                          <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowKecamatan(true)}
                          >
                            <Text
                              style={{
                                color: form.kecamatan ? "#000" : "#888",
                              }}
                            >
                              {form.kecamatan || item.placeholder}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }

                    // kelurahan
                    if (item.key === "kelurahan") {
                      return (
                        <View>
                          <Text style={styles.label}>{item.label}</Text>

                          <TouchableOpacity
                            style={styles.input}
                            onPress={() => {
                              if (!selectedCamatId) {
                                alert("Pilih kecamatan dulu");
                                return;
                              }
                              setShowKelurahan(true);
                            }}
                          >
                            <Text
                              style={{
                                color: form.kelurahan ? "#000" : "#888",
                              }}
                            >
                              {form.kelurahan || item.placeholder}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }

                    // GOL DARAH
                    if (item.key === "goldar") {
                      return (
                        <View>
                          <Text style={styles.label}>{item.label}</Text>

                          <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowGoldar(true)}
                          >
                            <Text
                              style={{ color: form.goldar ? "#000" : "#888" }}
                            >
                              {form.goldar
                                ? `Gol ${form.goldar}`
                                : item.placeholder}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }

                    //Kelamin
                    if (item.key === "jk") {
                      return (
                        <View>
                          <Text style={styles.label}>{item.label}</Text>

                          <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowJK(true)}
                          >
                            <Text style={{ color: form.jk ? "#000" : "#888" }}>
                              {form.jk
                                ? form.jk === "L"
                                  ? "Laki-laki"
                                  : "Perempuan"
                                : item.placeholder}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }

                    //Status
                    if (item.key === "status") {
                      return (
                        <View>
                          <Text style={styles.label}>{item.label}</Text>

                          <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowStatus(true)}
                          >
                            <Text
                              style={{ color: form.status ? "#000" : "#888" }}
                            >
                              {form.status
                                ? form.status === 1
                                  ? "Kawin"
                                  : form.status === 2
                                  ? "Belum Kawin"
                                  : form.status === 3
                                  ? "Janda"
                                  : "Duda"
                                : item.placeholder}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }

                    //Suku
                    if (item.key === "suku") {
                      return (
                        <View>
                          <Text style={styles.label}>{item.label}</Text>

                          <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowSuku(true)}
                          >
                            <Text
                              style={{ color: form.suku ? "#000" : "#888" }}
                            >
                              {form.suku
                                ? sukuList.find((x) => x.id === form.suku)
                                    ?.suku || item.placeholder
                                : item.placeholder}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }

                    // Agama
                    if (item.key === "agama") {
                      return (
                        <View>
                          <Text style={styles.label}>{item.label}</Text>

                          <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowAgama(true)}
                          >
                            <Text
                              style={{ color: form.agama ? "#000" : "#888" }}
                            >
                              {form.agama
                                ? agamaList.find((x) => x.id === form.agama)
                                    ?.agama || item.placeholder
                                : item.placeholder}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }

                    //Pendidikan
                    if (item.key === "pendidikan") {
                      return (
                        <View>
                          <Text style={styles.label}>{item.label}</Text>

                          <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowPendidikan(true)}
                          >
                            <Text
                              style={{
                                color: form.pendidikan ? "#000" : "#888",
                              }}
                            >
                              {form.pendidikan
                                ? pendidikanList.find(
                                    (x) => x.id === form.pendidikan
                                  )?.edu || item.placeholder
                                : item.placeholder}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }

                    // DEFAULT INPUT
                    return (
                      <View>
                        <Text style={styles.label}>{item.label}</Text>

                        <TextInput
                          ref={(ref) => {
                            inputRefs.current[item.key] = ref;
                          }}
                          style={styles.input}
                          placeholder={item.placeholder}
                          placeholderTextColor="#888"
                          value={String(form[item.key] || "")}
                          returnKeyType="next"
                          blurOnSubmit={false}
                          keyboardType={
                            item.key === "nik" ||
                            item.key === "nojkn" ||
                            item.key === "tlahir" ||
                            item.key === "telepon"
                              ? "number-pad"
                              : "default"
                          }
                          onSubmitEditing={() => {
                            if (item.key === "nik") {
                              inputRefs.current["nojkn"]?.focus();
                            } else if (item.key === "nojkn") {
                              inputRefs.current["nama"]?.focus();
                            } else if (item.key === "nama") {
                              setShowKecamatan(true);
                            } else if (item.key === "alamat") {
                              formListRef.current?.scrollToOffset({
                                offset: 360,
                                animated: true,
                              });

                              setTimeout(() => {
                                inputRefs.current["tlahir"]?.focus();
                              }, 250);
                            } else if (item.key === "tlahir") {
                              inputRefs.current["telepon"]?.focus();
                            } else if (item.key === "telepon") {
                              inputRefs.current["pekerjaan"]?.focus();
                            } else if (item.key === "pekerjaan") {
                              inputRefs.current["suamiistri"]?.focus();
                            } else if (item.key === "suamiistri") {
                              inputRefs.current["ayah"]?.focus();
                            } else if (item.key === "ayah") {
                              inputRefs.current["pekerjaan_ayah"]?.focus();
                              setShowGoldar(true);
                            }
                          }}
                          maxLength={
                            item.key === "nik"
                              ? 16
                              : item.key === "nojkn"
                              ? 13
                              : item.key === "tlahir"
                              ? 10
                              : item.key === "telepon"
                              ? 15
                              : undefined
                          }
                          onChangeText={(text) => {
                            let value = text;

                            if (
                              item.key === "nik" ||
                              item.key === "nojkn" ||
                              item.key === "telepon"
                            ) {
                              value = text.replace(/[^0-9]/g, "");
                            }

                            if (item.key === "tlahir") {
                              value = text.replace(/[^0-9]/g, "").slice(0, 8);

                              if (value.length >= 5) {
                                value = `${value.slice(0, 2)}-${value.slice(
                                  2,
                                  4
                                )}-${value.slice(4)}`;
                              } else if (value.length >= 3) {
                                value = `${value.slice(0, 2)}-${value.slice(
                                  2
                                )}`;
                              }
                            }

                            setForm({
                              ...form,
                              [item.key]: value,
                            });
                          }}
                        />
                      </View>
                    );
                  }}
                  ListFooterComponent={
                    <TouchableOpacity
                      ref={submitButtonRef}
                      style={styles.submitButton}
                      onPress={handleSubmit}
                    >
                      <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                  }
                />

                {indicatorHeight > 0 && (
                  <Animated.View
                    style={[
                      styles.customScrollbar,
                      {
                        height: indicatorHeight,
                        transform: [{ translateY: indicatorTranslateY }],
                      },
                    ]}
                  />
                )}
              </View>
            </View>
            {/*  Modal Kecamatan */}
            {showKecamatan && (
              <Pressable
                style={styles.dropdownOverlay}
                onPress={() => setShowKecamatan(false)}
              >
                <Pressable
                  style={styles.dropdownModal}
                  onPress={(e) => e.stopPropagation()}
                >
                  <View style={styles.dropdownScrollWrapper}>
                    <Animated.ScrollView
                      style={styles.dropdownScroll}
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled={true}
                      scrollEventThrottle={16}
                      onLayout={(e) =>
                        setDropdownHeight(e.nativeEvent.layout.height)
                      }
                      onContentSizeChange={(_, h) =>
                        setDropdownContentHeight(h)
                      }
                      onScroll={Animated.event(
                        [
                          {
                            nativeEvent: {
                              contentOffset: { y: dropdownScrollY },
                            },
                          },
                        ],
                        { useNativeDriver: false }
                      )}
                    >
                      {kecamatanList.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setForm((prev) => ({
                              ...prev,
                              kecamatan: item.kecamatan,
                              kelurahan: "",
                            }));

                            setSelectedCamatId(item.id);
                            setShowKecamatan(false);
                            loadKelurahan(item.id);

                            setTimeout(() => {
                              setShowKelurahan(true);
                            }, 200);
                          }}
                        >
                          <Text style={{ fontSize: 16 }}>{item.kecamatan}</Text>
                        </TouchableOpacity>
                      ))}
                    </Animated.ScrollView>

                    {dropdownIndicatorHeight > 0 && (
                      <Animated.View
                        style={[
                          styles.dropdownCustomScrollbar,
                          {
                            height: dropdownIndicatorHeight,
                            transform: [
                              { translateY: dropdownIndicatorTranslateY },
                            ],
                          },
                        ]}
                      />
                    )}
                  </View>

                  <TouchableOpacity onPress={() => setShowKecamatan(false)}>
                    <Text style={styles.cancelText}>Batal</Text>
                  </TouchableOpacity>
                </Pressable>
              </Pressable>
            )}
            {/*  Modal Kelurahan */}
            {showKelurahan && (
              <Pressable
                style={styles.dropdownOverlay}
                onPress={() => setShowKelurahan(false)}
              >
                <Pressable
                  style={styles.dropdownModal}
                  onPress={(e) => e.stopPropagation()}
                >
                  <View style={styles.dropdownScrollWrapper}>
                    <Animated.ScrollView
                      style={styles.dropdownScroll}
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled={true}
                      scrollEventThrottle={16}
                      onLayout={(e) =>
                        setDropdownHeight(e.nativeEvent.layout.height)
                      }
                      onContentSizeChange={(_, h) =>
                        setDropdownContentHeight(h)
                      }
                      onScroll={Animated.event(
                        [
                          {
                            nativeEvent: {
                              contentOffset: { y: dropdownScrollY },
                            },
                          },
                        ],
                        { useNativeDriver: false }
                      )}
                    >
                      {kelurahanList.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setForm((prev) => ({
                              ...prev,
                              kelurahan: item.lurah,
                            }));

                            setShowKelurahan(false);

                            setTimeout(() => {
                              formListRef.current?.scrollToOffset({
                                offset: 260,
                                animated: true,
                              });

                              setTimeout(() => {
                                inputRefs.current["alamat"]?.focus();
                              }, 250);
                            }, 300);
                          }}
                        >
                          <Text style={{ fontSize: 16 }}>{item.lurah}</Text>
                        </TouchableOpacity>
                      ))}
                    </Animated.ScrollView>

                    {dropdownIndicatorHeight > 0 && (
                      <Animated.View
                        style={[
                          styles.dropdownCustomScrollbar,
                          {
                            height: dropdownIndicatorHeight,
                            transform: [
                              { translateY: dropdownIndicatorTranslateY },
                            ],
                          },
                        ]}
                      />
                    )}
                  </View>

                  <TouchableOpacity onPress={() => setShowKelurahan(false)}>
                    <Text style={styles.cancelText}>Batal</Text>
                  </TouchableOpacity>
                </Pressable>
              </Pressable>
            )}
            {/*  Modal Goldar */}
            {showGoldar && (
              <Pressable
                style={styles.dropdownOverlay}
                onPress={() => setShowGoldar(false)} // klik luar close
              >
                <Pressable
                  style={styles.dropdownModal}
                  onPress={(e) => e.stopPropagation()} // klik dalam tidak close
                >
                  {["A", "B", "AB", "O", "N/A"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setForm((prev) => ({ ...prev, goldar: item }));
                        setShowGoldar(false);

                        setTimeout(() => {
                          setShowJK(true);
                        }, 200);
                      }}
                    >
                      <Text style={{ fontSize: 16, textAlign: "left" }}>
                        {`Gol ${item}`}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity onPress={() => setShowGoldar(false)}>
                    <Text style={styles.cancelText}>Batal</Text>
                  </TouchableOpacity>
                </Pressable>
              </Pressable>
            )}
            {/*  Modal JK */}
            {showJK && (
              <Pressable
                style={styles.dropdownOverlay}
                onPress={() => setShowJK(false)}
              >
                <Pressable
                  style={styles.dropdownModal}
                  onPress={(e) => e.stopPropagation()}
                >
                  {[
                    { label: "Laki-laki", value: "L" },
                    { label: "Perempuan", value: "P" },
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setForm((prev) => ({ ...prev, jk: item.value }));
                        setShowJK(false);

                        setTimeout(() => {
                          setShowStatus(true);
                        }, 200);
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity onPress={() => setShowJK(false)}>
                    <Text style={styles.cancelText}>Batal</Text>
                  </TouchableOpacity>
                </Pressable>
              </Pressable>
            )}
            {/*  Modal status */}
            {showStatus && (
              <Pressable
                style={styles.dropdownOverlay}
                onPress={() => setShowStatus(false)}
              >
                <Pressable
                  style={styles.dropdownModal}
                  onPress={(e) => e.stopPropagation()}
                >
                  {[
                    { label: "Kawin", value: 1 },
                    { label: "Belum Kawin", value: 2 },
                    { label: "Janda", value: 3 },
                    { label: "Duda", value: 4 },
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setForm((prev) => ({ ...prev, status: item.value }));
                        setShowStatus(false);

                        setTimeout(() => {
                          setShowSuku(true);
                        }, 200);
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity onPress={() => setShowStatus(false)}>
                    <Text style={styles.cancelText}>Batal</Text>
                  </TouchableOpacity>
                </Pressable>
              </Pressable>
            )}
            {/*  Modal suku */}
            {showSuku && (
              <Pressable
                style={styles.dropdownOverlay}
                onPress={() => setShowSuku(false)}
              >
                <Pressable
                  style={styles.dropdownModal}
                  onPress={(e) => e.stopPropagation()}
                >
                  <ScrollView style={{ maxHeight: 400 }}>
                    {sukuList.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setForm((prev) => ({ ...prev, suku: item.id }));
                          setShowSuku(false);

                          setTimeout(() => setShowAgama(true), 200);
                        }}
                      >
                        <Text style={{ fontSize: 16 }}>{item.suku}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <TouchableOpacity onPress={() => setShowSuku(false)}>
                    <Text style={styles.cancelText}>Batal</Text>
                  </TouchableOpacity>
                </Pressable>
              </Pressable>
            )}
            {/*  Modal Agama */}
            {showAgama && (
              <Pressable
                style={styles.dropdownOverlay}
                onPress={() => setShowAgama(false)}
              >
                <Pressable style={styles.dropdownModal}>
                  <ScrollView style={{ maxHeight: 400 }}>
                    {agamaList.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setForm((prev) => ({ ...prev, agama: item.id }));
                          setShowAgama(false);

                          setTimeout(() => setShowPendidikan(true), 200);
                        }}
                      >
                        <Text style={{ fontSize: 16 }}>{item.agama}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <TouchableOpacity onPress={() => setShowAgama(false)}>
                    <Text style={styles.cancelText}>Batal</Text>
                  </TouchableOpacity>
                </Pressable>
              </Pressable>
            )}
            {/*  Modal Pendidikan */}
            {showPendidikan && (
              <Pressable
                style={styles.dropdownOverlay}
                onPress={() => setShowPendidikan(false)}
              >
                <Pressable style={styles.dropdownModal}>
                  <ScrollView style={{ maxHeight: 400 }}>
                    {pendidikanList.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setForm((prev) => ({
                            ...prev,
                            pendidikan: item.id,
                          }));

                          setShowPendidikan(false);

                          setTimeout(() => {
                            formListRef.current?.scrollToEnd({
                              animated: true,
                            });
                          }, 300);
                        }}
                      >
                        <Text style={{ fontSize: 16 }}>{item.edu}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <TouchableOpacity onPress={() => setShowPendidikan(false)}>
                    <Text style={styles.cancelText}>Batal</Text>
                  </TouchableOpacity>
                </Pressable>
              </Pressable>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
       {/*  Modal Sukses daftar RM */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successBox}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={42} color="#fff" />
            </View>

            <Text style={styles.successTitle}>Pendaftaran Berhasil</Text>

            <Text style={styles.successDesc}>
              Permintaan nomor rekam medis berhasil dikirim. Silakan menunggu
              proses verifikasi dari RS 'Aisyiyah Bojonegoro.
            </Text>

            <TouchableOpacity
              style={styles.successButton}
              onPress={() => setShowSuccess(false)}
            >
              <Text style={styles.successButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
    left: 12,
    top: 45,
    zIndex: 10,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  patientInfo: {
    flex: 1,
  },

  rmButtonText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  emptyBox: {
    margin: 14,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },

  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 13,
  },

  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },

  closeText: {
    fontSize: 16,
    color: "#555",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#087987",
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  detailLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },

  detailValue: {
    fontSize: 14,
    color: "#111",
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
  },

  formOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },

  formBackdrop: {
    flex: 1,
  },

  formScroll: {
    flex: 1,
    backgroundColor: "#fff",
  },

  formScrollContent: {
    paddingBottom: 320,
  },

  formClose: {
    fontSize: 16,
    color: "#444",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#087987",
  },

  inputText: {
    fontSize: 14,
    color: "#000",
  },

  submitText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  scrollWrapper: {
    flex: 1,
    position: "relative",
  },

  customScrollbar: {
    position: "absolute",
    right: 2,
    top: 0,
    width: 4,
    borderRadius: 10,
    backgroundColor: "#087987",
  },

  dropdownOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    textAlign: "center",
    marginTop: 10,
    color: "red",
    fontWeight: "600",
  },

  dropdownScrollWrapper: {
    maxHeight: 400,
    position: "relative",
  },

  dropdownScroll: {
    maxHeight: 400,
  },

  dropdownCustomScrollbar: {
    position: "absolute",
    right: 2,
    top: 0,
    width: 5,
    borderRadius: 10,
    backgroundColor: "#087987",
  },

  container: {
    flex: 1,
    backgroundColor: "#EEF5F5",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#D9FFFF",
    fontSize: 13,
    marginTop: 4,
  },

  addButton: {
    backgroundColor: "#D89200",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 3,
  },

  patientCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
  },

  patientName: {
    fontSize: 18,
    color: "#0A2E35",
    fontWeight: "800",
    marginBottom: 5,
  },

  patientText: {
    fontSize: 14,
    color: "#667",
  },

  rmText: {
    fontSize: 15,
    color: "#0A7C86",
    marginTop: 4,
    fontWeight: "800",
  },

  rmButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  detailBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
  },

  formBox: {
    backgroundColor: "#fff",
    height: "88%",
    paddingHorizontal: 18,
    paddingTop: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D8E2E3",
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 48,
    backgroundColor: "#FAFFFF",
    justifyContent: "center",
  },

  label: {
    fontSize: 13,
    color: "#566",
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "700",
  },

  submitButton: {
    backgroundColor: "#087987",
    marginTop: 18,
    marginBottom: 25,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    elevation: 4,
  },

  dropdownModal: {
    width: "88%",
    maxHeight: "72%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    elevation: 8,
  },

  dropdownItem: {
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F1",
  },

  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  successBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 26,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
    elevation: 10,
  },

  successIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#0A7C86",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  successTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#10343A",
    marginBottom: 10,
  },

  successDesc: {
    fontSize: 14,
    color: "#667",
    textAlign: "center",
    lineHeight: 23,
  },

  successButton: {
    marginTop: 24,
    backgroundColor: "#0A7C86",
    paddingHorizontal: 34,
    paddingVertical: 14,
    borderRadius: 14,
  },

  successButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});
