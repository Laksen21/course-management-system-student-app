import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';

function CoursesPage({ navigation }) {
    const [studentId, setStudentId] = useState('');
    const [token, setToken] = useState('');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const serverUrl = "http://192.168.1.100:8080";

    useEffect(() => {
        getStudentId();
        getCourses();
    }, [token]);

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token !== null) {
                setToken(token);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const getStudentId = async () => {
        try {
            const studentId = await AsyncStorage.getItem('studentId');
            studentId !== null ? parseInt(studentId, 10) : null;
            setStudentId(studentId)
        } catch (e) {
            console.log(e);
            return null;
        }
    };

    const getCourses = async () => {
        getToken();
        setLoading(true);
        if (token) {
            axios.get(`${serverUrl}/student/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(function (response) {
                    setCourses(response.data.courses);
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                    setLoading(true);
                });
        } else {
            console.log('Token not found.');
        }
    }

    const handleClickCourse = (courseId, courseCode) => {
        navigation.navigate("Videos", { courseId: courseId, courseCode: courseCode })
    }

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator animating={true} size={'large'} color={'#6750a4'} style={styles.loader} />
            ) : (
                <FlatList
                    data={courses}
                    renderItem={({ item: course }) =>
                        <Card
                            style={styles.card}
                            onPress={() => handleClickCourse(course.id, course.code)}
                        >
                            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                            <Card.Content >
                                <Text style={styles.cardText} variant="bodyMedium">{course.code}</Text>
                                <Text style={styles.cardText} variant="titleLarge">{course.title}</Text>
                            </Card.Content>
                        </Card>
                    }
                    keyExtractor={(course) => course.id.toString()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        margin: 10,
        backgroundColor:'#edeaf5'
    },
    cardText: {
       color: '#6750a4',
       fontWeight: 'bold',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CoursesPage;