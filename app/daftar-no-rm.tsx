import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
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
        `http://app.rsabojonegoro.com:5000/his/reg/regpxol/userid?userid=${googleId}`
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
        tlahir: form.tlahir,
        goldr: form.goldar,
        jk: form.jk,
        job: form.pekerjaan,
        suamiistri: form.suamiistri,
        ayahibu: form.ayah,
        job_ayah: form.pekerjaan_ayah,
        status: form.status,
        suku: form.suku,
        agama: form.agama,
        pend: form.pendidikan, // ⬅️ penting!
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
        "http://app.rsabojonegoro.com:5000/his/reg/regpxol",
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
  
      alert("Berhasil daftar RM");
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
        onPress={() => setShowForm(true)}
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

              <TouchableOpacity style={styles.rmButton}>
                <Text style={styles.rmButtonText}>RM Baru</Text>
              </TouchableOpacity>
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
                         <Text style={{ color: form.status ? "#000" : "#888" }}>
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
                         <Text style={{ color: form.suku ? "#000" : "#888" }}>
                          {form.suku
                            ? form.suku === 1
                              ? "Jawa"
                              : form.suku === 2
                              ? "Madura"
                              : form.suku === 3
                              ? "Batak"
                              : form.suku === 4
                              ? "Cina"
                              : form.suku === 5
                              ? "Sunda"
                              : form.suku === 6
                              ? "Tionghoa"
                              : "Lainnya"
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
                         <Text style={{ color: form.agama ? "#000" : "#888" }}>
                          {form.agama
                            ? form.agama === 1
                              ? "Islam"
                              : form.agama === 2
                              ? "Kristen"
                              : form.agama === 3
                              ? "Katolik"
                              : form.agama === 4
                              ? "Hindu"
                              : form.agama === 5
                              ? "Budha"                             
                              : "Lain"
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
                         <Text style={{ color: form.pendidikan ? "#000" : "#888" }}>
                          {form.pendidikan
                            ? form.pendidikan === 1
                              ? "SD"
                              : form.pendidikan === 2
                              ? "SMP"
                              : form.pendidikan === 3
                              ? "SMA/SMK"
                              : form.pendidikan === 4
                              ? "D1"
                              : form.pendidikan === 5
                              ? "D2"
                              : form.pendidikan === 6
                              ? "D3"
                              : form.pendidikan === 7
                              ? "D4"
                              : form.pendidikan === 8
                              ? "S1"
                              : form.pendidikan === 9
                              ? "S2"
                              : "S3"
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
                        style={styles.input}
                        placeholder={item.placeholder}
                        placeholderTextColor="#888"
                        value={form[item.key]}
                        onChangeText={(text) =>
                          setForm({ ...form, [item.key]: text })
                        }
                      />
                    </View>
                  );
                }}
                ListFooterComponent={
                  <TouchableOpacity
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

          // modal Goldar      
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

          // modal JK
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
                  <Text style={{ fontSize: 16 }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity onPress={() => setShowJK(false)}>
                <Text style={styles.cancelText}>Batal</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
          )}    

          // modal status
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
                    <Text style={{ fontSize: 16 }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity onPress={() => setShowStatus(false)}>
                  <Text style={styles.cancelText}>Batal</Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          )}  

          // modal suku
          {showSuku && (
            <Pressable
              style={styles.dropdownOverlay}
              onPress={() => setShowSuku(false)}
            >
              <Pressable
                style={styles.dropdownModal}
                onPress={(e) => e.stopPropagation()}
              >
                {[
                  { label: "Jawa", value: 1 },
                  { label: "Madura", value: 2 },
                  { label: "Batak", value: 3 },
                  { label: "Cina", value: 4 },
                  { label: "Sunda", value: 5 },
                  { label: "Tionghoa", value: 6 },
                  { label: "Lainnya", value: 7 },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.dropdownItem}                  
                    onPress={() => {
                      setForm((prev) => ({ ...prev, suku: item.value }));
                      setShowSuku(false);
                                          
                      setTimeout(() => {
                        setShowAgama(true);
                      }, 200);
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity onPress={() => setShowSuku(false)}>
                  <Text style={styles.cancelText}>Batal</Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          )}   

          // modal Agama
          {showAgama && (
            <Pressable
              style={styles.dropdownOverlay}
              onPress={() => setShowAgama(false)}
            >
              <Pressable
                style={styles.dropdownModal}
                onPress={(e) => e.stopPropagation()}
              >
                {[
                  { label: "Islam", value: 1 },
                  { label: "Kristen", value: 2 },
                  { label: "Katolik", value: 3 },
                  { label: "Hindu", value: 4 },
                  { label: "Budha", value: 5 },                  
                  { label: "Lain", value: 6 },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.dropdownItem}                 
                    onPress={() => {
                      setForm((prev) => ({ ...prev, agama: item.value }));
                      setShowAgama(false);
                                          
                      setTimeout(() => {
                        setShowPendidikan(true);
                      }, 200);
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity onPress={() => setShowAgama(false)}>
                  <Text style={styles.cancelText}>Batal</Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          )}           


          // modal Pendidikan
          {showPendidikan && (
            <Pressable
              style={styles.dropdownOverlay}
              onPress={() => setShowPendidikan(false)}
            >
              <Pressable
                style={styles.dropdownModal}
                onPress={(e) => e.stopPropagation()}
              >
                {[
                  { label: "SD", value: 1 },
                  { label: "SMP", value: 2 },
                  { label: "SMA/SMK", value: 3 },
                  { label: "D1", value: 4 },
                  { label: "D2", value: 5 },
                  { label: "D3", value: 6 },
                  { label: "D4", value: 7 },
                  { label: "S1", value: 8 },
                  { label: "S2", value: 9 },
                  { label: "S3", value: 10 },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setForm({ ...form, pendidikan: item.value });
                      setShowPendidikan(false);
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity onPress={() => setShowPendidikan(false)}>
                  <Text style={styles.cancelText}>Batal</Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          )}           
                    

        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    backgroundColor: "#087987",
    paddingTop: 32,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  backButton: {
    position: "absolute",
    left: 12,
    top: 34,
    zIndex: 10,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  headerSubtitle: {
    color: "#fff",
    fontSize: 14,
    marginTop: 1,
  },

  addButton: {
    backgroundColor: "#D89200",
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 6,
    paddingVertical: 9,
    alignItems: "center",
    elevation: 2,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  patientCard: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  patientInfo: {
    flex: 1,
  },

  patientName: {
    fontSize: 18,
    color: "#111",
    fontWeight: "500",
    marginBottom: 3,
  },

  patientText: {
    fontSize: 14,
    color: "#333",
  },

  rmText: {
    fontSize: 15,
    color: "#333",
    marginTop: 2,
    fontWeight: "600",
  },

  rmButton: {
    backgroundColor: "#0A9A9A",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
  },

  rmButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
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

  detailBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 16,
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

  formBox: {
    backgroundColor: "#fff",
    height: "85%",
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 0,
  },

  formScroll: {
    flex: 1,
    backgroundColor: "#fff",
  },

  formScrollContent: {
    paddingBottom: 220,
  },

  formClose: {
    fontSize: 16,
    color: "#444",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#087987",
  },

  label: {
    fontSize: 13,
    color: "#777",
    marginTop: 7,
    marginBottom: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 10,
    height: 36,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  
  inputText: {
    fontSize: 14,
    color: "#000",
  },

  submitButton: {
    backgroundColor: "#087987",
    marginTop: 14,
    marginBottom: 8,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
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

  dropdownModal: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },

  dropdownItem: {
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  cancelText: {
    textAlign: "center",
    marginTop: 10,
    color: "red",
    fontWeight: "600",
  },
});
