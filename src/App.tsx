import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './screens/HomeScreens';
import { UserShow } from './screens/users/UserShow';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="UserShow"
          component={UserShow}
          options={(props) => ({
            title: `ユーザー詳細画面${props.route.params.userId}`,
          })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}