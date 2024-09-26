import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CoursesPage from '../pages/CoursesPage';
import UserPage from '../pages/UserPage';

const Tab = createBottomTabNavigator();

export default function BottomTabNav() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Courses') {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name === 'User') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    // Return the icon component from Ionicons
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#6750a4',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: { backgroundColor: 'white' },
                tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
            })}
        >
            <Tab.Screen name="Courses" component={CoursesPage}
                options={{ headerShown: false }}
            />
            <Tab.Screen name="User" component={UserPage}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    );
} 