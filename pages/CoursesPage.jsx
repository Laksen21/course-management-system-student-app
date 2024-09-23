import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, TextInput, Button, Text } from 'react-native-paper';

function CoursesPage({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleClickCourse = () => {
        navigation.navigate("videos")
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card} onPress={handleClickCourse}>
                <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                <Card.Content>
                    <Text variant="bodyMedium">Course id</Text>
                    <Text variant="titleLarge">Course name</Text>
                </Card.Content>
                {/* <Card.Actions>
                    <Button mode="contained" >Open</Button>
                </Card.Actions> */}
            </Card>
        </View>
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

export default CoursesPage;