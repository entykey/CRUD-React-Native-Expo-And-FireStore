import {
    View, ScrollView, Text, FlatList, StyleSheet, Pressable,
    TextInput, TouchableOpacity, Keyboard, Picker,
    ActivityIndicator,
} from 'react-native'

// datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import React, { useState, useEffect } from 'react'
import { firebase } from '../config';
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const Home = () => {

    // firestore collection ref:
    const todoRef = firebase.firestore().collection('todos');

    const [todos, setTodos] = useState([]);
    const [addData, setAddData] = useState('');
    const [addStartDate, setAddStartDate] = useState(new Date());
    const [addDueDate, setAddDueDate] = useState(new Date());
    const [addStatus, setAddStatus] = useState('Pending'); // default value for status

    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const getTodos = async () => {
        setLoading(true);
        todoRef
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const todos = []
                    querySnapshot.forEach((doc) => {
                        const { heading, startDate, dueDate, status, } = doc.data()
                        todos.push({
                            id: doc.id,
                            heading,
                            startDate: startDate && startDate.toDate(),
                            dueDate: dueDate && dueDate.toDate(),
                            status,
                        })
                    })
                    setTodos(todos)
                    console.log(todos)
                    console.log('1st todo duedate: ' + todos[0].dueDate.toString());
                })
        setLoading(false);
    }
    // fetch or read the data from firestore
    useEffect(() => {
        getTodos();
    }, [])

    // delete a todo from firestore db
    const deleteTodo = (todos) => {
        todoRef
            .doc(todos.id)
            .delete()
            .then(() => {
                // show a successful alert
                alert("Deleted successfully");
            })
            .catch(error => {
                // show an error alert
                alert(error);
            })
    }

    // add a todo
    const addTodo = () => {
        // check if we have a todo.
        if (addData && addData.length > 0) {
            // get the timestamp
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                heading: addData,
                startDate: addStartDate,
                dueDate: addDueDate, // initialize due date to empty string
                status: addStatus, // set status based on the selected option
                createdAt: timestamp
            };
            todoRef
                .add(data)
                .then(() => {
                    // release todo state
                    setAddData('');
                    setAddStatus('Pending'); // reset status to default value
                    setAddStartDate(new Date());
                    setAddDueDate(new Date());
                    // release keyboard
                    Keyboard.dismiss();
                })
                .catch((error) => {
                    // show an alert in case of error
                    alert(error);
                })
        }
    }

    return (
        <ScrollView style={[{ flex: 1 }]}>
            <View style={styles.formContainer}>
            <Text style={{margin: 'auto', marginBottom: 0, fontSize: 30, fontWeight: 'bold'}}>react-native firestore realtime todo by Nguyen Huu Anh Tuan</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Title'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(heading) => setAddData(heading)}
                    value={addData}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <DatePicker
                    style={styles.input} selected={addStartDate}
                    onChange={(date) => setAddStartDate(date)}
                />
                <DatePicker
                    style={styles.input} selected={addDueDate}
                    onChange={(date) => setAddDueDate(date)}
                />
                <Picker
                    selectedValue={addStatus}
                    style={styles.input}
                    onValueChange={(itemValue) => setAddStatus(itemValue)}
                >
                    <Picker.Item label="Pending" value="pending" />
                    <Picker.Item label="In Progress" value="inProgress" />
                    <Picker.Item label="Done" value="done" />
                </Picker>

                <TouchableOpacity style={styles.button} onPress={addTodo}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={getTodos}>
                    <Text style={styles.buttonText}>Refresh</Text>
                </TouchableOpacity>
            </View>

            <Text style={{margin: 'auto'}}>Tap on todo to edit</Text>
            {loading ? (
                <View style={{ height: 200 }}>
                    <ActivityIndicator size="large" color={colors.purple} />
                </View>
            ) : (
                todos ? (
                    <FlatList
                        style={{}}
                        data={todos}
                        numColumns={1}
                        renderItem={({ item }) => (
                            <View>
                                <Pressable
                                    style={styles.listContainer}
                                    onPress={() => navigation.navigate('Detail', { item })}
                                >
                                    <FontAwesome
                                        name="trash-o"
                                        color="red"
                                        onPress={() => deleteTodo(item)}
                                        style={styles.todoIcon}
                                    />
                                    <View style={styles.innerContainer}>
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.itemHeading}>
                                            {item.heading[0].toUpperCase() + item.heading.slice(1)}
                                        </Text>
                                        <Text>Created: {item.createdAt}</Text>
                                        {/* <Text>Due date: {item.dueDate}</Text> */}
                                        <Text>Status: {item.status}</Text>
                                    </View>
                                </Pressable>
                            </View>
                        )}
                    />
                ) : (
                    <Text>Todos is null or can't fetch data</Text>
                )
            )}

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    listContainer: {
        backgroundColor: '#e5e5e5',
        padding: 15,
        borderRadius: 15,
        margin: 5,
        marginHorizontal: 10,
        flexDirection: 'column',
        alignItems: 'center',
    },
    innerContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        //marginLeft: 38,
        width: '70%',   // make Text ellipse work by reducing parent's width
        //flexWrap: 'wrap',
    },
    itemHeading: {
        fontWeight: 'bold',
        fontSize: 18,
        marginRight: 22
    },
    formContainer: {
        zIndex: 10,
        flexDirection: 'column',
        height: 'auto',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 100
    },
    input: {
        minHeight: '48px',
        borderRadius: 5,
        fontSize: 15,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 16,
        marginTop: 5,
        marginBottom: 5,
        flex: 1,
        marginRight: 5
    },
    textfield: {
        marginBottom: 10,
        padding: 10,
        fontSize: 15,
        color: "#000000",
        backgroundColor: "#e0e0e0",
        borderRadius: 5
    },
    button: {
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 20
    },

    todoIcon: {
        marginTop: 5,
        fontSize: 20,
        marginLeft: 14,
    },
});

export default Home