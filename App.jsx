import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './pages/LoginScreen';
import BottomTabNav from './components/BottomTabNav';
import VideosPage from './pages/VideosPage';

const Stack = createStackNavigator()

function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="tabs" component={BottomTabNav} />
        <Stack.Screen name="Videos" component={VideosPage}
          options={{
            headerStyle: {
              backgroundColor: '#6750a4',
              height: 60,
              borderBottomStartRadius: 6,
              borderBottomEndRadius: 6
            },
            headerTintColor: '#edeaf5',
            headerTitleStyle: {
              fontWeight: '900',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
