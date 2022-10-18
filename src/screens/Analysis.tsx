import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

export const Analysis = (props: any) => {
  console.log("route", props.route);
  useEffect(() => {
    console.log('Home Mount');
    return () => {
      console.log('Home Unmount');
    };
  }, []);
  return (
    <View>
      <Text>分析</Text>
    </View>
  );
};