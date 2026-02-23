import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Appbar, Button, List, Surface, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Siswa = {
  id: string;
  nama: string;
  umur: string;
  kelas: string;
  jurusan: string;
  sekolah: string;
};

export default function SiswaPage() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [nama, setNama] = useState("");
  const [umur, setUmur] = useState("");
  const [kelas, setKelas] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [sekolah, setSekolah] = useState("");

  async function loadSiswa() {
    const data = await AsyncStorage.getItem("siswa");
    if (data) setSiswa(JSON.parse(data));
  }

  useEffect(() => {
    loadSiswa();
  }, []);

  async function addSiswa() {
    if (!nama || !umur || !kelas || !jurusan || !sekolah) return;

    const newSiswa: Siswa = {
      id: Date.now().toString(),
      nama,
      umur,
      kelas,
      jurusan,
      sekolah,
    };

    const updated = [...siswa, newSiswa];
    setSiswa(updated);
    await AsyncStorage.setItem("siswa", JSON.stringify(updated));

    setNama("");
    setUmur("");
    setKelas("");
    setJurusan("");
    setSekolah("");
  }

  async function deleteSiswa(id: string) {
    const updated = siswa.filter((siswa) => siswa.id !== id);
    setSiswa(updated);
    await AsyncStorage.setItem("siswa", JSON.stringify(updated));
  }

  return (
    <SafeAreaView>
      <Appbar.Header>
        <Appbar.Content title="Data Siswa" />
      </Appbar.Header>

      <ScrollView style={{ padding: 16 }}>
        <Surface style={{ padding: 16, borderRadius: 8 }}>
          <TextInput label="Nama" value={nama} onChangeText={setNama} />
          <TextInput label="Umur" value={umur} onChangeText={setUmur} keyboardType="numeric" />
          <TextInput label="Kelas" value={kelas} onChangeText={setKelas} />
          <TextInput label="Jurusan" value={jurusan} onChangeText={setJurusan} />
          <TextInput label="Sekolah" value={sekolah} onChangeText={setSekolah} />

          <Button mode="contained" onPress={addSiswa} style={{ marginTop: 10 }}>
            Tambah
          </Button>
        </Surface>

        {siswa.map((siswa) => (
          <Surface key={siswa.id} style={{ marginTop: 10, padding: 10, borderRadius: 8 }}>
            <List.Item
              title={siswa.nama}
              description={`${siswa.umur} tahun | ${siswa.kelas} | ${siswa.jurusan}\n${siswa.sekolah}`}
              right={() => (
                <Button textColor="red" onPress={() => deleteSiswa(siswa.id)}>
                  Hapus
                </Button>
              )}
            />
          </Surface>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
