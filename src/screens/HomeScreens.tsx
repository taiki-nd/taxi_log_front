import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';

export const HomeScreen = (props: any) => {
  useEffect(() => {
    console.log('Home Mount');
    return () => {
      console.log('Home Unmount');
    };
  }, []);
  return (
    <View>
      <Text>ホーム画面</Text>
      <Button
        title="ユーザー"
        onPress={() => props.navigation.navigate('UserShow', {userId: 1})}/>
    </View>
  );
};