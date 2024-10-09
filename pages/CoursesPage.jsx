import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, ActivityIndicator, Surface, IconButton } from 'react-native-paper';

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
                    setStudentData(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                    setLoading(false);
                });
        } else {
            console.log('Token not found.');
            setLoading(false);
        }
    }

    const setStudentData = async (student) => {
        try {
            await AsyncStorage.setItem('studentName', student.name);
            await AsyncStorage.setItem('studentAddress', student.address);
            await AsyncStorage.setItem('studentTelNo', student.tel_no);
        } catch (e) {
            console.log(e);
        }
        // console.log(student);
    }

    const handleClickCourse = (courseId, courseCode) => {
        navigation.navigate("Videos", { courseId: courseId, courseCode: courseCode })
    }

    const renderCourseItem = ({ item: course }) => (
        <Surface style={styles.cardSurface} elevation={2}>
            <Card
                style={styles.card}
                onPress={() => handleClickCourse(course.id, course.code)}
            >
                <Card.Content>
                    <Text style={styles.courseCode}>{course.code}</Text>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                </Card.Content>
                <Card.Actions style={styles.cardActions}>
                    <IconButton
                        icon="arrow-right"
                        mode="contained"
                        size={20}
                        onPress={() => handleClickCourse(course.id, course.code)}
                    />
                </Card.Actions>
            </Card>
        </Surface>
    );

    return (
        <View style={styles.container}>
            <Surface style={styles.header} elevation={4}>
                <Text style={styles.headerText}>Courses</Text>
            </Surface>
            {loading ? (
                <ActivityIndicator animating={true} size={'large'} color={'#6750a4'} style={styles.loader} />
            ) : (
                <FlatList
                    data={courses}
                    renderItem={renderCourseItem}
                    keyExtractor={(course) => course.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
};

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
    listContainer: {
        padding: 16,
    },
    cardSurface: {
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
    },
    card: {
        backgroundColor: '#f0eef6',
    },
    courseCode: {
        fontSize: 14,
        color: '#6750a4',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    courseTitle: {
        fontSize: 22,
        color: '#6750a4',
        fontWeight: 'bold',
    },
    cardActions: {
        justifyContent: 'flex-end',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CoursesPage;