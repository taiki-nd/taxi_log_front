import React from 'react';
import { View, Text } from 'react-native';

export const UserShow = (props: any) => {
  console.log("route", props.route);
  return (
    <View>
      <Text>ユーザー画面</Text>
    </View>
  );
};