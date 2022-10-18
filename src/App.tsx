import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './screens/HomeScreens';
import { UserShow } from './screens/users/UserShow';
import Icon from 'react-native-vector-icons/AntDesign';
import { BasicColor, DisabledColor, AccentColor } from './styles/common/color';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={() => ({
          tabBarActiveTintColor: AccentColor,
          tabBarInactiveTintColor: DisabledColor,
          tabBarStyle: {
            backgroundColor: BasicColor,
          },
        })}
      >
        <Tab.Screen 
          name="Home"
          component={HomeScreen}
          options={{
            title: 'HOME',
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="User"
          component={UserShow}
          options={{
            title: "USER",
            tabBarIcon: ({ color, size}) => (
              <Icon name="user" size={size} color={color} />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}