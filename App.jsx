import React, { useEffect, useRef } from 'react';
import { StatusBar, BackHandler, ToastAndroid  } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import LoginScreen from './pages/LoginScreen';
import BottomTabNav from './components/BottomTabNav';
import VideosPage from './pages/VideosPage';
import VideoPlayer from './pages/VideoPlayer';

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6750a4',
    accent: '#f1c40f',
  },
  dark: false,
};

function HomeScreen() {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
        
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
          BackHandler.exitApp();
          return true;
        });

        setTimeout(() => {
          backHandler.remove();
        }, 2000);

        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  // Render BottomTabNav content here
  return <BottomTabNav />;
}

function App() {
  
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar backgroundColor="#59448e" barStyle="light-content" />
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
          <Stack.Screen options={{ headerShown: false }} name="tabs" component={HomeScreen} />
          <Stack.Screen name="Videos" component={VideosPage}
            options={{
              headerStyle: {
                backgroundColor: '#6750a4',
                height: 65
              },
              headerTintColor: '#ffffff',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 24,
              },
            }}
          />
          <Stack.Screen options={{ headerShown: false }} name="VideoPlayer" component={VideoPlayer} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
