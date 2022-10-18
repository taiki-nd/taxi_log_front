import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

export const UserShow = (props: any) => {
  console.log("route", props.route);
  useEffect(() => {
    console.log('Home Mount');
    return () => {
      console.log('Home Unmount');
    };
  }, []);
  return (
    <View>
      <Text>ユーザー画面</Text>
    </View>
  );
};