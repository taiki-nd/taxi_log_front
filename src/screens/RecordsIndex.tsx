import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: BackColor
  }
});