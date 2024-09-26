import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, StatusBar, Image } from 'react-native';
import { Card, Text, ActivityIndicator, Surface, IconButton } from 'react-native-paper';
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

    const handleClickVideo = (id,name) => {
        navigation.navigate("VideoPlayer", { videoId: id }, { videoName: name });
    }

    const renderVideoItem = ({ item: video }) => (
        <Surface style={styles.cardSurface} elevation={2}>
            <Card
                style={styles.card}
                onPress={() => handleClickVideo(video.id, video.name)}
            >
                <Image 
                    source={{ uri: `${serverUrl}/video/thumbnail/${video.id}?t=${new Date().getTime()}` }}
                    style={styles.cardCover}
                    resizeMode="cover"
                />
                <Card.Content style={styles.cardContent}>
                    <Text style={styles.videoTitle} numberOfLines={2} ellipsizeMode="tail">
                        {video.name}
                    </Text>
                </Card.Content>
                <Card.Actions style={styles.cardActions}>
                    <IconButton
                        icon="play-circle"
                        mode="contained"
                        size={24}
                        iconColor="#6750a4"
                        onPress={() => handleClickVideo(video.id, video.name)}
                    />
                </Card.Actions>
            </Card>
        </Surface>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#5d4894" barStyle="light-content"/>
            {loading ? (
                <ActivityIndicator animating={true} size={'large'} color={'#6750a4'} style={styles.loader} />
            ) : (
                <FlatList
                    data={videos}
                    renderItem={renderVideoItem}
                    keyExtractor={(video) => video.id.toString()}
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
    cardCover: {
        height: 150,
    },
    cardContent: {
        paddingTop: 8,
        paddingBottom: 4,
    },
    videoTitle: {
        fontSize: 18,
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

export default VideosPage;