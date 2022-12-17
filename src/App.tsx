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
import { Signup } from './components/pages/users/Signup';
import { Signup2 } from './components/pages/users/Signup2';
import { Signin } from './components/pages/users/Signin';
import axios from "axios";
import { server } from './utils/constHide';
import { SignupEmail } from './components/pages/users/SignupEmail';
import { RecordsEdit } from './components/pages/records/RecordsEdit';
import { RecordsShow } from './components/pages/records/RecordsShow';
import { Ranking } from './screens/Ranking';

axios.defaults.baseURL = server.baseUrl;

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
            unmountOnBlur:true,
            title: 'HOME',
            headerShown: false,
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
              <Icon name="addfile" size={size} color={color} />
            )
          }}
        />
        {/*
        // Records
        */}
        {/*
        <Tab.Screen
          name="Records"
          component={RecordsIndex}
          options={{
            unmountOnBlur:true,
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
        */}
        {/*
        // Ranking
        */}
        <Tab.Screen
          name="Ranking"
          component={Ranking}
          options={{
            unmountOnBlur:true,
            title: "Ranking",
            headerStyle: {
              backgroundColor: BackColor,
            },
            headerTitleStyle: {
              color: BasicColor,
            },
            tabBarIcon: ({ color, size}) => (
              <Icon name="Trophy" size={size} color={color} />
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
        // Signup
        */}
        <Tab.Screen
          name="Signup"
          component={Signup}
          options={{
            title: "Signup",
            headerStyle: {
              backgroundColor: BackColor,
            },
            headerTitleStyle: {
              color: BasicColor,
            },
            tabBarButton: () => null,
            tabBarStyle: {
              display: 'none',
            }
          }}
        />
        {/*
        // SignupEmail
        */}
        <Tab.Screen
          name="SignupEmail"
          component={SignupEmail}
          options={{
            title: "メールアドレス認証",
            headerStyle: {
              backgroundColor: BackColor,
            },
            headerTitleStyle: {
              color: BasicColor,
            },
            tabBarButton: () => null,
            tabBarStyle: {
              display: 'none',
            }
          }}
        />
        {/**
         * Signup2
         */}
        <Tab.Screen
          name="Signup2"
          component={Signup2}
          options={{
            title: "Create Account",
            headerStyle: {
              backgroundColor: BackColor,
            },
            headerTitleStyle: {
              color: BasicColor,
            },
            tabBarButton: () => null,
            tabBarStyle: {
              display: 'none',
            }
          }}
        />
        {/*
        // Signin
        */}
        <Tab.Screen
          name="Signin"
          component={Signin}
          options={{
            title: "Signin",
            headerStyle: {
              backgroundColor: BackColor,
            },
            headerTitleStyle: {
              color: BasicColor,
            },
            tabBarButton: () => null,
            tabBarStyle: {
              display: 'none',
            }
          }}
        />
        {/*
        // RecordsUpdate
        */}
        <Tab.Screen
          name="RecordsEdit"
          component={RecordsEdit}
          options={{
            title: "Recordの編集",
            headerStyle: {
              backgroundColor: BackColor,
            },
            headerTitleStyle: {
              color: BasicColor,
            },
            tabBarButton: () => null,
            tabBarStyle: {
              display: 'none',
            }
          }}
        />
        {/*
        // RecordsShow
        */}
        <Tab.Screen
          name="RecordsShow"
          component={RecordsShow}
          options={{
            unmountOnBlur:true,
            headerShown: false,
            tabBarButton: () => null,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}