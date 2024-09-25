import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Image, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const serverUrl = "http://192.168.1.100:8080";

    useEffect(() => {
        const checkStoredCredentials = async () => {
            await retrieveEmailAndPassword();
            if (email && password) {
                handleLogin();
            }
        };

        checkStoredCredentials();
    }, []);

    const retrieveEmailAndPassword = async () => {
        try {
            const storedEmail = await AsyncStorage.getItem('email');
            const storedPassword = await AsyncStorage.getItem('password');
            if (storedEmail) {
                setEmail(storedEmail);
            }
            if (storedPassword) {
                setPassword(storedPassword);
            }
        } catch (e) {
            console.log('Error retrieving credentials:', e);
        }
    };

    // Store token in AsyncStorage
    const storeToken = async (value) => {
        try {
            await AsyncStorage.setItem('token', value);
        } catch (e) {
            console.log(e);
        }
    };

    const storeEmail = async (email) => {
        try {
            await AsyncStorage.setItem('email', email);
        } catch (e) {
            console.log(e);
        }
    };

    const storePassword = async (password) => {
        try {
            await AsyncStorage.setItem('password', password);
        } catch (e) {
            console.log(e);
        }
    };

    const storeStudentId = async (studentId) => {
        try {
            await AsyncStorage.setItem('studentId', studentId.toString());
        } catch (e) {
            console.log(e);
        }
    };

    const handleLogin = () => {
        if (email === "" || password === "") {
            alertEmptyFields();
        } else {
            axios.post(`${serverUrl}/student/login`, {
                "email": email,
                "appPassword": password
            })
                .then(function (response) {
                    // console.log(response);
                    if (response.data.token) {
                        storeToken(response.data.token);
                        storeEmail(response.data.username);
                        storePassword(password);
                        storeStudentId(response.data.id);
                        navigation.navigate("tabs");
                        // setPassword('');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    alertInvalid();
                });
        }
    };

    const alertEmptyFields = () => {
        Toast.show({
            type: ALERT_TYPE.WARNING,
            title: 'Warning',
            textBody: 'Enter your Email & password !',
        })
    };

    const alertInvalid = () => {
        Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Login Error',
            textBody: 'Incorrect Email or Password',
            button: 'close',
        })
    };

    return (
        <AlertNotificationRoot>
            <View style={styles.container}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                />
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    style={styles.input}
                    secureTextEntry
                />
                <Button mode="contained" onPress={handleLogin} style={styles.button}>
                    Login
                </Button>
            </View>
        </AlertNotificationRoot>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    logo: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 32,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
});

export default LoginScreen;