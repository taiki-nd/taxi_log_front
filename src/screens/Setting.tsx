import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

export const Setting = (props: any) => {
  console.log("route", props.route);
  useEffect(() => {
    console.log('Home Mount');
    return () => {
      console.log('Home Unmount');
    };
  }, []);
  return (
    <View>
      <Text>設定</Text>
    </View>
  );
};