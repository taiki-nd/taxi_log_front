import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { BackColor } from '../styles/common/color';

export const HomeScreen = ({ navigation }: any) => {
  console.log("props", navigation)
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
        title="レコード一覧"
        onPress={() => navigation.navigate('Records')}/>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: BackColor
  }
});