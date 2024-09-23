import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import { Card, TextInput, Button, Text } from 'react-native-paper';

function VideosPage({ navigation }) {
    const [videos, setVideos] = useState([
        { id: 1, name: 'Video 1', description: 'description 1', thumbnail: require('../assets/logo.png') },
        { id: 2, name: 'Video 2', description: 'description 2', thumbnail: require('../assets/logo.png') },
        { id: 3, name: 'Video 3', description: 'description 3', thumbnail: require('../assets/logo.png') },
        // Add more videos as needed
    ]);
    
    const handleClickVideo = (id) => {
        navigation.navigate("VideoScreen", { videoId: id });
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                {videos.map(video => (
                    <Card 
                        key={video.id} 
                        style={styles.card} 
                        onPress={() => handleClickVideo(video.id)}
                    >
                        {/* Display the thumbnail */}
                        <Card.Cover source={video.thumbnail} />
                        <Card.Content>
                            {/* Display the video name */}
                            <Text style={{ marginTop: 10 }} variant="titleSmall">
                                {video.name}
                            </Text>
                            <Text  variant="titleLarge">
                                {video.description}
                            </Text>
                        </Card.Content>
                    </Card>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        margin: 10
    }

});

export default VideosPage;