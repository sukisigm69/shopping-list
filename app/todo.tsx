import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react"; // Import React
import { View, ScrollView } from "react-native";
import { Appbar, Button, Checkbox, List, Surface, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Todo = {
    id: string;
    text: string;
    completed: boolean;
}

export default function TodoPage() {
 const [todos, setTodos] = useState<Todo[]>([]);
 const [input, setInput] = useState("");
 const [loading, setLoading] = useState(false);


 async function loadTodos() {
    setLoading(true);
    const storedTodos = await AsyncStorage.getItem("todos");
    if (storedTodos) {
    setTodos(JSON.parse(storedTodos));
    }
    setLoading(false);
    
 }

useEffect(() => {
   loadTodos();
}, []);


async function addTodo() {
    const newTodo: Todo = {
        id: Date.now().toString(),
        text: input,
        completed: false,
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setInput("");

    await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos)); 
}

async function deleteTodo(id: string) {
    const updateTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updateTodos);

    await AsyncStorage.setItem("todos", JSON.stringify(updateTodos)); 
}


async function toggleTodo(id: string) {
    const updateTodos = todos.map((todo) => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updateTodos);

    await AsyncStorage.setItem("todos", JSON.stringify(updateTodos)); 
}


    return (
    <SafeAreaView>
        <Appbar.Header>
        <Appbar.Content title="Todo Page" />
        </Appbar.Header>

        <View style={{ padding: 16 }}>
            <Surface style={{ padding: 16 , borderRadius: 8, elevation:2 }}>
                <TextInput label={"Add New Todo"}
                           value={input}
                           onChangeText={setInput}
                           mode="outlined"
                           right={<TextInput.Icon icon="plus" onPress={addTodo} />}
                ></TextInput>
            </Surface>
        </View>

        <ScrollView style={{ paddingHorizontal: 16, paddingBottom: 16 }}>

            {todos.map((todo) => (
            <Surface style={{ marginBottom: 8, borderRadius:8, elevation:1}}>
                <List.Item
                    title={todo.text}
                    description="This is a sample todo item."
                    left={(props) => (
                        <Checkbox {...props} status={todo.completed ? "checked" : "unchecked"} onPress={() => toggleTodo(todo.id)} /> 
                    )}
                    right={(props) => 
                        <Button mode="text" compact onPress={() => deleteTodo(todo.id)} textColor="red">
                            Delete
                        </Button>
                    }
                />
            </Surface>
            ))}

        </ScrollView>
    </SafeAreaView>
    );
}