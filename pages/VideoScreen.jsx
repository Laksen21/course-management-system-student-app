import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import Video from 'react-native-video';

const VideoScreen = ({ route }) => {
    // Destructure the videoId passed from VideosPage
    const { videoId } = route.params;

    return (
        <View style={styles.container}>
            <Video
                source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }} // Can be a URL or a local file
                style={styles.video}
                paused={true}
                controls={true}  // Display default video controls (play/pause, volume, etc.)
                resizeMode="cover" // Adjust video resizing
            />
            <Text style={styles.text}>Your Video Title</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    video: {
        width: '100%',
        height: 300, // Adjust the height as needed
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
});


export default VideoScreen;
