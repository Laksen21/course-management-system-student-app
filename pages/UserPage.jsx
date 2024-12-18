import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Surface, Button, Avatar, TextInput, Modal, Portal, ActivityIndicator } from 'react-native-paper';
import { ALERT_TYPE, AlertNotificationRoot, Dialog, Toast } from 'react-native-alert-notification';

export default function UserPage({ navigation }) {
    const [visible, setVisible] = useState(false);
    const [userData, setUserData] = useState({
        token: '',
        studentId: '',
        name: '',
        email: '',
        address: '',
        telNo: ''
    });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const serverUrl = "http://192.168.1.100:8080";

    useEffect(() => {
        getStudentData();
    }, []);

    const showModal = () => setVisible(true);
    const hideModal = () => {
        setVisible(false);
        setCurrentPassword('');
        setNewPassword('');
    }

    const getStudentData = useCallback(async () => {
        try {
            const keys = ['token', 'studentId', 'studentName', 'email', 'studentAddress', 'studentTelNo'];
            const values = await AsyncStorage.multiGet(keys);
            const data = Object.fromEntries(values);

            setUserData({
                token: data.token,
                studentId: data.studentId ? parseInt(data.studentId, 10) : null,
                name: data.studentName,
                email: data.email,
                address: data.studentAddress,
                telNo: data.studentTelNo
            });
        } catch (e) {
            console.error('Error fetching user data:', e);
        }
    }, []);

    const handleChangePassword = () => {
        if (currentPassword === "" || newPassword === "") {
            showToast(ALERT_TYPE.WARNING, 'Warning', 'Enter your current & new passwords !');
            return;
        } else {
            console.log(userData.token);
            setLoading(true);
            axios.put(`${serverUrl}/student/change_password/${userData.studentId}`, {
                "currentPassword": currentPassword,
                "newPassword": newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            })
                .then(function (response) {
                    setLoading(false);
                    showToast(ALERT_TYPE.SUCCESS, 'Successful', 'You successfully changed your password !');
                    hideModal();
                })
                .catch(function (error) {
                    console.log(error);
                    if (error.status === 400) {
                        showToast(ALERT_TYPE.DANGER, 'Error', 'Incorrect current password !');
                    } else {
                        setLoading(false);
                        showToast(ALERT_TYPE.DANGER, 'Error', 'Password change failed !');
                    }
                });
        }

    }

    const showToast = useCallback((type, title, message) => {
        Toast.show({ type, title, textBody: message });
    }, []);

    const showDialog = useCallback((type, title, message, button) => {
        Dialog.show({ type, title, textBody: message, button: button, });
    }, []);

    const handleLogout = async () => {
        Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: 'Confirm Logout',
            textBody: 'Are you sure you want to log out?',
            button: 'Yes',
            onPressButton: () => {
                performLogout();
            }
        });
    };

    const performLogout = async () => {
        try {
            // Clear user data from AsyncStorage
            await AsyncStorage.multiRemove(['token', 'studentId', 'studentName', 'email', 'password', 'studentAddress', 'studentTelNo']);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Error during logout:', error);
            showToast(ALERT_TYPE.DANGER, 'Error', 'Failed to log out. Please try again.');
        }
    };

    return (
        <AlertNotificationRoot theme="light">
            <View style={styles.container}>
                <Surface style={styles.header} elevation={4}>
                    <Text style={styles.headerText}>User Profile</Text>
                </Surface>
                {(loading) && (
                    <ActivityIndicator animating={true} size={'large'} color={'#6750a4'} style={styles.loader} />
                )}
                <View style={styles.content}>
                    <View style={styles.avatarContainer}>
                        <Avatar.Image size={120} source={require('../assets/avatar.png')} style={styles.avatar} />
                        <Text style={styles.name}>{userData.name}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.info}>
                            <Text style={styles.infoLabel}>Email: </Text>
                            {userData.email}
                        </Text>
                        <Text style={styles.info}>
                            <Text style={styles.infoLabel}>Address: </Text>
                            {userData.address}
                        </Text>
                        <Text style={styles.info}>
                            <Text style={styles.infoLabel}>Phone: </Text>
                            {userData.telNo}
                        </Text>
                    </View>

                    <Button mode="contained" onPress={showModal} style={styles.button}>
                        Change Password
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={handleLogout}
                        style={styles.logoutButton}
                        labelStyle={styles.logoutButtonText}
                    >
                        Log out
                    </Button>
                </View>

                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContent}>
                        <Text style={styles.modalTitle}>Change Password</Text>
                        <TextInput
                            label="Current Password"
                            mode="outlined"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry
                            style={styles.input}
                        />
                        <TextInput
                            label="New Password"
                            mode="outlined"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            style={styles.input}
                        />
                        <Button mode="contained" onPress={handleChangePassword} style={styles.button}>
                            Change Password
                        </Button>
                    </Modal>
                </Portal>
            </View>
        </AlertNotificationRoot>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#6750a4',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    infoContainer: {
        alignSelf: 'stretch',
    },
    info: {
        fontSize: 18,
        marginBottom: 10,
    },
    infoLabel: {
        fontWeight: 'bold',
    },
    button: {
        marginTop: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        marginBottom: 10,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#d32f2f',
        borderColor: '#d32f2f',
        marginBottom: 20, // Add some bottom margin to ensure it's not right at the edge
    },
    logoutButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});