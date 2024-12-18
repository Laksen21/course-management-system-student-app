import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Video from 'react-native-video';

const VideoPlayer = ({ route }) => {
  const { videoId, videoName } = route.params;
  const serverUrl = "http://192.168.1.100:8080";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleBuffer = (isBuffering) => {
    setLoading(isBuffering);
  };

  const handleError = (meta) => {
    setError(true);
    console.log("Video error:", meta);
  };

  return (
    <View style={styles.container}>
      {loading && !error && (
        <ActivityIndicator animating={true} size={'large'} color={'#6750a4'} style={styles.loader} />
      )}
      {error ? (
        <Text style={styles.errorText}>Failed to load video. Please try again later.</Text>
      ) : (
        <Video
          source={{ uri: `${serverUrl}/video/${videoId}` }} 
          style={styles.video}
          paused={false}  // autoplay
          controls={true}
          resizeMode="contain"
          onBuffer={({ isBuffering }) => handleBuffer(isBuffering)}
          onError={handleError}
          onLoad={() => setLoading(false)}
        />
      )}
      <Text style={styles.text}>{videoName}</Text>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  video: {
    width: '100%',
    height: (width - 20) * 0.56, // Keeps 16:9 aspect ratio
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default VideoPlayer;
