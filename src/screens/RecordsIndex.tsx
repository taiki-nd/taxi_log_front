import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { BackColor } from '../styles/common/color';

export const RecordsIndex = (props: any) => {
  console.log("route", props.route);
  useEffect(() => {
    console.log('Home Mount');
    return () => {
      console.log('Home Unmount');
    };
  }, []);
  return (
    <View style={styles.background}>
      <Text>レコード一覧</Text>
      <Button
        title="Edit"
        onPress={() => props.navigation.navigate('RecordsUpdate', {userId: 1})}
        color="#841584"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: BackColor
  },

  button: {
    backgroundColor: BackColor
  }
});