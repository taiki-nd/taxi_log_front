import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { BackColor } from '../styles/common/color';

export const HomeScreen = (props: any) => {
  useEffect(() => {
    console.log('Home Mount');
    return () => {
      console.log('Home Unmount');
    };
  }, []);
  return (
    <View style={styles.background}>
      <Text>ホーム画面</Text>
      <Button
        title="ユーザー"
        onPress={() => props.navigation.navigate('UserShow', {userId: 1})}/>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: BackColor
  }
});