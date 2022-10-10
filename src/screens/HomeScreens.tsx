import React from 'react';
import { View, Text, Button } from 'react-native';

export const HomeScreen = (props: any) => {
  return (
    <View>
      <Text>ホーム画面</Text>
      <Button
        title="ユーザ"
        onPress={() => props.navigation.navigate('UserShow', {userId: 1})}/>
    </View>
  );
};