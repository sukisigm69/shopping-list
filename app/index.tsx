import { useState, useEffect } from "react";
import { Text, TextInput, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [kelas, setKelas] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [sekolah, setSekolah] = useState("");

  const storeData = async () => {
    await AsyncStorage.setItem("name", name);
    await AsyncStorage.setItem("age", age);
    await AsyncStorage.setItem("kelas", kelas);
    await AsyncStorage.setItem("jurusan", jurusan);
    await AsyncStorage.setItem("sekolah", sekolah);
  };

  const getData = async () => {
    const nameValue = await AsyncStorage.getItem("name");
    const ageValue = await AsyncStorage.getItem("age");
    const kelasValue = await AsyncStorage.getItem("kelas");
    const jurusanValue = await AsyncStorage.getItem("jurusan");
    const sekolahValue = await AsyncStorage.getItem("sekolah");

    if (nameValue !== null) setName(nameValue);
    if (ageValue !== null) setAge(ageValue);
    if (kelasValue !== null) setKelas(kelasValue);
    if (jurusanValue !== null) setJurusan(jurusanValue);
    if (sekolahValue !== null) setSekolah(sekolahValue);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView
      style={{flex: 1,padding: 20,backgroundColor: "white",}}>
        
      <Text style={{ marginBottom: 10, fontSize: 16, color: "blue" }}>
        Nama: {name}
      </Text>

      <Text style={{ marginBottom: 10, fontSize: 16, color: "blue" }}>
        Kelas: {kelas}
      </Text>
      

      <Text style={{ marginBottom: 10, fontSize: 16, color: "blue" }}>
        Umur: {age}
      </Text>

      <Text style={{ marginBottom: 10, fontSize: 16, color: "blue" }}>
        Jurusan: {jurusan}
      </Text>

      <Text style={{ marginBottom: 10, fontSize: 16, color: "blue" }}>
        Sekolah: {sekolah}
      </Text>

      <TextInput
        placeholder="Masukan Nama"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Masukan Kelas"
        value={kelas}
        onChangeText={setKelas}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />

      <TextInput
        placeholder="Masukan Umur"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={{borderWidth: 1,padding: 10,marginBottom: 10,}}/>

        <TextInput
        placeholder="Masukan Jurusan"
        value={jurusan}
        onChangeText={setJurusan}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />

        <TextInput
        placeholder="Masukan Sekolah"
        value={sekolah}
        onChangeText={setSekolah}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />

      <Button title="Simpan" onPress={storeData} />
      <Button title="Ambil Data" onPress={getData} />
    </SafeAreaView>
  );
}
