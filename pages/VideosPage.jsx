import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function VideosPage({ route, navigation }) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const { courseId, courseCode } = route.params;
    const serverUrl = "http://192.168.1.100:8080";

    useEffect(() => {
        navigation.setOptions({
            title: `${courseCode}  |  Videos`,
        });
        getVideos();
    }, [navigation, courseCode]);

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            return token;
        } catch (e) {
            console.log(e);
            return null;
        }
    };

    const getVideos = async () => {
        setLoading(true);
        const token = await getToken();
        if (token) {
            axios.get(`${serverUrl}/course/${courseId}/videos`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(function (response) {
                    setVideos(response.data.videos);
                    setLoading(false);
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

    const handleClickVideo = (id) => {
        navigation.navigate("VideoScreen", { videoId: id });
    }

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator animating={true} size={'large'} color={'#6750a4'} style={styles.loader} />
            ) : (
                <ScrollView>
                    {videos.map(video => (
                        <Card
                            key={video.id}
                            style={styles.card}
                            onPress={() => handleClickVideo(video.id)}
                        >
                            <Card.Cover source={{ uri: video.thumbnailFilePath }} />
                            <Card.Content>
                                <Text style={styles.cardText} variant="titleLarge">
                                    {video.name}
                                </Text>
                                {/* <Text style={styles.videoDescription} variant="titleLarge">
                                    {video.description}
                                </Text> */}
                            </Card.Content>
                        </Card>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        height: '10px',
        margin: 10,
        backgroundColor: '#edeaf5'
    },
    cardText: {
        marginTop: 10,
        color: '#6750a4',
        fontWeight: 'bold',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default VideosPage;