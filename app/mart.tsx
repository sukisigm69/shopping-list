import { useState, useEffect } from "react";
import { Alert, FlatList, View } from "react-native";
import { Appbar, Button, Card, Checkbox, TextInput, Text } from "react-native-paper";
import * as SQLite from "expo-sqlite";
import { Dialog, Portal } from "react-native-paper";

type Item = {
  id: number;
  name: string;
  qty: number;
  done: number;
};

const db = SQLite.openDatabaseSync("shopping.db");

export default function ShoppingList() {
  const [items, setItems] = useState<Item[]>([]);
  const [visible, setVisible] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    qty: "",
  });

  async function initDatabase() {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS shopping (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        qty INTEGER NOT NULL,
        done INTEGER DEFAULT 0
      );
    `);
  }

  async function loadItems() {
    const result = await db.getAllAsync<Item>(
      "SELECT * FROM shopping ORDER BY id DESC"
    );
    setItems(result);
  }

  useEffect(() => {
    initDatabase();
    loadItems();
  }, []);

  async function saveItem() {
    if (!form.name || !form.qty) return;

    const qty = parseInt(form.qty);

    if (editId) {
      await db.runAsync(
        "UPDATE shopping SET name = ?, qty = ? WHERE id = ?",
        [form.name, qty, editId]
      );
      setEditId(null);
    } else {
      await db.runAsync(
        "INSERT INTO shopping (name, qty) VALUES (?, ?)",
        [form.name, qty]
      );
    }

    setForm({ name: "", qty: "" });
    setVisible(false);
    loadItems();
  }

  async function toggleDone(item: Item) {
    await db.runAsync(
      "UPDATE shopping SET done = ? WHERE id = ?",
      [item.done ? 0 : 1, item.id]
    );
    loadItems();
  }

  async function deleteItem(id: number) {
    await db.runAsync("DELETE FROM shopping WHERE id = ?", [id]);
    loadItems();
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Shopping List" />
        <Appbar.Action icon="plus" onPress={() => setVisible(true)} />
      </Appbar.Header>

      <FlatList
        contentContainerStyle={{ padding: 12 }}
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 10 }}>
            <Card.Content style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                status={item.done ? "checked" : "unchecked"}
                onPress={() => toggleDone(item)}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textDecorationLine: item.done ? "line-through" : "none",
                  }}
                >
                  {item.name}
                </Text>
                <Text style={{ fontSize: 12, color: "gray" }}>
                  Jumlah: {item.qty}
                </Text>
              </View>

              <Button textColor="red" onPress={() => deleteItem(item.id)}>
                Hapus
              </Button>
            </Card.Content>
          </Card>
        )}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Tambah Belanja</Dialog.Title>

          <Dialog.Content>
            <TextInput
              label="Nama Barang"
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Jumlah"
              keyboardType="number-pad"
              value={form.qty}
              onChangeText={(t) => setForm({ ...form, qty: t })}
            />
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Batal</Button>
            <Button onPress={saveItem}>Simpan</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
