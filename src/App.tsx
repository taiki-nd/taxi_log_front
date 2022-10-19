import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import { BasicColor, DisabledColor, AccentColor, BackColor } from './styles/common/color';
import { HomeScreen } from './screens/HomeScreen';
import { RecordsIndex } from './screens/RecordsIndex';
import { RecordsCreate } from './screens/RecordsCreate';
import { Analysis } from './screens/Analysis';
import { Setting } from './screens/Setting';
import { RecordsUpdate } from './components/records/RecordsUpdate';

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
        {/*
        // HOME
        */}
        <Tab.Screen 
          name="Home"
          component={HomeScreen}
          options={{
            title: 'HOME',
            headerStyle: {
              backgroundColor: BackColor,
            },
            headerTitleStyle: {
              color: BasicColor,
            },
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" size={size} color={color} />
            ),
          }}
        />
        {/*
        // Add Record
        */}
        <Tab.Screen
          name="Add"
          component={RecordsCreate}
          options={{
            title: "Add Record",
            headerStyle: {
              backgroundColor: BackColor,
            },
            headerTitleStyle: {
              color: BasicColor,
            },
            tabBarIcon: ({ color, size}) => (
              <Icon name="pluscircle" size={size} color={color} />
            )
          }}
        />
        {/*
        // Records
        */}
        <Tab.Screen
          name="Records"
          component={RecordsIndex}
          options={{
            title: "Records",
            headerStyle: {
              backgroundColor: BackColor,
            },
            headerTitleStyle: {
              color: BasicColor,
            },
            tabBarIcon: ({ color, size}) => (
              <Icon name="bars" size={size} color={color} />
            )
          }}
        />
        {/*
        // Analysis
        */}
        <Tab.Screen
          name="Analysis"
          component={Analysis}
          options={{
            title: "Analysis",
            headerStyle: {
              backgroundColor: BackColor,
            },
            headerTitleStyle: {
              color: BasicColor,
            },
            tabBarIcon: ({ color, size}) => (
              <Icon name="areachart" size={size} color={color} />
            )
          }}
        />
        {/*
        // Setting
        */}
        <Tab.Screen
          name="Setting"
          component={Setting}
          options={{
            title: "Setting",
            headerStyle: {
              backgroundColor: BackColor,
            },
            headerTitleStyle: {
              color: BasicColor,
            },
            tabBarIcon: ({ color, size}) => (
              <Icon name="setting" size={size} color={color} />
            )
          }}
        />
        {/*
        // RecordsUpdate
        */}
        <Tab.Screen
          name="RecordsUpdate"
          component={RecordsUpdate}
          options={{
            title: "RecordsUpdate",
            headerStyle: {
              backgroundColor: BackColor,
            },
            headerTitleStyle: {
              color: BasicColor,
            },
            tabBarButton: () => null,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}