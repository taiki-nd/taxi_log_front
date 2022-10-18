import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import { BasicColor, DisabledColor, AccentColor } from './styles/common/color';
import { HomeScreen } from './screens/HomeScreens';
import { RecordsIndex } from './screens/RecordsIndex';
import { RecordsCreate } from './screens/RecordsCreate';
import { Analysis } from './screens/Analysis';
import { Setting } from './screens/Setting';

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
          name="Add"
          component={RecordsCreate}
          options={{
            title: "Add Record",
            tabBarIcon: ({ color, size}) => (
              <Icon name="pluscircle" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Records"
          component={RecordsIndex}
          options={{
            title: "Records",
            tabBarIcon: ({ color, size}) => (
              <Icon name="bars" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Analysis"
          component={Analysis}
          options={{
            title: "Analysis",
            tabBarIcon: ({ color, size}) => (
              <Icon name="areachart" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Setting"
          component={Setting}
          options={{
            title: "Setting",
            tabBarIcon: ({ color, size}) => (
              <Icon name="setting" size={size} color={color} />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}