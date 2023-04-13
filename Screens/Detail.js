import React, { useState } from 'react'
import { View, TextInput, StyleSheet, Text, Pressable, Picker } from "react-native"

// datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native';

const Detail = ({ route }) => {
    const todoRef = firebase.firestore().collection('todos');
    const [textHeading, onChangeHeadingText] = useState(route.params.item.name);
    const [addStartDate, setAddStartDate] = useState(new Date());
    const [addDueDate, setAddDueDate] = useState(new Date());
    const [addStatus, setAddStatus] = useState('Pending'); // default value for status
    const navigation = useNavigation();

    const updateTodo = () => {
        if (textHeading && textHeading.length > 0) {
            todoRef
                .doc(route.params.item.id)
                .update({
                    heading: textHeading,
                }).then(() => {
                    navigation.navigate("Home")
                }).catch((error) => {
                    alert(error.message)
                })
        }

    }

    return (
        <View style={styles.container}>
            <Pressable
                style={[styles.button, { marginBottom: 10 }]}
                onPress={() => navigation.navigate("Home")}>
                <Text style={styles.buttonText}>Back to List</Text>
            </Pressable>
            <TextInput
                style={styles.textfield}
                onChangeText={onChangeHeadingText}
                value={textHeading}
                placeholder="Update Todo"
            />
            <DatePicker
                style={styles.textfield} selected={addStartDate}
                onChange={(date) => setAddStartDate(date)}
            />
            <DatePicker
                style={styles.textfield} selected={addDueDate}
                onChange={(date) => setAddDueDate(date)}
            />
            <Picker
                selectedValue={addStatus}
                style={styles.textfield}
                onValueChange={(itemValue) => setAddStatus(itemValue)}
            >
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="In Progress" value="inProgress" />
                <Picker.Item label="Done" value="done" />
            </Picker>
            <Pressable
                style={styles.buttonUpdate}
                onPress={() => { updateTodo() }}>
                <Text>Cập nhật Task</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 80,
        marginLeft: 15,
        marginRight: 15,
    },
    button: {
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: "center",
        justifyContent: 'center',
    },
    textfield: {
        marginBottom: 10,
        padding: 10,
        fontSize: 15,
        color: "#000000",
        backgroundColor: "#e0e0e0",
        borderRadius: 5
    },
    buttonUpdate: {
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 10,
        backgroundColor: '#0de065',
    },
    buttonText: {
        color: 'white',
        fontSize: 12
    },
});

export default Detail