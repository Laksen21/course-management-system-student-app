import { View, StyleSheet, StatusBar } from 'react-native';
import { Text, ActivityIndicator, Surface, IconButton } from 'react-native-paper';

export default function UserPage() {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#5d4894" barStyle="light-content" />
            <Surface style={styles.header} elevation={4}>
                <Text style={styles.headerText}>User profile</Text>
            </Surface>
            
        </View>
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
});