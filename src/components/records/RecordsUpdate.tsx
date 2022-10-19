import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { BackColor } from '../../styles/common/color';

export const RecordsUpdate = (props: any) => {
  console.log("route", props.route);
  useEffect(() => {
    console.log('Home Mount');
    return () => {
      console.log('Home Unmount');
    };
  }, []);
  return (
    <View style={styles.background}>
      <Text>レコード編集</Text>
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